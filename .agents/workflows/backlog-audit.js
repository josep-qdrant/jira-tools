export const meta = {
  name: 'backlog-audit',
  description: 'Read-only Jira backlog audit, end-to-end: scope the backlog, audit every ticket, then synthesize the planning package',
  whenToUse: 'Run the full read-only backlog refinement pipeline (scoper → auditor → synthesizer) with one command instead of chaining three agents by hand. Pass the scope in args.',
  phases: [
    { title: 'Scope',      detail: 'jira-backlog-scoper — build JQL, map customfields, verify the scoring formula; self-flags ambiguous scope', model: 'sonnet' },
    { title: 'Gather',     detail: 'jira-context-gatherer — fetch + dump raw context per batch, on haiku', model: 'haiku' },
    { title: 'Analyze',    detail: 'jira-ticket-auditor — read the dump, write one Obsidian card per ticket, batched (~3), on sonnet', model: 'sonnet' },
    { title: 'Escalate',   detail: 'jira-backlog-scoper / jira-ticket-auditor — re-resolve only the calls flagged as contested, on opus', model: 'opus' },
    { title: 'Synthesize', detail: 'jira-backlog-synthesizer — roll the cards into the 9-doc planning package', model: 'sonnet' },
  ],
}

// ─── args (the human launching this provides the scope; the pipeline cannot
//     pause to ask mid-run, so unconfirmed scope must come in here) ──────────
const a = args || {}
const outputFolder = a.outputFolder
const batchSize = Math.max(1, Math.floor(Number(a.batchSize) || 3)) // clamp: chunk() infinite-loops on 0/negative
const reposRoot = a.reposRoot || null

if (!outputFolder) {
  log('ERROR: args.outputFolder is required. Aborting before touching Jira.')
  return {
    error: 'missing-output-folder',
    hint: 'Invoke with args: { outputFolder, project?, board?, team?, buckets?, reposRoot?, batchSize? }',
  }
}

const scopeLines = [
  a.project ? `- Project: ${a.project}` : null,
  a.board ? `- Board: ${a.board}` : null,
  a.team ? `- Team: ${a.team}` : null,
  a.buckets ? `- Backlog buckets: ${a.buckets}` : null,
].filter(Boolean).join('\n') || '- (none provided — discover scope from the site, and STATE your assumptions in the hand-off note)'

const scopeNote = `${outputFolder}/_scope-handoff.md`

const chunk = (arr, n) => {
  const out = []
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n))
  return out
}

// ─── structured hand-offs ────────────────────────────────────────────────
const SCOPE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    keys: { type: 'array', items: { type: 'string' }, description: 'Every in-scope issue key, ordered by Rank' },
    count: { type: 'integer' },
    jql: { type: 'string' },
    scopeNotePath: { type: 'string' },
    scoringModel: { type: 'string', description: 'The verified formula + value mappings + issues it was checked against' },
    needsEscalation: { type: 'boolean', description: 'True only if the scope boundary itself is genuinely ambiguous (contested team/backlog definition) — not merely under-specified args, which get documented as an assumption instead' },
    escalationQuestion: { type: 'string', description: 'The single contested scope question Opus should resolve (empty if none)' },
  },
  required: ['keys', 'count', 'jql', 'scopeNotePath'],
}

const GATHER_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    tickets: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          key: { type: 'string' },
          contextPath: { type: 'string', description: 'Path to that ticket\'s raw context dump file' },
        },
        required: ['key', 'contextPath'],
      },
    },
  },
  required: ['tickets'],
}

const AUDIT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    cardsWritten: { type: 'integer' },
    keys: { type: 'array', items: { type: 'string' } },
    ready: { type: 'integer' },
    almostReady: { type: 'integer' },
    notReady: { type: 'integer' },
    escalate: { type: 'array', items: { type: 'string' }, description: 'Keys whose readiness/Score is genuinely contested — re-audited on Opus' },
  },
  required: ['cardsWritten', 'keys'], // keys is required: coverage check reconciles it against the scope
}

const SYNTH_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    docsWritten: { type: 'array', items: { type: 'string' } },
    readiness: { type: 'string' },
    actionsAuditConfirmsReadOnly: { type: 'boolean' },
  },
  required: ['docsWritten'],
}

// ─── prompts (each agent reads its own SKILL.md; we only set the job + paths) ─
const scoperPrompt = `You are scoping a Jira backlog for a READ-ONLY refinement audit. Follow your skill exactly (.claude/skills/jira-backlog-scoping/SKILL.md and its references/).

Scope parameters (already confirmed by the human who launched this workflow — do NOT pause to re-confirm them):
${scopeLines}
- Output folder: ${outputFolder}

Do, in order:
1. Create the working folders if missing: run \`mkdir -p ${outputFolder}/tickets\`.
2. Build the explicit JQL for this scope. Rebuild it from project + Team[Team] + Sprint/status ordered by Rank — a board customFilter is NOT a JQL filter.
3. Map every customfield_XXXXX from a representative issue (fields=["*all"], expand=names) and DEDUCE + VERIFY the RICE-style scoring formula by re-checking the arithmetic on several issues. A Score of 0 with a size set means incomplete scoring, not a formula error.
4. Write the hand-off note to ${scopeNote} as Obsidian-native markdown (YAML frontmatter + wikilinks for ticket refs) containing: the scope JQL, the FULL key list + total count, the field map (score factors highlighted), and the verified scoring model.

Read-only on Jira — never create/edit/transition. Do NOT audit individual tickets; that is the next phase.

If the scope BOUNDARY ITSELF is genuinely ambiguous — the team/backlog definition is contested, two readings of "what defines the backlog" give materially different key lists, and you can't resolve it with confidence from the args + site data — set needsEscalation=true and state the single question Opus should resolve. This is NOT for routine under-specification (no team/board given → just discover it from the site and document the assumption, no escalation needed); it's for a genuine fork in interpretation. Most runs need no escalation.

Return the structured result (keys, count, jql, scopeNotePath=${scopeNote}, scoringModel, needsEscalation, escalationQuestion).`

const escalateScopePrompt = (question) => `You are the ESCALATION pass (Opus) for the SCOPE phase. The Sonnet scoping pass flagged the scope boundary itself as genuinely ambiguous: "${question}"

Read the hand-off note at ${scopeNote}. Resolve ONLY this scope question with rigorous reasoning — re-derive the team/board/backlog boundary from the Jira site data available (re-run whatever JQL variants are needed to confirm which reading is correct). Then UPDATE the hand-off note at ${scopeNote} in place (Edit): append a \`## Escalated scope review (Opus)\` section recording the resolution, and if it changes the key list, update the JQL/keys/count in the note to match. Read-only on Jira.

Return the FINAL structured result after resolving (keys, count, jql, scopeNotePath=${scopeNote}, scoringModel, needsEscalation=false, escalationQuestion='').`

const contextDir = `${outputFolder}/_context`

const gatherPrompt = (batch, i, total) => `You are the RETRIEVAL stage (Haiku) of a read-only backlog-audit pipeline. Gather raw context for a batch of tickets and dump it — one file per ticket. Do NOT judge, score, or assess readiness; that is the next stage.

Read-only on Jira. Do, in order:
1. \`mkdir -p ${contextDir}\`.
2. For EACH of these ${batch.length} ticket(s) — batch ${i + 1} of ${total}: ${batch.join(', ')} — fetch it with getJiraIssue in DEFAULT (ADF) format, fields=["*all"], expand=names (markdown truncates custom fields). Capture summary, description, status, priority, assignee, Sprint, every custom field (Score/Impact/Confidence/Size and any design/AC fields), attachments, issuelinks, subtasks.
3. Fetch each ticket's remote links with getJiraIssueRemoteIssueLinks — Figma usually hides here.
4. Collect each ticket's linked Jira keys (subtasks + issuelinks + any *.atlassian.net/browse/ remote links), dedupe, skip the parent, cap at 8 per parent. Fetch each (ADF) and list its design/Notion/Slack/GitHub URLs. One hop only — do not recurse further.
5. Extract EVERY external URL (figma.com, notion.so, slack.com, github.com) from each ticket and its linked tickets, and fetch each verbatim: notion.so → notion-fetch (quote requirements/AC, decisions, open questions); slack.com → slack_read_thread (quote relevant messages); github.com → \`gh pr/issue view\` via Bash (quote title/state/body); figma.com → figma get_metadata. Mark anything unreachable as "unreadable".
6. Write ALL of it VERBATIM (no analysis) to one file per ticket: ${contextDir}/<KEY>-context.md, with sections \`## Jira fields\`, \`## Remote links\`, \`## Linked tickets\`, \`## Notion\`, \`## Slack\`, \`## GitHub\`, \`## Figma\`. This dump is the only thing the analysis stage reads, so be complete.

Return: tickets — one entry per ticket you covered, each {key, contextPath}.`

const analyzePrompt = (batch, gathered, i, total) => `Audit a batch of backlog tickets and write one Obsidian card per ticket. Follow your skill exactly (.claude/skills/jira-ticket-audit/SKILL.md + definition-of-ready + jira-notion-context + slack-mcp + gh-cli + figma-mcp).

The retrieval stage already gathered raw context for this batch — READ THESE FILES FIRST, don't re-fetch from Jira unless something you need is missing from the dump:
${gathered.tickets.map(t => `- ${t.key}: ${t.contextPath}`).join('\n')}

FIRST read the scope hand-off note at ${scopeNote} for the JQL, field map, and VERIFIED scoring model — reuse them, do NOT re-derive.

Audit EXACTLY these ${batch.length} ticket(s) — batch ${i + 1} of ${total}: ${batch.join(', ')}
Write one card per ticket to ${outputFolder}/tickets/<KEY>-<kebab-slug>.md using the audit-card template: full frontmatter (every field populated with the documented controlled vocabulary), the four-axis audit with incoherences in bold, the five-place design hunt, Notion/Slack/GitHub follow-up, code association, and the DoR block at the end.
${reposRoot ? `Code-association repos root: ${reposRoot} — characterize each repo (README + real language) before searching; prefer codegraph, else scoped rg.` : 'No local repos root provided — record code association as "not available" rather than guessing.'}

Read-only on Jira. Do NOT write synthesis docs.

You run on Sonnet (see docs/MODEL_POLICY.md). For any ticket whose readiness/Score call is GENUINELY contested — low confidence, Score contested by judgment (not a missing factor), or an epic-in-disguise whose split is non-obvious — add its key to \`escalate\`. Don't agonise: write your best card now and flag it; a later Opus pass re-audits only the flagged ones. Most tickets need no escalation.

Return: cardsWritten, the keys you wrote, the readiness split (ready / almostReady / notReady), and \`escalate\` (the contested keys, or []).`

const synthPrompt = (missingKeys) => `Every per-ticket audit card now exists in ${outputFolder}/tickets/. Synthesize the full planning package. Follow your skill exactly (.claude/skills/jira-backlog-synthesis/SKILL.md + references/ + assets/).

Read the scope hand-off note at ${scopeNote} for the scope and verified scoring model. Build everything from the cards on disk; re-verify the Score formula and RECOUNT all frontmatter totals with rg/grep before asserting (dor, design_linked/design_source, notion, slack_context, github_context, child_context).
${missingKeys.length ? `\nINCOMPLETE PACKAGE: these scoped tickets have NO audit card (their audit batch failed): ${missingKeys.join(', ')}. State this gap explicitly in the executive summary and master table — do NOT present partial data as complete.\n` : ''}
Write all synthesis documents AND the actions-audit report to ${outputFolder}/ as Obsidian-native markdown (frontmatter, sibling + ticket wikilinks, escape \\| inside tables). Read-only on Jira — any re-query only re-verifies counts.

Return: docsWritten (the filenames), the headline readiness split, and whether the actions-audit confirms Jira was untouched.`

const escalatePrompt = (batch) => `You are the ESCALATION pass (Opus). The Sonnet audit flagged these tickets as having a genuinely contested readiness/Score call: ${batch.join(', ')}. Their cards already exist in ${outputFolder}/tickets/.

For EACH, read its existing card, re-read the scope hand-off note at ${scopeNote} (field map + verified scoring model), and re-fetch the ticket from Jira if needed. Resolve the contested call with rigorous reasoning — re-check the Score arithmetic, the scope boundary, or the epic split. Then UPDATE the card in place (Edit): append the \`## Escalated review (Opus)\` section from the audit-card template appendix with your verdict, and if it changes readiness, update the \`dor:\` frontmatter and the DoR verdict callout to match. Read-only on Jira. Follow the jira-ticket-audit + definition-of-ready skills.

Return: cardsWritten (= tickets you updated), keys (the ones you updated), the readiness split across them, and escalate=[] (no further escalation).`

// ─── pipeline ──────────────────────────────────────────────────────────────
phase('Scope')
log(`Scoping backlog → ${outputFolder} (batch size ${batchSize})`)
let scope = await agent(scoperPrompt, { agentType: 'jira-backlog-scoper', model: 'sonnet', schema: SCOPE_SCHEMA, label: 'scope' })

if (!scope || !Array.isArray(scope.keys) || scope.keys.length === 0) {
  log('Scoper returned no in-scope tickets — aborting before the audit phase.')
  return { outputFolder, error: 'empty-scope', scope }
}

// Scope escalation: rare — only when the scope BOUNDARY is contested, not for
// routine under-specified args (those get an assumption, not an escalation).
if (scope.needsEscalation) {
  phase('Escalate')
  log(`Scope flagged as ambiguous → Opus re-resolve: "${scope.escalationQuestion || 'ambiguous scope boundary'}"`)
  const resolved = await agent(escalateScopePrompt(scope.escalationQuestion), {
    agentType: 'jira-backlog-scoper', model: 'opus', schema: SCOPE_SCHEMA, phase: 'Escalate', label: 'scope-escalate',
  })
  if (resolved && Array.isArray(resolved.keys) && resolved.keys.length) scope = resolved
  else log('Scope escalation returned nothing usable — continuing with the original (flagged) scope.')
}
log(`Scope locked: ${scope.count} tickets. JQL: ${scope.jql}`)

phase('Gather')
const batches = chunk(scope.keys, batchSize)
log(`Auditing ${scope.keys.length} tickets in ${batches.length} batch(es) of ≤${batchSize} (gather on haiku, analyze on sonnet; Opus only for flagged tickets).`)

const runGather = (batch, i, suffix = '') =>
  agent(gatherPrompt(batch, i, batches.length), {
    agentType: 'jira-context-gatherer',
    model: 'haiku',
    schema: GATHER_SCHEMA,
    phase: 'Gather',
    label: `gather:batch-${i + 1}${suffix}`,
  })

const runAnalyze = (gathered, batch, i, suffix = '') => gathered
  ? agent(analyzePrompt(batch, gathered, i, batches.length), {
      agentType: 'jira-ticket-auditor',
      model: 'sonnet',
      schema: AUDIT_SCHEMA,
      phase: 'Analyze',
      label: `analyze:batch-${i + 1}${suffix}`,
    })
  : null

// Each batch flows Gather→Analyze independently (pipeline, not a barrier) — a slow
// batch's gather doesn't hold up a fast batch's analyze. audits[i] aligns with
// batches[i]; a dead batch (transient API/tool error in either stage) is null there.
const audits = await pipeline(
  batches,
  (batch, _b, i) => runGather(batch, i),
  (gathered, batch, i) => runAnalyze(gathered, batch, i),
)

// Retry failed batches once, in place — a dropped batch means its tickets get no
// card and vanish silently from the package. Original batch index is preserved
// (toRetry[k]) so labels/storage land back on the right slot.
const toRetry = batches.map((_, i) => i).filter(i => !audits[i])
if (toRetry.length) {
  log(`${toRetry.length} audit batch(es) failed — retrying once.`)
  const retried = await pipeline(
    toRetry.map(i => batches[i]),
    (batch, _b, k) => runGather(batch, toRetry[k], '-retry'),
    (gathered, batch, k) => runAnalyze(gathered, batch, toRetry[k], '-retry'),
  )
  toRetry.forEach((i, k) => { if (retried[k]) audits[i] = retried[k] })
}

// Coverage from the union of keys the auditors actually wrote — authoritative, unlike
// the self-reported cardsWritten count (catches a batch that wrote 2 of 3 cards too).
const good = audits.filter(Boolean)
const auditedKeys = new Set(good.flatMap(r => r.keys || []))
const missingKeys = scope.keys.filter(k => !auditedKeys.has(k))
const cardsWritten = auditedKeys.size
const readiness = {
  ready: good.reduce((n, r) => n + (r.ready || 0), 0),
  almostReady: good.reduce((n, r) => n + (r.almostReady || 0), 0),
  notReady: good.reduce((n, r) => n + (r.notReady || 0), 0),
}

if (cardsWritten === 0) {
  log('Every audit batch failed after retry — no cards written. Aborting before synthesis.')
  return { outputFolder, jql: scope.jql, scopedCount: scope.count, error: 'audit-failed', missingKeys }
}
if (missingKeys.length) {
  log(`WARNING: ${missingKeys.length} ticket(s) have no card: ${missingKeys.join(', ')}. Synthesis will flag the package as incomplete.`)
}
log(`Audit done: ${cardsWritten}/${scope.count} cards written.`)

// Escalation: re-audit on Opus only the tickets Sonnet flagged as contested.
// They have cards already; the Opus pass updates them in place. Cheap because
// it runs on a handful of keys, not the whole backlog (see docs/MODEL_POLICY.md).
const escalateKeys = [...new Set(good.flatMap(r => r.escalate || []))].filter(k => auditedKeys.has(k))
if (escalateKeys.length) {
  phase('Escalate')
  log(`${escalateKeys.length} contested ticket(s) → Opus re-audit: ${escalateKeys.join(', ')}`)
  await parallel(chunk(escalateKeys, batchSize).map((b, i) => () =>
    agent(escalatePrompt(b), { agentType: 'jira-ticket-auditor', model: 'opus', schema: AUDIT_SCHEMA, phase: 'Escalate', label: `escalate:batch-${i + 1}` })))
}

phase('Synthesize')
const synth = await agent(synthPrompt(missingKeys), { agentType: 'jira-backlog-synthesizer', model: 'sonnet', schema: SYNTH_SCHEMA, label: 'synthesize' })

return {
  outputFolder,
  jql: scope.jql,
  scopedCount: scope.count,
  cardsWritten,
  missingKeys,
  escalatedKeys: escalateKeys,
  readiness,
  synthesisDocs: synth?.docsWritten || [],
  readOnlyConfirmed: synth?.actionsAuditConfirmsReadOnly ?? null,
}

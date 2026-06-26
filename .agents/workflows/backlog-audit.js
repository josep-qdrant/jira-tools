export const meta = {
  name: 'backlog-audit',
  description: 'Read-only Jira backlog audit, end-to-end: scope the backlog, audit every ticket, then synthesize the planning package',
  whenToUse: 'Run the full read-only backlog refinement pipeline (scoper → auditor → synthesizer) with one command instead of chaining three agents by hand. Pass the scope in args.',
  phases: [
    { title: 'Scope',      detail: 'jira-backlog-scoper — build JQL, map customfields, verify the scoring formula', model: 'sonnet' },
    { title: 'Audit',      detail: 'jira-ticket-auditor — one Obsidian card per ticket, batched (~3), on sonnet', model: 'sonnet' },
    { title: 'Escalate',   detail: 'jira-ticket-auditor — re-audit only the tickets Sonnet flagged as contested, on opus', model: 'opus' },
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
  },
  required: ['keys', 'count', 'jql', 'scopeNotePath'],
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

Return the structured result (keys, count, jql, scopeNotePath=${scopeNote}, scoringModel).`

const auditorPrompt = (batch, i, total) => `Audit a batch of backlog tickets and write one Obsidian card per ticket. Follow your skill exactly (.claude/skills/jira-ticket-audit/SKILL.md + definition-of-ready + jira-notion-context + slack-mcp + gh-cli).

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
const scope = await agent(scoperPrompt, { agentType: 'jira-backlog-scoper', model: 'sonnet', schema: SCOPE_SCHEMA, label: 'scope' })

if (!scope || !Array.isArray(scope.keys) || scope.keys.length === 0) {
  log('Scoper returned no in-scope tickets — aborting before the audit phase.')
  return { outputFolder, error: 'empty-scope', scope }
}
log(`Scope locked: ${scope.count} tickets. JQL: ${scope.jql}`)

phase('Audit')
const batches = chunk(scope.keys, batchSize)
log(`Auditing ${scope.keys.length} tickets in ${batches.length} batch(es) of ≤${batchSize} (sonnet; Opus only for flagged tickets).`)

const runBatch = (batch, i, suffix = '') =>
  agent(auditorPrompt(batch, i, batches.length), {
    agentType: 'jira-ticket-auditor',
    model: 'sonnet',
    schema: AUDIT_SCHEMA,
    phase: 'Audit',
    label: `audit:batch-${i + 1}${suffix}`,
  })

// audits[i] aligns with batches[i]; a dead batch (transient API/tool error) is null there.
const audits = await parallel(batches.map((batch, i) => () => runBatch(batch, i)))

// Retry failed batches once, in place — a dropped batch means its tickets get no
// card and vanish silently from the package. Index is preserved so we know which.
const toRetry = batches.map((_, i) => i).filter(i => !audits[i])
if (toRetry.length) {
  log(`${toRetry.length} audit batch(es) failed — retrying once.`)
  const retried = await parallel(toRetry.map(i => () => runBatch(batches[i], i, '-retry')))
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

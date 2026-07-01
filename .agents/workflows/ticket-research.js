export const meta = {
  name: 'ticket-research',
  description: 'Read-only deep research on specific Jira tickets (1–N keys): gather all context, analyse, write one dossier per ticket — model-tiered Haiku→Sonnet→Opus',
  whenToUse: 'Use when you want a deep dive on a few SPECIFIC tickets (not a whole backlog). Pass the keys in args. Cheaper and deeper than running the backlog-audit pipeline on a 1-ticket scope: Haiku gathers the context, Sonnet writes the dossier, Opus only re-judges a contested call.',
  phases: [
    { title: 'Preflight', detail: 'doctor — verify Atlassian MCP (required) and optional connectors/config are actually reachable before spending tokens; aborts here on a required failure', model: 'haiku' },
    { title: 'Gather',   detail: 'jira-context-gatherer, haiku — fetch ticket + remote links + one-hop linked tickets + Notion/Slack/GitHub/Figma, dump raw context', model: 'haiku' },
    { title: 'Analyze',  detail: 'sonnet — four-axis audit, design hunt, code association, DoR; write the research dossier', model: 'sonnet' },
    { title: 'Escalate', detail: 'opus — only the tickets Sonnet flagged as contested (low confidence / contested Score / epic)', model: 'opus' },
  ],
}

// ─── args — the human picks the tickets; the run cannot pause to ask ─────────
// args sometimes arrives as a JSON-encoded string instead of an object (seen
// in practice) — tolerate that instead of silently reading .outputFolder off a string.
let a = args || {}
if (typeof a === 'string') {
  try { a = JSON.parse(a) } catch (e) { a = {} }
}
const keys = (Array.isArray(a.keys) ? a.keys : (a.key ? [a.key] : []))
  .map(k => String(k).trim().toUpperCase()).filter(Boolean)
const outputFolder = a.outputFolder
const reposRoot = a.reposRoot || null
const escalateEnabled = a.escalate !== false // default on

if (!outputFolder) {
  log(`ERROR: args.outputFolder is required. Aborting before touching Jira. Received args: ${JSON.stringify(args)}`)
  return { error: 'missing-output-folder', hint: 'Invoke with args: { keys: ["ABC-1","ABC-2"], outputFolder, reposRoot?, escalate? }', argsReceived: args }
}
if (!keys.length) {
  log(`ERROR: args.keys (or args.key) is required — this workflow researches SPECIFIC tickets, not a whole backlog. Received args: ${JSON.stringify(args)}`)
  return { error: 'missing-keys', hint: 'Pass keys: ["ABC-123", ...]. For a whole backlog use the backlog-audit workflow.', argsReceived: args }
}

const researchDir = `${outputFolder}/_research`
const projectPrefixes = [...new Set(keys.map(k => (k.match(/^([A-Z][A-Z0-9]+)-\d+$/) || [])[1]).filter(Boolean))]

// ─── structured hand-offs ────────────────────────────────────────────────
const DOCTOR_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    ready: { type: 'boolean', description: 'True only if every REQUIRED check (Atlassian MCP, project visibility for each key\'s project prefix) passed' },
    requiredFailures: { type: 'array', items: { type: 'string' } },
    warnings: { type: 'array', items: { type: 'string' } },
    report: { type: 'string', description: 'The short human-readable checklist from the doctor skill' },
  },
  required: ['ready', 'requiredFailures', 'warnings', 'report'],
}

const GATHER_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    key: { type: 'string' },
    title: { type: 'string' },
    requiresUi: { type: 'string', enum: ['yes', 'probable', 'no'] },
    contextPath: { type: 'string', description: 'Path to the raw context dump file' },
    linkedKeys: { type: 'array', items: { type: 'string' } },
  },
  required: ['key', 'contextPath'],
}

const ANALYZE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    key: { type: 'string' },
    cardPath: { type: 'string' },
    dor: { type: 'string', enum: ['ready', 'almost-ready', 'not-ready'] },
    confidence: { type: 'string', enum: ['low', 'medium', 'high'] },
    needsEscalation: { type: 'boolean' },
    escalationQuestion: { type: 'string', description: 'The single contested question Opus should resolve (empty if none)' },
  },
  required: ['key', 'cardPath', 'dor'],
}

const ESCALATE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    key: { type: 'string' },
    resolved: { type: 'boolean' },
    revisedDor: { type: 'string', enum: ['ready', 'almost-ready', 'not-ready', 'unchanged'] },
    verdict: { type: 'string' },
  },
  required: ['key', 'verdict'],
}

// ─── prompts ─────────────────────────────────────────────────────────────
const doctorPrompt = `You are the PREFLIGHT stage (Haiku) of a read-only ticket-research run. Before fetching any ticket, verify the tools this run depends on are reachable and authorized. Follow your skill exactly (.claude/skills/doctor/SKILL.md).

${projectPrefixes.length ? `- Project(s) these keys belong to (check each is visible): ${projectPrefixes.join(', ')}` : '- Could not derive a project key from args.keys — skip the project-visibility check.'}
${reposRoot ? `- reposRoot this run will use (check the path exists): ${reposRoot}` : '- No reposRoot given — skip the QDRANT_REPOS_ROOT check.'}

Run every check from the skill (Atlassian required; gh/Notion/Slack/Figma/engram/QDRANT optional). Read-only — every probe is a read/search/whoami/status call, never a write. Return the structured verdict.`

const gatherPrompt = (key) => `You are the RETRIEVAL stage (Haiku) of a read-only ticket-research pipeline. Your ONLY job is to gather raw context for ${key} and dump it to a file. Do NOT judge, score, or assess readiness — that is the next stage.

Read-only on Jira. Do, in order:
1. \`mkdir -p ${researchDir}\`.
2. Fetch ${key} with getJiraIssue in DEFAULT (ADF) format, fields=["*all"], expand=names (markdown format truncates custom fields). Capture summary, description, status, priority, assignee, Sprint, every custom field (Score/Impact/Confidence/Size and any design/AC fields), attachments, issuelinks, subtasks.
3. Fetch its remote links with getJiraIssueRemoteIssueLinks — Figma usually hides here.
4. Collect the linked Jira keys (subtasks + issuelinks + any *.atlassian.net/browse/ remote links), dedupe, skip ${key}, cap at 8. Fetch each (ADF) and list its design/Notion/Slack/GitHub URLs. Do NOT recurse beyond one hop.
5. Extract EVERY external URL (figma.com, notion.so, slack.com, github.com) from ${key} and its linked tickets, and fetch each verbatim:
   - notion.so → notion-fetch the page (mcp__claude_ai_Notion__ or mcp__notion__ prefix, whichever is on your tool list); quote the requirements/AC, decisions, open questions.
   - slack.com → slack_read_thread (mcp__claude_ai_Slack__ or mcp__slack__ prefix; channel id + thread_ts from the URL); quote the relevant messages.
   - github.com → \`gh pr view <n> --repo <owner>/<repo> --json title,state,body,url\` (or \`gh issue view\`) via Bash; quote title/state/body.
   - figma.com → get_metadata (mcp__claude_ai_Figma__ or mcp__figma__ prefix).
   Mark anything unreachable as "unreadable".
6. Write ALL of it VERBATIM (no analysis) to ${researchDir}/${key}-context.md with sections: \`## Jira fields\`, \`## Remote links\`, \`## Linked tickets\`, \`## Notion\`, \`## Slack\`, \`## GitHub\`, \`## Figma\`. Quote sources; this dump is the only thing the analysis stage reads, so be complete.

Return: key, title, requiresUi (yes|probable|no from a quick read), contextPath=${researchDir}/${key}-context.md, linkedKeys.`

const analyzePrompt = (g, key) => `You are the ANALYSIS stage (Sonnet) of a read-only ticket-research pipeline. The retrieval stage already gathered all context for ${key} into ${g.contextPath}. READ THAT FILE FIRST — it has the Jira fields, remote links, one-hop linked tickets, and the fetched Notion/Slack/GitHub/Figma content. Only re-fetch from Jira if the dump is missing something you must have.

Follow the jira-ticket-audit skill exactly (.claude/skills/jira-ticket-audit/SKILL.md + definition-of-ready + jira-notion-context). There is NO pre-built scope or scoring model here — map ${key}'s own score fields (Impact / Confidence / Size) from the dump and VERIFY the arithmetic yourself. A Score of 0 with a size set is "scoring incomplete", not a formula error.

Write a deep research dossier for ${key} to ${outputFolder}/${key}-<kebab-slug>.md using the audit-card template (full frontmatter with the controlled vocabulary, the four-axis audit with incoherences in bold, the five-place design-hunt result, the linked-ticket / Notion / Slack / GitHub context, code association, and the DoR block). Then fill the template's research-depth appendix after the DoR block — the \`## Open questions\` and \`## Recommendation\` sections defined at the end of audit-card-template.md (Open questions = what a human must answer before this is plannable; Recommendation = your call [plan as-is / refine first / split / drop] + the single next action).
${reposRoot ? `Code repos root: ${reposRoot} — characterize each repo (README + real language) before searching; prefer codegraph, else scoped rg.` : 'No repos root provided — record code association as "not available" rather than guessing.'}

Read-only on Jira. Then self-assess the contested-call test: is the readiness/Score verdict genuinely contested — confidence low, Score arithmetic contested (judgment, not a missing factor), or an epic-in-disguise whose split is non-obvious? If yes, set needsEscalation=true and state the SINGLE question Opus should resolve; otherwise needsEscalation=false.

Return: key, cardPath (the file you wrote), dor (ready|almost-ready|not-ready), confidence (low|medium|high), needsEscalation, escalationQuestion.`

const escalatePrompt = (an, key) => `You are the ESCALATION stage (Opus). The Sonnet analysis of ${key} flagged a contested call:
"${an.escalationQuestion || 'low-confidence readiness/Score verdict'}"

Read the dossier at ${an.cardPath} and the raw context at ${researchDir}/${key}-context.md. Resolve ONLY that question with rigorous reasoning — re-check the Score arithmetic, the scope boundary, or the epic split as relevant. Then Edit the dossier: append the \`## Escalated review (Opus)\` section from the audit-card template appendix with your verdict; if it changes readiness, also update the \`dor:\` frontmatter and the DoR verdict callout to match. Read-only on Jira.

Return: key, resolved, revisedDor (ready|almost-ready|not-ready|unchanged), verdict (one paragraph).`

// ─── pipeline — each key flows Gather→Analyze→Escalate independently ────────
phase('Preflight')
log('Preflight: verifying Atlassian MCP + optional connectors/config before touching Jira.')
const doctor = await agent(doctorPrompt, { agentType: 'doctor', model: 'haiku', schema: DOCTOR_SCHEMA, phase: 'Preflight', label: 'preflight' })

if (doctor && doctor.ready === false) {
  log(`Preflight FAILED — required check(s) not met: ${(doctor.requiredFailures || []).join('; ')}. Aborting before touching Jira.`)
  return { outputFolder, error: 'preflight-failed', requiredFailures: doctor.requiredFailures, warnings: doctor.warnings, report: doctor.report }
}
if (!doctor) {
  log('Preflight check itself failed to run (non-fatal) — continuing without a preflight verdict.')
} else if (doctor.warnings && doctor.warnings.length) {
  log(`Preflight passed with ${doctor.warnings.length} warning(s): ${doctor.warnings.join('; ')}`)
} else {
  log('Preflight passed — all required tools reachable.')
}

phase('Gather')
log(`Researching ${keys.length} ticket(s): ${keys.join(', ')} → ${outputFolder}`)

const results = await pipeline(
  keys,
  // Stage 1 — Gather (Haiku): cheap, parallel retrieval into a context dump.
  (key) => agent(gatherPrompt(key), { agentType: 'jira-context-gatherer', model: 'haiku', schema: GATHER_SCHEMA, phase: 'Gather', label: `gather:${key}` }),
  // Stage 2 — Analyze (Sonnet): the dossier. Skip if gather died (no context).
  (g, key) => g
    ? agent(analyzePrompt(g, key), { agentType: 'jira-ticket-auditor', model: 'sonnet', schema: ANALYZE_SCHEMA, phase: 'Analyze', label: `analyze:${key}` })
    : null,
  // Stage 3 — Escalate (Opus): only the contested ones, only if enabled.
  (an, key) => (an && escalateEnabled && an.needsEscalation)
    ? agent(escalatePrompt(an, key), { agentType: 'jira-ticket-auditor', model: 'opus', schema: ESCALATE_SCHEMA, phase: 'Escalate', label: `escalate:${key}` })
        .then(e => ({ ...an, escalated: true, escalation: e }))
    : an,
)

const done = results.filter(Boolean)
const failed = keys.filter(k => !done.some(r => r.key === k))
const escalated = done.filter(r => r.escalated).map(r => r.key)
if (failed.length) log(`WARNING: no dossier for: ${failed.join(', ')} (gather or analyze failed).`)
log(`Done: ${done.length}/${keys.length} dossiers. Escalated to Opus: ${escalated.length ? escalated.join(', ') : 'none'}.`)

return {
  outputFolder,
  researched: done.map(r => ({ key: r.key, cardPath: r.cardPath, dor: r.escalation && r.escalation.revisedDor && r.escalation.revisedDor !== 'unchanged' ? r.escalation.revisedDor : r.dor, escalated: !!r.escalated })),
  escalated,
  failed,
}

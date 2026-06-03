## Workflow overview — Jira backlog audit and refinement (summary)

This repository provides a three-step, read-only pipeline to audit a Jira backlog and produce a planning-ready package (Obsidian-style markdown). This document explains, in one place, what the workflow does, what it looks at, what parameters it needs, the decisions it makes, and where to find deeper details.

## Short summary

- Purpose: scope a backlog, audit each ticket for readiness, and synthesize cross-cutting planning artifacts (master table, executive summary, readiness plan).
- Read-only: the pipeline only reads Jira, Notion, Slack, Figma and GitHub (via tools). It never writes to Jira or external systems — the only writes are markdown files on disk.
- Output: an Obsidian-style folder with one markdown card per ticket and 9 synthesis documents (index, executive summary, master table, methodology, design/code reviews, plan, actions-audit, etc.).

## Pipeline (three primary phases)

1. Scope the backlog (`jira-backlog-scoping`) — build an explicit JQL scope, map `customfield_XXXXX` → readable labels, and deduce & verify the scoring model (multiplicative RICE-style: Score = Impact × Confidence × Size factor). Output: scope JQL, key list, field map, verified scoring model.

2. Audit each ticket (`jira-ticket-audit`) — process tickets in small batches (~3), evaluate four axes (goal/scope clarity; UI/design need; size coherence — recompute Score; prioritization soundness), hunt for designs (five-place hunt), follow Notion/Slack/GitHub links (one-hop for linked tickets), associate tickets to repos/code, and write one Obsidian markdown card per ticket that ends with a Definition of Ready (DoR) block.

3. Synthesize (`jira-backlog-synthesis`) — roll cards into the planning package: master table (Score verification), executive summary, cross-cutting findings, readiness plan grouped by DoR verdict, design & code reviews, tickets-by-project, and actions audit proving read-only activity.

(You can run the full chain end-to-end or invoke subagents for each phase.)

## What the workflow looks at

- Jira issue fields (summary, description, status, priority, assignee, Sprint, custom fields such as Score/Impact/Confidence/Size, attachments, issue links, remote links).
- Remote links and attachments (Figma often hides in `remoteIssueLinks`).
- Notion pages linked from a ticket (Acceptance Criteria frequently live in Notion) — pages are opened and extracted read-only.
- Slack threads or channels referenced by URLs — threads are read and summarized for decisions/links.
- GitHub PRs/issues referenced in tickets — fetched via `gh` CLI for title/state/body and embedded links.
- Local code repositories (optional): characterise repos (README/language) and search with `codegraph_*` tools or scoped `rg` sweeps for ticket → repo mapping.

## Decisions & rules the workflow follows (key logic)

- Always confirm scope parameters (board, team, project, what defines the backlog) before querying Jira.
- Score model: deduce RICE-style mapping and verify arithmetic on issues. If Score can't be reconciled (Score == 0), label it "scoring incomplete" rather than assume a formula error.
- Design hunt: check five places (design fields, attachments, description/AC, issue links, remote links) and record where a design was found or not.
- Linked-ticket recursion: follow one hop (subtasks & issue links) and hunt each linked ticket for design/Notion/Slack/GitHub. Cap at ~8 linked tickets per parent.
- Notion: a Notion link counts as AC only if the page was opened and contains AC (otherwise mark as "linked but unreadable"). Build a Notion coverage registry per audit.
- DoR (Definition of Ready): every ticket receives one verdict (Ready / Almost ready / Not ready) and a seven-point checklist; deductions (inferred items) are recorded as "🔎 deduced (to verify)" and not marked ✅ until confirmed.
- Code association: prefer `codegraph` MCP tools when available; otherwise perform scoped `rg` searches on a per-repo basis. Characterize repo by its README and manifest files before searching.

## Required parameters (from the user)

- For a full backlog audit: board ID, team name (or team UUID if known), project key, which buckets/sprints define the backlog, and the output folder where markdown is written.
- For sprint planning: team members + availability (PTO), sprint length & start date, goals/themes, and audited backlog location.
- For Notion/Slack/Figma/GitHub access: corresponding MCP tokens or `gh` auth as configured in `.mcp.json` and environment.
- Optional for code association: `AGENTS.local.md` with `QDRANT_REPOS_ROOT=/absolute/path/to/your/repos` or local clones in a known location.

## Agents & skills (who does what)

- Agents (autonomous):
  - `jira-backlog-scoper` (model: Sonnet) — scopes backlog, maps fields, verifies scoring. Tools: Atlassian MCP read calls, host read/grep.
  - `jira-ticket-auditor` (model: Opus) — per-ticket audit, Notion/Slack/Figma follow-up, code association, writes ticket cards. Tools: Atlassian/Notion/Figma/Slack MCP read calls, `gh` via Bash, codegraph/rg.
  - `jira-backlog-synthesizer` (model: Sonnet) — synthesizes cards into the planning package, re-verifies counts and arithmetic, writes synthesis docs.

- Skills: detailed instruction sets each agent runs. Key skills:
  - `jira-backlog-scoping` — scope reconstruction and scoring verification (STEP 1).
  - `jira-ticket-audit` — per-ticket audit method, five-place design hunt, linked-ticket recursion (STEP 2).
  - `jira-backlog-synthesis` — synthesis document specs and verification (STEP 3).
  - `definition-of-ready` — DoR rubric: verdicts, 7-point checklist, reason taxonomy, deductions semantics.
  - `jira-notion-context` — detection, registration, and extraction of Notion docs (used in audit Step 3b).
  - `slack-mcp`, `gh-cli`, `atlassian-mcp`, `figma` skills — connectors and usage guidance.

(See `WORKFLOW.md` and the `.agents/agents/*.md` and `.agents/skills/*/SKILL.md` files for the full authoritative text.)

## Inputs / outputs & file conventions

- Output folder: an Obsidian vault. Each ticket card is a markdown file named `<KEY>-<kebab-slug>.md` and begins with YAML frontmatter (ticket, aliases, title, type, status, size, impact, confidence, score, dor, repos...).
- Synthesis documents are ordered and frontmattered (index, executive summary, master table, scoring/methodology, design/code reviews, etc.).
- Actions audit: a document enumerating every connector call (all are reads) to prove no writes were done to Jira.

## Security & configuration

- Configure MCP servers and tokens in `.mcp.json` and environment variables (Atlassian, Notion, Figma, Slack, engram memory). Do not commit secrets.
- `engram` is used for local persistent memory (scope, field map, decisions). Install and configure it if you want cross-session memory.
- `gh` CLI is required for GitHub fetches; authenticate with `gh auth login`.

## How to run (example prompts)

- Full audit (one-shot):

```
Do a full backlog audit for board [ID], team "[team name]".
Use the jira-backlog-scoping → jira-ticket-audit → jira-backlog-synthesis pipeline.
Save all output as Obsidian markdown in a new folder called refinement-[date].
```

- Phase-by-phase using subagents (autonomous):
```
/agent jira-backlog-scoper
# (scope the backlog; confirm JQL and save hand-off)
/agent jira-ticket-auditor
# (audit the scoped tickets; write one card per ticket)
/agent jira-backlog-synthesizer
# (synthesize the cards into the planning package)
```

- Quick DoR check:
```
Is PM-207 ready to start? Use the definition-of-ready rubric.
```

## Where to find more detail (authoritative files)

- `AGENTS.md` — golden rules, output format, quick gotchas (read-only guarantee, Obsidian conventions).
- `WORKFLOW.md` — step-by-step guide, prompts, tips for talking to the agent, example flows.
- `README.md` — repo summary, required tools and MCP servers.
- `.agents/agents/*.md` — autonomous agent definitions (models, tools, boundaries).
- `.agents/skills/*/SKILL.md` — method-level, step-by-step instructions (the canonical implementation notes).

---

If you want, I can (a) copy this file into `docs/` (done), (b) add cross-links to `AGENTS.md` / `WORKFLOW.md`, (c) produce a short runbook with exact example prompts and a checklist for pre-run configuration (Atlassian tokens, `engram`, `gh`), or (d) generate a printable one-page cheat sheet. Tell me which of (b|c|d) you want next.
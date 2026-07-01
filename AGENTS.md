# Jira backlog audit

Caveman checklist for Jira backlog audit / refinement. Detail lives in the
skills — this file is only the always-loaded safety net + map.

## Non-negotiables

- **Jira read only.** Search, get issue, remote links, metadata — never create,
  edit, transition, comment, or otherwise write to Jira.
- **No invention.** Missing data is `Not recorded` / `Uncertain`, never guessed.
- **Verify.** Re-check score arithmetic and aggregate counts with `rg` / `grep`.
- **Ask scope first.** Confirm team/board, project, backlog definition, and
  destination folder before querying.
- **Disk = markdown deliverables only.** Work in small batches.

## Two entry points

- **Whole backlog** → `backlog-audit` workflow: scope → audit each ticket →
  synthesize. Skills in order: `jira-backlog-scoping` → `jira-ticket-audit` →
  `jira-backlog-synthesis`.
- **A few specific tickets** → `ticket-research` workflow: deep dossier per key
  (gather → analyse → escalate). Cheaper and deeper than the full pipeline — don't
  run the whole backlog audit on a 1-ticket scope.

Both workflows run a `doctor` Preflight phase first that proves the MCP
connectors/config are actually reachable before spending tokens on the rest.
A required failure (Atlassian MCP) aborts right there. Also invokable
standalone any time: "check my setup" / "run the doctor".

Both read-only, at `.agents/workflows/*.js`. Flagship details in `WORKFLOW.md`.

## Skills

Each skill carries its own steps and gotchas — invoke it for the detail.

- `jira-backlog-scoping` — scope, JQL, field map, scoring formula.
- `jira-ticket-audit` — per-ticket card, four-axis audit, design hunt, code link, DoR.
  Auto-detects grouping tickets (Objective/Milestone, native `parent` hierarchy)
  and switches to a lean roll-up instead — see its Step 0.
- `jira-backlog-synthesis` — roll-up docs, master table, actions audit. For an
  Objective-scoped run: one condensed `MILESTONE_PLAN.md` instead of the 10-doc
  package.
- `definition-of-ready` — readiness verdict + 7-point checklist; also the
  Milestone sprint-fit call ("Applying DoR to a Milestone").
- `obsidian-vault` — output format conventions for every deliverable on disk.
- `writing-style` — how output reads: human, concise, TL;DR-first, no repetition.
- `jira-notion-context` — read Notion docs linked from tickets (Step 3b).
- `atlassian-mcp` — read-only Jira / Confluence MCP plumbing.
- `slack-mcp` / `gh-cli` / `figma-mcp` — read Slack threads / GitHub PRs / Figma
  designs linked from tickets.
- `sprint-planning` — sprint plan after an audit. `ticket-triage` — inbound support
  (both draft-only — see their skills' read-only/draft-only note).
- `doctor` — live preflight check (MCP reachability, `gh`/engram/QDRANT
  config) before either workflow spends tokens. Required check: Atlassian MCP.

## Models

Cheapest model that does the job: **Haiku** mechanical retrieval, **Sonnet** the
default workhorse, **Opus** escalation only (contested score, ambiguous scope,
epic split). Full policy + escalation triggers: `docs/MODEL_POLICY.md`.

## Memory (engram)

The engram protocol is injected each session by its hook. Project caveat: engram
is **local only** (`~/.engram/engram.db`) — the read-only-on-Jira rule is
unaffected. `mem_search` at start for prior scope/field-map/formula; close with
`mem_session_summary`.

## Code association

Qdrant repos live under `QDRANT_REPOS_ROOT`.

1. Read `AGENTS.local.md` first; use its `QDRANT_REPOS_ROOT` if present.
2. If missing, ask the user before doing code association.
3. The real repo map, duplicates-to-ignore, and proven search terms live in the
   gitignored `QDRANT-ENV.local.md`.

Generic method (characterize repos per run, codegraph vs `rg`):
`.agents/skills/jira-ticket-audit/references/code-identification.md`.

## Gotchas that bite immediately

The rest live in their skills. Two are universal:

- Jira search responses are huge → fetch small batches with explicit fields.
- Read issues in **default (ADF) format, not markdown** — markdown truncates
  custom-field values.

## More detail

- Usage / possibilities: `USAGE.md` · user guide: `WORKFLOW.md` · overview: `docs/WORKFLOW_OVERVIEW.md`
- Model policy: `docs/MODEL_POLICY.md`
- Workflows: `.agents/workflows/{backlog-audit,ticket-research}.js`
- Qdrant repo map + worked example: `QDRANT-ENV.local.md` (gitignored)

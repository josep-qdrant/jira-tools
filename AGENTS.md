# Jira backlog audit

Lean instructions for Jira backlog audit / refinement work. Details live in the
skills; this file is the caveman checklist.

## Non-negotiables

- **Jira read only.** Use reads only: search, get issue, remote links, metadata.
  Never create, edit, transition, comment, or otherwise write to Jira.
- **No invention.** Missing data is `Not recorded` / `Uncertain`, never guessed.
- **Verify.** Re-check score arithmetic and aggregate counts with `rg` / `grep`.
- **Ask scope first.** Before querying, confirm team/board, project, backlog
  definition, and destination folder.
- **Write only markdown deliverables on disk.** Work in small batches.

## Workflow

Use the skills in this order:

1. `jira-backlog-scoping` — scope, JQL, field map, scoring formula.
2. `jira-ticket-audit` — one card per ticket, design hunt, code association, DoR.
3. `jira-backlog-synthesis` — roll-up docs, counts, master table, actions audit.

Related skills:

- `definition-of-ready` — readiness verdict and 7-point checklist.
- `jira-notion-context` — read the Notion docs linked from tickets (Step 3b).
- `atlassian-mcp` — read-only Jira / Confluence MCP mechanics (the plumbing).
- `slack-mcp` — read Slack threads/channels linked from tickets.
- `gh-cli` — read GitHub PRs/issues linked from tickets.
- `sprint-planning` — sprint plan after an audit.

## Memory (engram)

Persistent memory via the `engram` MCP server (`mem_*` tools). An audit spans
sessions; use memory so scope and decisions survive resets and compaction.

- **Local only.** engram writes to a local DB (`~/.engram/engram.db`), never to
  Jira. The read-only rule above is unaffected.
- **Search first.** At session start, `mem_search` for prior scope, field map,
  and scoring formula before re-deriving them.
- **Save proactively** (don't wait to be asked): verified scope + JQL, the
  custom-field map, the scoring formula, decisions, per-ticket gotchas,
  design-link locations, and DoR verdict rationale.
- **Close** with `mem_session_summary` (goal, discoveries, accomplished, next
  steps, relevant files).

## Output format — Obsidian vault

Deliverables go into the working folder as Obsidian-native markdown.

- Every deliverable starts with YAML frontmatter and `tags:`.
- Internal deliverable links use wikilinks: `[[PM-207-slug|PM-207]]`.
- Ticket keys in prose become wikilinks.
- External URLs stay markdown links.
- In markdown tables, escape wikilink aliases: `[[PM-207-slug\|PM-207]]`.
- Cards use aliases in frontmatter, e.g. `aliases: ["PM-207"]`.
- Use controlled tags only: `backlog-audit`, `ticket` / `synthesis`, project key,
  and `readiness/ready`, `readiness/almost-ready`, `readiness/not-ready`.
- Use Obsidian callouts for verdicts / alerts:
  - `> [!info]` read-only note
  - `> [!success]` ready
  - `> [!warning]` almost ready, estimate risk, hidden scope
  - `> [!danger]` not ready
  - `> [!note]` canonical / source-of-truth pointer

Schemas and structures:

- Ticket cards: `.agents/skills/jira-ticket-audit/assets/audit-card-template.md`
- Synthesis docs: `.agents/skills/jira-backlog-synthesis/references/synthesis-docs.md`
- Actions audit: `.agents/skills/jira-backlog-synthesis/assets/actions-audit-template.md`
- DoR block: `.agents/skills/definition-of-ready/assets/dor-block-template.md`

## Code association

The Qdrant repos live under `QDRANT_REPOS_ROOT`.

1. Read `AGENTS.local.md` first; use its `QDRANT_REPOS_ROOT` if present.
2. If missing, ask the user before doing code association.
3. Characterize each repo by README + actual language before searching.
4. Prefer `codegraph` if available; otherwise use scoped `rg` searches.

The skills are project-agnostic — they build the repo map per run. The real
Qdrant repo map + duplicates-to-ignore list + proven search terms now live in a
local, gitignored env file:

- `QDRANT-ENV.local.md` — the Qdrant Cloud repo map and domain caveats.
- `.agents/skills/jira-ticket-audit/references/code-identification.md` — the
  generic method (characterize repos per run).

## Gotchas

- Board quick-filter is not a JQL filter. Rebuild scope from explicit fields.
- Backlog buckets may be future sprints.
- Jira search responses are huge. Fetch small batches and explicit fields.
- `getJiraIssue` markdown output truncates custom fields; use default format.
- Score can be `0` when factors are missing. Mark scoring incomplete.
- Figma often lives in remote links, not design fields.
- **Also check linked/child tickets (Step 3c).** Subtasks, issue-link targets,
  and Jira-pointing remote links can carry the Figma, Notion doc, Slack thread,
  or GitHub PR that the parent ticket only references. One hop, cap at ~8 keys.
- Attachments are not automatically design assets. Verify.
- Wrong language glob means false zero results.
- Keep code sweeps to one repo and a few terms.
- Host paths and shell mount paths may differ.
- **Slack thread URLs:** `slack_read_thread` needs `channel` (the `C…` or `G…`
  ID from the URL path) and `thread_ts` (the `p<digits>` → insert `.` after
  position 10 to get the float timestamp). See the `slack-mcp` skill.
- **GitHub → use `gh` CLI, not an MCP.** Run via Bash: `gh pr view <n> --repo
  <owner>/<repo> --json title,state,body,url`. Requires `gh auth login` before
  use. See the `gh-cli` skill for the full reference.

## More detail

- Full user guide: `WORKFLOW.md`
- Scoping reference: `.agents/skills/jira-backlog-scoping/SKILL.md`
- Ticket audit reference: `.agents/skills/jira-ticket-audit/SKILL.md`
- Synthesis reference: `.agents/skills/jira-backlog-synthesis/SKILL.md`
- Generic scoping example: `.agents/skills/jira-backlog-scoping/references/scoping-example.md`
- Qdrant values (worked example + repo map): `QDRANT-ENV.local.md` (gitignored)

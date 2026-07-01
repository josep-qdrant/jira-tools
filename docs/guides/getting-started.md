# Getting started

> Part of the [jira-tools workflow guide](../../WORKFLOW.md). First time here? Read this top to bottom, then jump to the guide for the task you have.

This page gets you from "I cloned the repo" to "I ran my first read-only backlog audit", with one fully worked example.

---

## 1. What you need

| Requirement | Why | Detail |
|---|---|---|
| An AI assistant with agent + MCP support | Runs the agents and skills | VS Code + Copilot agent mode, Claude Code, or Cursor |
| **Atlassian MCP** connected in your AI client | Read Jira issues, fields, remote links | [SETUP → MCP servers](../SETUP.md#mcp-servers) |
| `gh` CLI (authenticated) | Read GitHub PRs/issues linked from tickets | `brew install gh && gh auth login` |
| **engram** (optional, recommended) | Persistent memory across sessions | [SETUP → persistent memory](../SETUP.md#persistent-memory-engram) |
| Figma / Notion / Slack MCP (optional) | Design hunt + linked-doc extraction | Only needed if your tickets link to them |
| `QDRANT_REPOS_ROOT` in `AGENTS.local.md` (optional) | Ticket → code association | Local clones of the repos that implement the tickets |

> [!info] Everything is read-only on Jira
> The whole toolkit only **reads** Jira (and Notion/Slack/Figma/GitHub). The only writes are markdown files on disk. No agent ever creates, edits, transitions, or comments on an issue. See the actions-audit doc (`08`) that every backlog audit produces as proof.

---

## 2. Open the repo as a workspace

Open this repo as your workspace. `AGENTS.md` is picked up automatically and activates the pipeline — the assistant now knows the golden rules, the agents, and the skills. You don't need to paste anything.

From here you have two ways to work:

- **Talk to the main agent** — conversational, good for iterating or running one phase.
- **Invoke a workflow** (`backlog-audit`, `ticket-research`) — one deterministic run, no manual chaining.

---

## 3. Worked example — a full backlog audit

This is the real shape of a run. The example uses an actual scope (project `PM`, board `267`, team `Cloud Regions & Clusters`, the `2026-Q3` bucket); swap the values for yours.

### Run it with one command

Ask the assistant:

```
Run the backlog-audit workflow with args:
{
  "outputFolder": "refinement-PM-2026-Q3",
  "project": "PM",
  "board": "267",
  "team": "Cloud Regions & Clusters",
  "buckets": "2026-Q3",
  "reposRoot": "/Users/me/repos",   // optional — enables ticket → code association
  "batchSize": 3                     // optional — tickets per audit batch, default 3
}
```

`outputFolder` is the **only** required arg — if it's missing the run aborts before touching Jira. You confirm the scope by passing it here; the run can't pause to ask (that is the "ask scope first" gate).

Watch live progress with `/workflows`.

### What happens, in order

1. **Scope** (Sonnet) — rebuilds the scope as explicit JQL, maps the cryptic `customfield_XXXXX` IDs to readable names, and verifies the `Score = Impact × Confidence × Size factor` formula against real issues. Writes `_scope-handoff.md`.
2. **Gather** (Haiku, batches of ~3) — fetches each ticket, its remote links, one hop of linked tickets, and any Notion/Slack/GitHub/Figma links, dumping it verbatim to `_context/`. No judgment — just retrieval, on the cheap tier.
3. **Analyze** (Sonnet, batches of ~3) — reads the dump, writes one Obsidian card per ticket: four-axis audit, five-place design hunt, code association, and a Definition-of-Ready verdict. Each batch flows Gather→Analyze independently — a slow batch doesn't hold up a fast one.
4. **Escalate** (Opus, conditional) — only a genuinely contested ticket call, or a genuinely ambiguous scope, gets re-judged on Opus. If nothing is flagged, Opus never runs. See [model policy](../MODEL_POLICY.md).
5. **Synthesize** (Sonnet) — rolls the cards into the 9-document planning package.

### What you get

```
refinement-PM-2026-Q3/
  _scope-handoff.md          ← scope JQL, field map, verified scoring model
  00-executive-summary.md
  01-master-table.md         ← every ticket ranked by recomputed Score
  02-scoring-methodology.md
  03-cross-cutting-findings.md
  04-readiness-plan.md
  05-design-review.md
  06-code-review.md
  07-tickets-by-project.md
  08-actions-audit.md         ← proof nothing was written to Jira
  09-definition-of-ready.md
  tickets/
    PM-313-allow-force-deletion.md
    PM-345-support-bundle-creation.md
    ...                        ← one card per ticket
```

The run's final result reports the scoped count, cards written, the readiness split (🟢 / 🟡 / 🔴), any failed batches, and whether the actions-audit confirmed Jira was untouched.

> [!tip] It's an Obsidian vault
> All docs use YAML frontmatter, wikilinks (`[[PM-313]]`), and callouts. Open the output folder in Obsidian for backlinks and Dataview queries over ticket metadata.

---

## 4. Tips for talking to the agent

- **Be explicit about scope.** The agent will ask before querying Jira if scope is ambiguous — you save a round-trip by giving board ID, team name, and bucket names upfront.
- **Name the output folder.** Convention: `refinement-[project]-[YYYY-QN]/`. If you don't, the agent asks.
- **Chain skills explicitly** when running phases by hand: `jira-backlog-scoping → jira-ticket-audit → jira-backlog-synthesis`. It keeps the agent from skipping steps.
- **Trust "Not recorded".** The agent never invents data. A missing design link, estimate, or AC shows as `Not recorded` / `Uncertain` — that's a refinement signal, not a bug.
- **Code association needs local repos.** Add a gitignored `AGENTS.local.md` with `QDRANT_REPOS_ROOT=/absolute/path/to/your/repos`. Without it, cards record code association as "not available" rather than guessing.

---

## 5. Where to go next

| You want to… | Guide |
|---|---|
| Audit a whole backlog (all the run modes) | [backlog-audit](./backlog-audit.md) |
| Deep-dive a few specific tickets | [ticket-research](./ticket-research.md) |
| Plan a sprint from an audited backlog | [sprint-planning](./sprint-planning.md) |
| Quick "is this ready?" / triage a support ticket | [quick-checks](./quick-checks.md) |
| Copy-paste a prompt for any task | [prompts cookbook](./prompts.md) |
| Understand the pipeline conceptually | [WORKFLOW_OVERVIEW](../WORKFLOW_OVERVIEW.md) |
| Know which model runs which task | [MODEL_POLICY](../MODEL_POLICY.md) |

# Workflow overview — concepts

The pipeline explained conceptually: what it does, what it reads, and the rules it follows. For how to *run* it see the [guides](guides/) and the [prompts cookbook](guides/prompts.md); for setup see [SETUP](SETUP.md); for who-does-what see the reference tables in [WORKFLOW.md](../WORKFLOW.md).

## Short summary

- **Purpose:** scope a backlog, audit each ticket for readiness, and synthesize cross-cutting planning artifacts (master table, executive summary, readiness plan).
- **Read-only:** the pipeline only reads Jira, Notion, Slack, Figma, and GitHub. It never writes to Jira or any external system — the only writes are markdown files on disk.
- **Output:** an Obsidian-style folder with one markdown card per ticket plus 9 synthesis documents.

## Pipeline (three phases)

1. **Scope** (`jira-backlog-scoping`) — build an explicit JQL scope, map `customfield_XXXXX` → readable labels, and deduce & verify the multiplicative RICE-style model: `Score = Impact × Confidence × Size factor`. Output: scope JQL, key list, field map, verified scoring model.
2. **Audit** (`jira-ticket-audit`) — process tickets in small batches (~3): evaluate four axes (goal/scope clarity; UI/design need; size coherence with a recomputed Score; prioritization soundness), run the five-place design hunt, follow Notion/Slack/GitHub links (one hop for linked tickets), associate tickets to repos/code, and write one Obsidian card per ticket ending in a Definition-of-Ready block.
3. **Synthesize** (`jira-backlog-synthesis`) — roll the cards into the planning package: master table (Score re-verified), executive summary, cross-cutting findings, readiness plan grouped by DoR verdict, design & code reviews, tickets-by-project, and the actions audit proving read-only activity.

You can run the full chain end-to-end or invoke a subagent per phase — see [backlog-audit](guides/backlog-audit.md) for the run modes.

## Visual pipeline (Mermaid)

```mermaid
flowchart LR
  Jira["Jira backlog (issues)"] --> Scoper["jira-backlog-scoping\n(build JQL, map fields)"]
  Scoper --> Auditor["jira-ticket-audit\n(per-ticket cards, design hunt)"]
  Auditor --> Synth["jira-backlog-synthesis\n(synthesize cards)"]
  Scoper -->|"scope file"| Output["Output folder\n(Obsidian vault)"]
  Auditor -->|"ticket cards"| Output
  Synth -->|"synthesis docs"| Output
  Auditor --> Integrations["Notion / Figma / Slack / GitHub (reads)"]
  Scoper --> Codegraph["codegraph / local repos (optional)"]
```

## What the workflow looks at

- **Jira issue fields** — summary, description, status, priority, assignee, Sprint, custom fields (Score/Impact/Confidence/Size), attachments, issue links, remote links.
- **Remote links and attachments** — Figma often hides in `remoteIssueLinks`.
- **Notion pages** linked from a ticket — Acceptance Criteria frequently live in Notion; pages are opened and extracted read-only.
- **Slack threads/channels** referenced by URL — read and summarized for decisions/links.
- **GitHub PRs/issues** referenced in tickets — fetched via `gh` for title/state/body and embedded links.
- **Local code repositories** (optional) — characterise repos (README/language), then `codegraph_*` tools or scoped `rg` sweeps for ticket → repo mapping.

## Decisions & rules the workflow follows

- **Confirm scope first.** Board, team, project, and what defines the backlog are confirmed (or passed in `args`) before any Jira query.
- **Score model.** Deduce the RICE-style mapping and verify the arithmetic on real issues. If Score can't be reconciled (Score == 0), label it "scoring incomplete" rather than assume a formula error.
- **Design hunt.** Check five places (design fields, attachments, description/AC, issue links, remote links) and record where a design was found — or that none was.
- **Linked-ticket recursion.** Follow one hop (subtasks & issue links), hunt each linked ticket, cap at ~8 per parent.
- **Notion as AC.** A Notion link counts as Acceptance Criteria only if the page was opened and actually contains AC; otherwise it's "linked but unreadable". A Notion coverage registry is built per audit.
- **Definition of Ready.** Every ticket gets one verdict (🟢 Ready / 🟡 Almost ready / 🔴 Not ready) and a 7-point checklist. Inferred items are marked `🔎 deduced (to verify)`, never ✅ until confirmed.
- **Code association.** Prefer `codegraph` MCP tools; otherwise scoped per-repo `rg`. Characterize a repo by its README and manifest before searching.
- **No invention.** Missing data is `Not recorded` / `Uncertain`, never guessed.

## Inputs / outputs & file conventions

- **Output folder** is an Obsidian vault. Each ticket card is `<KEY>-<kebab-slug>.md` and opens with YAML frontmatter (ticket, aliases, title, type, status, size, impact, confidence, score, dor, repos…).
- **Synthesis documents** are ordered and frontmattered (index, executive summary, master table, scoring/methodology, design/code reviews, readiness plan, tickets-by-project, actions audit, DoR reference).
- **Actions audit** enumerates every connector call (all reads) to prove nothing was written to Jira.

---

For step-by-step guides and copy-paste prompts, see [WORKFLOW.md](../WORKFLOW.md) and [docs/guides/](guides/).

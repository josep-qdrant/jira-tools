# Multi-Repo Jira Coordination

A preset for this repo's operating model: a task is rarely confined to one
repo. It's normally a flow across several repos and languages that have to
land in concordance, and Jira is the read-only coordination point — never a
write target. The actual plan of record is the markdown this preset shapes.

## When to Use

Use this whenever `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` is
used to scope work that touches more than one repo. A genuinely single-repo
feature still works: every added table collapses to one row.

## What It Changes

| Template | Change |
|----------|--------|
| `spec-template.md` | Adds a **Jira Reference** line (read-only) and an optional "repos known so far" note to the header. |
| `plan-template.md` | Technical Context becomes a per-repo table (one row per repo/language touched). Adds a **Cross-Repo Concordance** section: shared contracts, their source of truth, ship sequencing, drift check. Adds a multi-repo Project Structure option (sibling checkouts). |
| `tasks-template.md` | Task format gains a `[Repo]` tag alongside `[P]`/`[Story]`. Adds a **Cross-Repo Dependencies** subsection so a task consuming another repo's contract states that dependency explicitly instead of leaving it implicit. |

It does not touch `speckit.specify`/`speckit.plan`/`speckit.tasks` commands or
any Jira-write path — this preset only shapes the markdown templates. The
project's read-only-on-Jira rule lives in `.specify/memory/constitution.md`
(Principle I), not here; this preset operates inside that constraint, it
doesn't grant any new write capability.

## Explicitly not used: the `jira` community preset

The spec-kit catalog has a community preset called `jira` that overrides
`speckit.taskstoissues` to *create* Jira epics/stories via the Atlassian MCP.
Do not install it in this repo — it directly contradicts Principle I
(Jira Read-Only) in the constitution. This preset is the alternative: Jira
stays read-only, coordination artifacts are markdown.

## Installation

```bash
# Already installed in this repo. To reinstall elsewhere from this source:
specify preset add --dev ./multi-repo-jira-coordination
```

## Development

```bash
# Verify templates resolve after edits
specify preset resolve spec-template
specify preset resolve plan-template
specify preset resolve tasks-template

# Remove
specify preset remove multi-repo-jira-coordination
```

## License

MIT

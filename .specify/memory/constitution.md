<!--
Sync Impact Report
- Version change: (template, unratified) → 1.0.0
- Rationale for 1.0.0: first concrete ratification of a previously placeholder-only
  constitution; MAJOR per semver-for-docs convention for an initial release.
- Modified principles: n/a (initial ratification)
- Added sections:
  - Core Principles I-V (Jira Read-Only; No Invention; Verify Before Reporting;
    Scope Before Query; Cross-Project Traceability & Global Visibility)
  - Output & Deliverable Discipline
  - Workflow & Model Discipline
  - Governance
- Removed sections: none
- Templates checked for consistency:
  - .specify/templates/plan-template.md ✅ (Constitution Check gate reads this file
    dynamically; no hardcoded principle names to update)
  - .specify/templates/spec-template.md ✅ (no constitution-specific references)
  - .specify/templates/tasks-template.md ✅ (no constitution-specific references)
  - .specify/templates/commands/*.md — not present in this repo (skills under
    .claude/skills/speckit-*/SKILL.md reference "constitution" only generically) ✅
  - AGENTS.md / CLAUDE.md ✅ — already encode Principles I-IV informally as
    "Non-negotiables"; this constitution formalizes them and adds Principle V
    without contradicting existing text. No edit required.
- Follow-up TODOs: none. Ratification date set to the date of this drafting
  session since no earlier ratified version of this constitution existed.
-->

# Jira Tools Constitution

## Core Principles

### I. Jira Read-Only (NON-NEGOTIABLE)

Every interaction with Jira MUST be read-only: search, get issue, remote links,
metadata, transition listings. The toolkit MUST NEVER create, edit, transition,
comment on, or otherwise write to a Jira issue. Confluence, Notion, Slack, and
GitHub are consulted under the same rule — they are reference sources for
context, never write targets. The only writes this toolkit performs are
markdown files on local disk. Any action that would write to an external
system requires explicit human action taken outside the agent.

Rationale: the toolkit's entire value proposition is analysis and visibility,
not Jira management. A single accidental write breaks the trust model every
other workflow in this repo depends on.

### II. No Invention

Missing or ambiguous data MUST be reported as `Not recorded` / `Uncertain`,
never guessed, silently inferred, or filled with a plausible-sounding
placeholder. Every claim in an audit card, research dossier, or synthesis
document MUST trace to a specific field, comment, linked document, or code
reference the agent actually read.

Rationale: audits and dossiers feed real planning decisions; invented data is
worse than missing data because it looks authoritative.

### III. Verify Before Reporting

Score arithmetic, aggregate counts, and cross-referenced facts MUST be
re-checked with `rg`/`grep` or a second tool call before they are written into
a deliverable — never trust a single read or a remembered formula. When a
scoring formula or field mapping is uncertain, re-derive it from real issues
rather than assuming it matches a prior run.

Rationale: scores and roll-ups are the numbers stakeholders act on directly;
silent arithmetic drift compounds across a master table and is expensive to
catch after the fact.

### IV. Scope Before Query

Before running any backlog-wide search, confirm team/board, project,
sprint/backlog definition, and destination folder with the user (or from
durable prior context such as engram) and encode that scope as explicit JQL.
Single-ticket research is exempt from board-level scoping but still confirms
the ticket key(s) and destination before writing anything.

Rationale: an unscoped query against a multi-project, multi-team Jira instance
returns noise and burns the read budget; confirming scope is cheap, re-running
a wrong query is not.

### V. Cross-Project Traceability & Global Visibility

This toolkit exists to give a global view across tickets, backlogs, and the
repos/projects a task touches — not to audit one ticket in isolation.
Investigating a task MUST attempt to surface its full context graph: linked
Jira issues (epics, stories, subtasks, remote links), referenced Notion docs,
Slack threads, GitHub PRs/issues, and the code repositories that would
implement it. Gaps in that graph — no design linked, no code association
found, no related project identified — MUST be reported explicitly, never
silently omitted from the deliverable.

Rationale: this is the repo's stated reason to exist — analyzing a Jira ticket
well means knowing every project, repo, and document it touches, not just
reading the ticket's own fields.

## Output & Deliverable Discipline

All deliverables are markdown files following the Obsidian-vault conventions
(`obsidian-vault` skill) and the human, concise voice defined in the
`writing-style` skill — TL;DR-first, no repetition, no invented filler.
Work proceeds in small batches: fetch and audit a handful of tickets at a
time rather than an entire backlog in one pass, since Jira search responses
are large and a failed batch should be cheap to retry. Every backlog-wide
audit ships an actions-audit document proving no Jira writes occurred, per
Principle I.

## Workflow & Model Discipline

There are exactly two entry points: `backlog-audit` (scope → audit each
ticket → synthesize) for a whole backlog, and `ticket-research`
(gather → analyse → escalate) for one or a few specific tickets — do not run
the full backlog pipeline on a narrow scope, and do not hand-roll a third
entry point. Use the cheapest model that does the job: Haiku for mechanical
retrieval, Sonnet as the default workhorse, Opus only for contested scores,
ambiguous scope, or epic splits (see `docs/MODEL_POLICY.md`). Jira issues are
read in default ADF format, not markdown, because markdown truncates
custom-field values. Scope, field maps, and scoring formulas learned in a
session are persisted to engram memory (local-only `~/.engram/engram.db`) so
future sessions do not re-derive them from scratch — this does not relax
Principle I; engram is a read cache for context, not a Jira write path.

## Governance

This constitution supersedes ad-hoc practice. `AGENTS.md` is its
always-loaded operational summary and MUST stay consistent with it; if the
two conflict, amend `AGENTS.md` to match the constitution, never resolve the
conflict silently in the other direction.

Amendments require a stated reason, a version bump per the policy below, and
propagation to `AGENTS.md` and any skill or workflow file whose described
behavior the amendment changes:

- **MAJOR**: removing or redefining a principle (e.g., relaxing read-only).
- **MINOR**: adding a principle, or materially expanding a section.
- **PATCH**: wording or clarification with no behavioral change.

Every audit or research deliverable implicitly attests compliance with
Principles I-V. A reviewer who spots a write attempt, an invented fact, an
unverified score, an unscoped query, or a ticket investigated without a
context-graph pass should treat it as a constitution violation, not a style
nit.

**Version**: 1.0.0 | **Ratified**: 2026-07-01 | **Last Amended**: 2026-07-01

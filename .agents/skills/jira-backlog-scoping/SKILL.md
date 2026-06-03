---
name: jira-backlog-scoping
description: >-
  Reconstruct the read-only scope of a Jira team's backlog and reverse-engineer
  its scoring model. Use this FIRST, at the start of any Jira backlog audit,
  refinement, or quarter/sprint-planning prep. It turns a board + team + sprint
  into an explicit JQL query, maps cryptic customfield_XXXXX IDs to readable
  labels, and deduces + verifies the RICE-style formula
  (Score = Impact × Confidence × Size factor). Trigger whenever someone asks to
  audit / refine / analyze a Jira backlog, prep a quarter or sprint from a board,
  understand how a team's priority Score is computed, or work out which issues
  actually belong to a team's backlog — even if they don't say "JQL" or "scoring".
  Strictly read-only: it never writes to Jira. This is part 1 of a 3-skill
  workflow (pairs with jira-ticket-audit and jira-backlog-synthesis).
---

# Jira Backlog Scoping

Establish the foundation for a backlog audit: a **trustworthy scope**, a **field
map**, and a **verified scoring model**. Everything downstream (per-ticket audit
cards, synthesis docs) depends on these three being correct, so get them right
before extracting anything in bulk.

This is **part 1 of 3**. It produces a working note that `jira-ticket-audit`
(part 2) and `jira-backlog-synthesis` (part 3) consume.

## Ground rules (apply throughout)

1. **Read-only on Jira.** Use only `searchJiraIssuesUsingJql`, `getJiraIssue`,
   `getJiraIssueRemoteIssueLinks`, and metadata calls. Never `create…`, `edit…`,
   `transition…`, `addComment…`, or any write. The only writes this session
   makes are markdown files on disk.
2. **Don't invent.** If a value isn't present (team UUID, a field, a sprint
   name), say so. "Not available" beats a guessed value.
3. **Verify.** Re-check the scoring arithmetic on real issues and re-confirm
   counts. "Looks right" is not evidence.
4. **Surface assumptions before querying.** Confirm the scope parameters with
   the user first (below). Don't silently infer them.

## Step 0 — Confirm the scope parameters

Before any query, make these explicit and confirm with the user. Don't deduce
them silently — a wrong scope poisons the whole audit:

- **Team / board** (and the team's UUID if known).
- **Project** key (e.g. `PM`).
- **What defines the backlog**: which sprints, filter, or status. A board
  *quick-filter* in a URL (`?customFilter=NNN`) is **not** a global saved
  filter — `filter = NNN` in JQL returns 0. Do not rely on it.
- **Working folder** where the markdown output will be written. If `Write`
  fails with "outside connected folders", the folder isn't mounted yet.

If anything is ambiguous, ask before launching queries.

## Step 1 — Discover the team UUID and sprint names

You usually start with names, not IDs. Pull a small sample of issues from the
project and inspect the real field values to learn:

- The **Team** field UUID. The team filter uses a special field name and a UUID,
  not the display name: `"Team[Team]" in (<uuid>)`.
- The exact **sprint names**. "Backlog Prio 1/2"-style buckets are typically
  **future sprints** on the board (the Sprint field), not a status and not a
  separate field. Read the Sprint field of a few issues to confirm the real
  names/IDs before filtering on them.

## Step 2 — Reconstruct the scope with explicit JQL

Build the scope from explicit fields — project + team + sprint/status — ordered
by Rank so the ranking is meaningful:

```
project = PM
AND "Team[Team]" in (a58b9345-d5c4-46bd-857f-24747fe27038)
AND Sprint in ("Backlog Prio 1", "Backlog Prio 2")
ORDER BY Rank ASC
```

To get **just the key list** of the scope, search with `fields: ["summary"]`
and a small `maxResults`. If there are many issues, paginate with
`ORDER BY Rank ASC` / `DESC`. Confirm the count with the user before drilling in.

> Search responses are large by default (forced metadata per issue). Keep this
> step to a key+summary list; full extraction happens in part 2, in small batches.
>
> For the Jira read **mechanics** themselves — JQL syntax, fetching custom fields,
> auth / MCP setup — see the **atlassian-mcp** skill. This skill owns the *scoping
> task* (what to query and why), not the tool plumbing.

## Step 3 — Map the custom fields

Jira projects use dozens of `customfield_XXXXX`. Map them to readable labels
once, from a single representative issue:

```
getJiraIssue(issueIdOrKey, fields: ["*all"], expand: "names")
```

This returns `names` (id → label) alongside `fields` (values). Build a small
table mapping each relevant `customfield_XXXXX` to its label.

> **Gotcha:** the `markdown` rendering of `getJiraIssue` truncates custom fields.
> Use the **default format** when you need the custom-field values.

The fields that matter for a scoring/readiness audit are usually: Score,
Impact (calculated), Confidence (select + calculated), T-Shirt Size (select +
calculated), Acceptance Criteria, Draft Requirements, the design fields
(UX Designs / Concept Design / Design / Technical Documentation), Objective
Class, and Sprint. See `references/qdrant-reference.md` for a fully worked field
map you can use as a template.

## Step 4 — Deduce and VERIFY the scoring model

Most product backlogs use a **multiplicative RICE-style** Score:

```
Score = Impact(calc) × Confidence(calc) × Size factor(calc)
```

Common observed mappings (confirm against the data, don't assume):

- **Impact / Confidence:** High = 9 · Medium = 6 · Low = 2
- **Size factor (inverse to effort):** XS = 10 · S = 8 · M = 6 · L = 4 · XL = 2

**Verify `Score == Impact × Confidence × Size` on every issue with data.** If it
doesn't reconcile or comes out 0, a factor is missing (usually Impact or
Confidence) → flag it as **"scoring incomplete"**, not a formula error.

**The key implication:** size enters **inverse to effort**, so a small estimate
(XS/S) *inflates* the Score and can push modest work to the top of the backlog.
This means auditing the size estimate matters as much as auditing the Score —
carry this insight into part 2. Full reasoning and the verification recipe are in
`references/scoring-model.md`.

## Output of this step

Write a short working note (in the working folder or a scratchpad) capturing:

1. The **verified JQL scope** and the resulting **key list** (with counts).
2. The **field map** (customfield_XXXXX → label).
3. The **verified scoring model**: the formula, the value mappings you
   confirmed, which issues reconcile, and which are "scoring incomplete".

This note is the input to `jira-ticket-audit`. It also becomes the raw material
for the methodology document that `jira-backlog-synthesis` produces — so be
precise about what you observed vs. inferred (e.g. note if a mapping like XL was
inferred because no issue in the set used it).

> If you write this note into the working folder (not just a scratchpad), follow
> the Obsidian conventions in `AGENTS.md` (*Output format — Obsidian vault*):
> frontmatter, wikilinks for any ticket/doc references, `> [!info]` for the
> read-only note.

## Reference files

- `references/scoring-model.md` — the RICE model in depth: value mappings, the
  arithmetic-verification recipe, the inverse-size effect, and how to record
  "scoring incomplete". Read it when deducing or sanity-checking the model.
- `references/qdrant-reference.md` — a fully worked example from the Qdrant
  `PM` / board 267 / "Cloud Regions and Clusters" audit: team UUID, sprint
  names, the complete field map, scoring values, and issue types. Use it as a
  filled-in template to copy the *shape* of, not as defaults to assume.

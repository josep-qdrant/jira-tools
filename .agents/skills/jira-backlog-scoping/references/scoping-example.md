# Worked example — the shape of a completed scoping

A **fictional, filled-in** scoping result. It exists to show what "done" looks
like — the artifacts to produce and how they fit together. **Every value here is
invented**; discover the real ones per run. Your project will have a different
key, team, bucket names, field IDs, and possibly a different scoring model.

## Scope parameters (confirm with the user, don't assume)

- **Site / cloudId:** `<your-org>.atlassian.net`
- **Project:** `ABC` (example key)
- **Board:** `<NNN>`
- **Team:** "Payments" (example) — note the **Team field UUID**, not the name
- **Team UUID:** `<uuid>` (discovered from a sample issue's Team field)
- **Backlog definition:** sprints `Now`, `Next` (example bucket names — these
  happen to be future sprints used as priority buckets, NOT statuses)
- **Issue types:** `Story`, `Epic` (whatever the project actually uses)

## Scope JQL (read-only) — built from explicit fields

```
project = ABC
AND "Team[Team]" in (<uuid>)
AND Sprint in ("Now", "Next")
ORDER BY Rank ASC
```

Result (example): 18 issues. Confirm the count with the user before drilling in.

> A board's `?customFilter=NNN` in the URL is a board quick-filter, **not** a
> saved global filter — `filter = NNN` in JQL returns 0. Rebuild the scope from
> explicit fields (project + team + sprint/status), as above.

## Field map (customfield → label) — discover per project

Built once from one representative issue via
`getJiraIssue(<key>, fields: ["*all"], expand: "names")`. IDs are project-specific
— **these are placeholders**:

| Concept | Field (example) | Notes |
|---------|-----------------|-------|
| Score | `customfield_AAAAA` | system-computed final number |
| Impact (calculated) | `customfield_BBBBB` | numeric used in the Score |
| Confidence (select + calc) | `customfield_CCCCC` / `_DDDDD` | High / Medium / Low → numeric |
| Size (select + calc) | `customfield_EEEEE` / `_FFFFF` | XS…XL → numeric factor (inverse to effort) |
| Acceptance Criteria | `customfield_GGGGG` | often just a link to an external doc |
| Design fields | `customfield_HHHHH` … | names vary per project; may be empty |
| Sprint | `customfield_IIIII` | the buckets live here |

## Scoring model (deduced + verified) — confirm it, don't assume it

This example uses a multiplicative RICE-style Score; **your project may differ**
(additive, weighted, WSJF, or a custom formula). Reverse-engineer it from the
data:

```
Score = Impact × Confidence × Size factor
```

- Impact / Confidence (example mapping): High = 9 · Medium = 6 · Low = 2
- Size factor, inverse to effort (example): XS = 10 · S = 8 · M = 6 · L = 4 · XL = 2

Verified (example): the formula reconciled on 15/18 issues; 3 had Score 0 from a
missing factor → recorded as "scoring incomplete". (See `scoring-model.md` for
the verification recipe and the inverse-size trap.)

## How the discovery went (call sequence)

1. JQL searches on a small sample to find the Team-field UUID and the real
   sprint/bucket names.
2. `getJiraProjectIssueTypesMetadata` to learn the project's issue types.
3. `getJiraIssue(<key>, fields: ["*all"], expand: "names")` on one issue to
   build the field map.
4. Key+summary search of the full scope, paginated by Rank.

All read-only.

> If you maintain a local, environment-specific reference (a `*.local.md` file
> with your real project key, team UUID, field map, and repo map), use it instead
> of re-deriving every time — but keep that file out of the skill; the skill stays
> project-agnostic.

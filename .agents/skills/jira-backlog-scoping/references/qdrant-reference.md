# Worked example — Qdrant "Cloud Regions and Clusters" (PM / board 267)

A fully filled-in reference from a real audit. Use it to see the **shape** of a
completed scoping step. **Do not assume these values for a different team** —
discover them per run. They're correct for this specific team/board and a useful
template for what "done" looks like.

## Scope parameters

- **Site / cloudId:** `qdrant.atlassian.net`
- **Project:** `PM` (Product Management)
- **Board:** `267`
- **Team:** Cloud Regions and Clusters
- **Team UUID:** `a58b9345-d5c4-46bd-857f-24747fe27038`
- **Backlog sprints:** `Backlog Prio 1`, `Backlog Prio 2` (future sprints used as
  priority buckets — NOT statuses, NOT a separate field)
- **Issue types:** `Objective` (hierarchy 2), `Product Request` (hierarchy 0)

## Scope JQL (read-only)

```
project = PM
AND "Team[Team]" in (a58b9345-d5c4-46bd-857f-24747fe27038)
AND Sprint in ("Backlog Prio 1", "Backlog Prio 2")
ORDER BY Rank ASC
```

Result: 18 issues, all of type `Objective` (12 in Prio 1, 6 in Prio 2).

> The board's `?customFilter=272` is a board quick-filter, not a saved global
> filter — `filter = 272` in JQL returns 0. The scope had to be rebuilt from
> project + Team[Team] + Sprint as above.

## Field map (customfield → label)

| Concept | Field | Notes |
|---------|-------|-------|
| Score (RICE) | `customfield_10090` | system-computed final number |
| Impact (calculated) | `customfield_10108` | numeric used in the Score |
| Confidence (select) | `customfield_10098` | High / Medium / Low |
| Confidence (calculated) | `customfield_10109` | numeric used in the Score |
| T-Shirt Size (select) | `customfield_10099` | XS / S / M / L / XL |
| T-Shirt Size (calculated) | `customfield_10110` | numeric factor (inverse to effort) |
| Target Impact | `customfield_10085` | often empty |
| Complexity | `customfield_10089` | |
| Acceptance Criteria | `customfield_10087` | usually a link to Notion |
| Draft Requirements | `customfield_10086` | empty across the set |
| UX Designs / Concept Design / Design | `customfield_10096` / `_10095` / `_10034` | empty across the set |
| Technical Documentation | `customfield_10097` | empty across the set |
| Objective Class | `customfield_10829` | Standard / Big Rock |
| Sprint | `customfield_10020` | here: Prio 1 / Prio 2 (and past quarter sprints) |

## Scoring model (verified)

```
Score = Impact × Confidence × Size factor
```

- Impact / Confidence: High = 9 · Medium = 6 · Low = 2
- Size factor (inverse): XS = 10 · S = 8 · M = 6 · L = 4 · XL = 2 (XL inferred —
  no issue in the set used it)

Verified: reconciles in 100% of the 15 issues with complete data. 3 issues had
Score 0 from missing Impact/Confidence (scoring incomplete).

## The 18 issues audited

PM-102, 106, 184, 194, 207, 225, 252, 273, 281, 284, 288, 295, 296, 310, 313,
338, 345, 346.

## How the discovery actually went (call sequence)

1. JQL searches to find the team filter and sprint names (sample issues).
2. `getJiraProjectIssueTypesMetadata` to learn the project's issue types.
3. `getJiraIssue(<key>, fields: ["*all"], expand: "names")` on one issue to
   build the field map.
4. Key+summary search of the full scope, paginated by Rank.

All read-only.

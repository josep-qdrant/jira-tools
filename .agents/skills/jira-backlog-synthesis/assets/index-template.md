# Backlog audit — <Team> (<Quarter/Period>)

**Read-only** analysis package for the **<Team>** backlog (project <KEY>, board
<NNN>), scope **<sprints/filter>**. <N> <issue type>s audited across 4 axes:
goal/scope clarity, UI/design, size coherence, and prioritization (Impact /
Confidence / RICE Score).

> Nothing was modified in Jira. Generated <date>.

## Suggested reading order

1. **01_EXECUTIVE_SUMMARY.md** — verdict, key findings, critical alerts.
2. **02_MASTER_TABLE.md** — all <N> issues in one table, ordered by Score, with stats.
3. **03_CROSS_CUTTING_FINDINGS.md** — repeating patterns (sizes, scoring, designs, duplicates…).
4. **04_PLAN_RECOMMENDATION.md** — readiness tiers, shortlist, and Definition of Ready.
5. **05_METHODOLOGY_AND_SCORING.md** — scope reconstruction, field map, the deduced score model.
6. **06_DESIGN_FIGMA_REVIEW.md** — design/Figma coverage on UI tickets (result: <x/y>).
7. **07_CODE_REVIEW.md** — which UI tickets need new design vs. can reuse code (result: <x/y>).
8. **08_TICKETS_BY_PROJECT.md** — repo per ticket (matrix + counts) + un-scopable tickets.

## Cards by bucket

| <Bucket 1> | <Bucket 2> |
|------------|------------|
| <keys…> | <keys…> |

## How the Score is computed (recap)

`Score = Impact × Confidence × Size factor` — Impact/Confidence: High=9, Medium=6,
Low=2; Size **inverse to effort**: XS=10, S=8, M=6, L=4, XL=2. Verified on the
<x>/<N> issues with complete data. Detail in `05_METHODOLOGY_AND_SCORING.md`.

> Canonical definition of the formula and value mappings: the `jira-backlog-scoping`
> skill (`references/scoring-model.md`). The recap above is a reader's convenience —
> if the model changes, edit it there, not here.

## Top 3 immediate actions

1. <hygiene action — e.g. remove Done items; complete Score-0 items>.
2. <recalibrate the optimistic top-of-ranking items>.
3. <Definition of Ready — require AC + design link in Jira before planning>.

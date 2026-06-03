---
title: "Backlog audit — <Team> (<Quarter/Period>)"
doc: index
team: "<Team>"
board: <NNN>
project: <KEY>
scope: "<sprints/filter>"
generated: <YYYY-MM-DD>
readonly: true
tags: [backlog-audit, synthesis]
---

# Backlog audit — <Team> (<Quarter/Period>)

**Read-only** analysis package for the **<Team>** backlog (project <KEY>, board
<NNN>), scope **<sprints/filter>**. <N> <issue type>s audited across 4 axes:
goal/scope clarity, UI/design, size coherence, and prioritization (Impact /
Confidence / RICE Score).

> [!info] Nothing was modified in Jira. Generated <date>.

## Suggested reading order

1. [[01-resumen-ejecutivo|01 · Executive summary]] — verdict, key findings, critical alerts.
2. [[02-tabla-maestra|02 · Master table]] — all <N> issues in one table, ordered by Score, with stats.
3. [[03-hallazgos-transversales|03 · Cross-cutting findings]] — repeating patterns (sizes, scoring, designs, duplicates…).
4. [[04-plan-recomendacion|04 · Plan & recommendation]] — readiness tiers, shortlist, and Definition of Ready.
5. [[05-metodologia-y-scoring|05 · Methodology & scoring]] — scope reconstruction, field map, the deduced score model.
6. [[06-revision-diseno|06 · Design / Figma review]] — design/Figma coverage on UI tickets (result: <x/y>).
7. [[07-revision-codigo|07 · Code review]] — which UI tickets need new design vs. can reuse code (result: <x/y>).
8. [[08-tickets-por-proyecto|08 · Tickets by project]] — repo per ticket (matrix + counts) + un-scopable tickets.

## Cards by bucket

| <Bucket 1> | <Bucket 2> |
|------------|------------|
| [[PM-<a>-<slug>\|PM-<a>]] · [[PM-<b>-<slug>\|PM-<b>]] | [[PM-<c>-<slug>\|PM-<c>]] · … |

## How the Score is computed (recap)

`Score = Impact × Confidence × Size factor` — Impact/Confidence: High=9, Medium=6,
Low=2; Size **inverse to effort**: XS=10, S=8, M=6, L=4, XL=2. Verified on the
<x>/<N> issues with complete data. Detail in [[05-metodologia-y-scoring|05 · Methodology & scoring]].

> [!note] Canonical definition of the formula and value mappings: the
> `jira-backlog-scoping` skill (`references/scoring-model.md`). The recap above is
> a reader's convenience — if the model changes, edit it there, not here.

## Top 3 immediate actions

1. <hygiene action — e.g. remove Done items; complete Score-0 items>.
2. <recalibrate the optimistic top-of-ranking items>.
3. <Definition of Ready — require AC + design link in Jira before planning>.

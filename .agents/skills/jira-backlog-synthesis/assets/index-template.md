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

> [!tldr] <one line: the headline verdict — e.g. "X/N ready, M blocked on AC; ranking inflated by optimistic sizes. Recalibrate the top K before planning.">

**Read-only** analysis package for the **<Team>** backlog (project <KEY>, board
<NNN>), scope **<sprints/filter>**. <N> <issue type>s audited across 4 axes:
goal/scope clarity, UI/design, size coherence, and prioritization (Impact /
Confidence / RICE Score).

> [!info] Nothing was modified in Jira. Generated <date>.

## Suggested reading order

1. [[01_EXECUTIVE_SUMMARY|01 · Executive summary]] — verdict, key findings, critical alerts.
2. [[02_MASTER_TABLE|02 · Master table]] — all <N> issues in one table, ordered by Score, with stats.
3. [[03_CROSS_CUTTING_FINDINGS|03 · Cross-cutting findings]] — repeating patterns (sizes, scoring, designs, duplicates…).
4. [[04_PLAN_RECOMMENDATION|04 · Plan & recommendation]] — readiness tiers, shortlist, and Definition of Ready.
5. [[05_METHODOLOGY_AND_SCORING|05 · Methodology & scoring]] — scope reconstruction, field map, the deduced score model.
6. [[06_DESIGN_FIGMA_REVIEW|06 · Design / Figma review]] — design/Figma coverage on UI tickets (result: <x/y>).
7. [[07_CODE_REVIEW|07 · Code review]] — which UI tickets need new design vs. can reuse code (result: <x/y>).
8. [[08_TICKETS_BY_PROJECT|08 · Tickets by project]] — repo per ticket (matrix + counts) + un-scopable tickets.
9. [[09_THEMATIC_GROUPING|09 · Thematic grouping]] — tickets clustered into logical themes (conceptual objectives).

## Cards by bucket

| <Bucket 1> | <Bucket 2> |
|------------|------------|
| [[ABC-<a>-<slug>\|ABC-<a>]] · [[ABC-<b>-<slug>\|ABC-<b>]] | [[ABC-<c>-<slug>\|ABC-<c>]] · … |

> If every issue shares one literal bucket (e.g. a single quarterly sprint,
> nothing to split by), replace this table with a split by DoR verdict
> (🟢/🟡/🔴) instead and rename the heading to match (e.g. "Cards by
> readiness") — don't force an empty bucket split.

## How the Score is computed (recap)

`Score = Impact × Confidence × Size factor` — Impact/Confidence: High=9, Medium=6,
Low=2; Size **inverse to effort**: XS=10, S=8, M=6, L=4, XL=2. Verified on the
<x>/<N> issues with complete data. Detail in [[05_METHODOLOGY_AND_SCORING|05 · Methodology & scoring]].

> [!note] Canonical definition of the formula and value mappings: the
> `jira-backlog-scoping` skill (`references/scoring-model.md`). The recap above is
> a reader's convenience — if the model changes, edit it there, not here.

## Top 3 immediate actions

1. <hygiene action — e.g. remove Done items; complete Score-0 items>.
2. <recalibrate the optimistic top-of-ranking items>.
3. <Definition of Ready — require AC + design link in Jira before planning>.

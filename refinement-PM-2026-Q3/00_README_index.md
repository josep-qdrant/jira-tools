---
title: "Backlog audit — Cloud Unit Regions & Clusters (2026-Q3)"
doc: index
team: "Cloud Unit Regions & Clusters"
board: 267
project: PM
scope: "Sprint = 2026-Q3"
generated: 2026-07-01
readonly: true
tags: [backlog-audit, synthesis, PM]
---

# Backlog audit — Cloud Unit Regions & Clusters (2026-Q3)

> [!tldr] 0/17 tickets are 🟢 ready, 6/17 are 🟡 almost ready (one blocker each), and 11/17 are 🔴 not ready — mostly scope/AC gaps, not missing ideas. Fix the cheap stuff first: 3 Score-0 tickets, one "close it" verdict (PM-505), and the backup-UX overlap (PM-165/PM-230/PM-509). The Notion re-pass on PM-102/PM-280/PM-529 is now done — it didn't flip any verdict, but it did resurface a real scope mismatch on PM-280.

**Read-only** analysis package for the **Cloud Unit Regions & Clusters** backlog (project `PM`, board `267`), scope **Sprint = "2026-Q3"**. 17 `Objective`-type issues audited across four axes: goal/scope clarity, UI/design, size coherence, and prioritization (Impact × Confidence × Size RICE score).

> [!info] Nothing was modified in Jira. Generated 2026-07-01. This is a resynthesis: PM-102, PM-280, and PM-529 were re-audited to add previously-missing Notion coverage (the Notion MCP tool was unavailable in the original pass); PM-505's Notion doc was already read in the earlier pass. All 17 cards were re-read fresh for this rebuild — see [[ACTIONS_AUDIT|ACTIONS_AUDIT]].

## Suggested reading order

1. [[01_EXECUTIVE_SUMMARY|01 · Executive summary]] — verdict, key findings, critical alerts.
2. [[02_MASTER_TABLE|02 · Master table]] — all 17 issues in one table, ordered by Score, with stats.
3. [[03_CROSS_CUTTING_FINDINGS|03 · Cross-cutting findings]] — repeating patterns (sizes, scoring, designs, overlaps…).
4. [[04_PLAN_RECOMMENDATION|04 · Plan & recommendation]] — readiness tiers, shortlist, and Definition of Ready.
5. [[05_METHODOLOGY_AND_SCORING|05 · Methodology & scoring]] — scope reconstruction, field map, the verified score model, limitations.
6. [[06_DESIGN_FIGMA_REVIEW|06 · Design / Figma review]] — design/Figma coverage on UI tickets (result: 3/13 design-linked).
7. [[07_CODE_REVIEW|07 · Code review]] — which UI tickets need new design vs. can reuse code (result: 2 full / 8 partial / 1 none / 2 N/A).
8. [[08_TICKETS_BY_PROJECT|08 · Tickets by project]] — repo per ticket (matrix + counts).
9. [[09_THEMATIC_GROUPING|09 · Thematic grouping]] — 7 conceptual themes (result: Backups is the readiest to attack as one objective; Hybrid Cloud lifecycle is the least ready).

## Cards by bucket

All 17 issues sit in the same bucket (Sprint `2026-Q3`, `id 3830`, a future sprint used as a quarterly priority bucket). Split here by DoR verdict instead:

| 🟡 Almost ready (6) | 🔴 Not ready (11) |
|---|---|
| [[PM-102-dynamic-cpu-memory-reservation-buffers\|PM-102]] · [[PM-280-rewrite-cluster-api-config-logic\|PM-280]] · [[PM-313-force-deletion-hybrid-cloud-clusters\|PM-313]] · [[PM-453-load-balancing-envoy-step2\|PM-453]] · [[PM-509-show-backup-size-in-ui\|PM-509]] · [[PM-529-backup-failure-reason-hybrid-cloud\|PM-529]] | [[PM-164-improve-cluster-metrics-ui\|PM-164]] · [[PM-165-improve-backup-ux\|PM-165]] · [[PM-187-multi-channel-alert-notifications\|PM-187]] · [[PM-230-cross-region-backups\|PM-230]] · [[PM-284-unify-ui-modal-dialogs\|PM-284]] · [[PM-327-volumeattributesclass-hybrid-cloud\|PM-327]] · [[PM-345-hybrid-cloud-support-bundle\|PM-345]] · [[PM-430-multi-az-hybrid-cloud\|PM-430]] · [[PM-486-allow-disk-downscaling\|PM-486]] · [[PM-505-cluster-ui-improvements\|PM-505]] · [[PM-524-hybrid-cloud-integration-tests-real-k8s\|PM-524]] |

No ticket cleared 🟢 Ready to start. Unchanged from the prior synthesis pass — the Notion re-pass sharpened *why* three tickets sit where they sit, not *whether* they do.

## How the Score is computed (recap)

`Score = Impact × Confidence × Size factor` — Impact/Confidence: Significant/High=9, Measurable/Medium=6, Minimal/Low=2; Size **inverse to effort**: XS=10, S=8, M=6, L=4 (not observed this quarter), XL=2. Verified on **14/14** issues with complete data; 3 issues (PM-327, PM-505, PM-524) score 0 because Impact and Confidence are both unset — a data-hygiene gap, not a formula defect. Detail in [[05_METHODOLOGY_AND_SCORING|05 · Methodology & scoring]].

> [!note] Canonical definition of the formula and value mappings: the `jira-backlog-scoping` skill's scoring model, re-verified in `_scope-handoff.md`. The recap above is a reader's convenience — if the model changes, edit it there, not here.

## Top 3 immediate actions

1. **Close [[PM-505-cluster-ui-improvements\|PM-505]]** (Opus-escalated final verdict, unchanged by this resync: its decided scope has already shipped via [[PM-355\|PM-355]] and [[PM-267-improve-cluster-api-key-modal\|PM-267]]) and complete Impact/Confidence on the other two Score-0 tickets ([[PM-327-volumeattributesclass-hybrid-cloud\|PM-327]], [[PM-524-hybrid-cloud-integration-tests-real-k8s\|PM-524]]) so they're at least rankable.
2. **Get PM/Eng to name which phase of [[PM-280-rewrite-cluster-api-config-logic\|PM-280]]'s newly-read Notion plan is actually in scope for Q3** — the doc revealed the Jira ticket's "v2 API" ask is the last "Bonus" step of a 4-phase, 10-milestone service-extraction plan; the XL/162 Score was set against the (now superseded) v2-API framing, not the real near-term deliverable.
3. **De-duplicate the backup-UX cluster** — [[PM-165-improve-backup-ux\|PM-165]], [[PM-230-cross-region-backups\|PM-230]], and [[PM-509-show-backup-size-in-ui\|PM-509]] all touch the same Backups screens with overlapping line items; assign one owner ticket per sub-feature before sizing any of them.

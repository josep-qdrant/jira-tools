---
title: "Executive summary — Cloud Unit Regions & Clusters (2026-Q3)"
doc: executive-summary
team: "Cloud Unit Regions & Clusters"
board: 267
project: PM
scope: "Sprint = 2026-Q3"
generated: 2026-07-01
readonly: true
tags: [backlog-audit, synthesis, PM]
---

# Executive summary — Cloud Unit Regions & Clusters (2026-Q3)

> [!tldr] The 2026-Q3 bucket is not planning-ready: 0/17 tickets are 🟢, 6/17 are 🟡 one-blocker-away, 11/17 are 🔴. The top of the Score ranking is trustworthy in places ([[PM-313-force-deletion-hybrid-cloud-clusters\|PM-313]], [[PM-453-load-balancing-envoy-step2\|PM-453]]) and inflated by optimistic sizing in others ([[PM-486-allow-disk-downscaling\|PM-486]], [[PM-345-hybrid-cloud-support-bundle\|PM-345]]). A re-audit added Notion coverage on PM-102/PM-280/PM-529: it didn't change any DoR verdict, but PM-280's newly-read plan exposes a real scope mismatch worth flagging on its own. Run one refinement pass before sprint planning.

**Team:** Cloud Unit Regions & Clusters · **Board:** 267 · **Project:** PM · **Scope:** Sprint = "2026-Q3" (17 issues, all type `Objective`) · **Date:** 2026-07-01

> [!info] Read-only. Nothing in Jira was created, edited, transitioned, or commented on during this audit or this resynthesis. See [[ACTIONS_AUDIT|ACTIONS_AUDIT]] for the full call log.

## Verdict in one sentence

This backlog has real, well-motivated ideas backed by unusually good technical documentation in places, but readiness is low across the board — no ticket clears the bar for "ready to start," size systematically undersells multi-repo/cross-team scope on the highest-scoring items, and one ticket ([[PM-505-cluster-ui-improvements\|PM-505]]) should be closed rather than refined.

## Key findings

1. **0/17 tickets are 🟢 Ready; 6/17 are 🟡 Almost ready (each blocked on exactly one named thing); 11/17 are 🔴 Not ready.** Unchanged by this resync. See [[02_MASTER_TABLE|02 · Master table]] for the full breakdown and [[04_PLAN_RECOMMENDATION|04 · Plan]] for the tiering.
2. **3/17 tickets score 0** ([[PM-327-volumeattributesclass-hybrid-cloud|PM-327]], [[PM-505-cluster-ui-improvements|PM-505]], [[PM-524-hybrid-cloud-integration-tests-real-k8s|PM-524]]) because Impact and Confidence are both unset, not because the formula fails — 14/14 issues with complete data reconcile exactly against `Impact × Confidence × Size`. Two of the three (PM-327, PM-524) are already past "Idea Intake" (statuses "Ready for planning" and "Technical Design"), meaning they're being actively worked while invisible to any Score-ranked view.
3. **[[PM-505-cluster-ui-improvements|PM-505]] should be closed, not refined.** Its Notion doc was read in an earlier pass (Opus escalation) and confirmed every piece of its originally-decided scope has already shipped elsewhere ([[PM-355|PM-355]] for alerts, [[PM-267-improve-cluster-api-key-modal|PM-267]] for the API-key modal); the only surviving ambition (cluster-overview redesign) is explicitly deferred by the PM's own comments to a new, design-gated Q3 objective that doesn't exist yet.
4. **The highest Score in the batch ([[PM-313-force-deletion-hybrid-cloud-clusters|PM-313]], 810, XS) is one of the more trustworthy ones** — the backend logic is verified already built; its single blocker is an unresolved internal disagreement (button vs. automatic timeout) — a cheap, one-decision fix. Two other Score-648 tickets are not comparably solid: [[PM-486-allow-disk-downscaling|PM-486]]'s own comment thread describes a "very costly" backend migration the S-size never counted, and [[PM-345-hybrid-cloud-support-bundle|PM-345]] has four open PM decisions and no design.
5. **Three tickets in this batch describe overlapping Backup-UI scope**: [[PM-165-improve-backup-ux|PM-165]] (backup-size column, custom naming, grouping), [[PM-509-show-backup-size-in-ui|PM-509]] (the same backup-size column), and [[PM-230-cross-region-backups|PM-230]] (blocked by PM-165's in-flight redesign of the same screens). None of the three names a single owner for the shared pieces.
6. **UI/design coverage is thin but the code-reuse picture is better than it looks**: only 3/13 UI-relevant tickets have any design signal at all (`design_linked: true`), yet 8/13 are classified PARTIAL and 2/13 FULL reuse from existing components — most of this backlog's "missing design" gap is closeable by extrapolation, not a blank slate. Full detail in [[06_DESIGN_FIGMA_REVIEW|06]] and [[07_CODE_REVIEW|07]].
7. **The Notion re-pass on PM-102, PM-280, and PM-529 closed the tooling gap flagged in the prior synthesis — and it materially changed the story on one ticket.** All three now show `notion: read` (were `unreadable`). PM-102's doc confirmed AC (Milestone 1 requirements) without changing its blocker (the sizing formula). PM-529's doc confirmed AC directly (Requirement 4.1's snapshot-reason scenario) and resolved the prior "unread Notion" follow-up flag. **PM-280's doc is the significant one**: it reveals the Jira ticket's "v2 API" ask is literally the last, "Bonus" step of a 4-phase, 10-milestone plan to extract the entire cluster module into a separate Go service — a scope mismatch, not a formality, and now PM-280's single named blocker. None of the three tickets' DoR verdict changed (all stayed 🟡), but PM-280's *reason* for being 🟡 changed from "unread Notion doc" to "PM/Eng must name which phase(s) ship this quarter." [[PM-505-cluster-ui-improvements|PM-505]] already had its Notion doc read in the prior pass — unchanged here.
8. **The inverse-size effect is doing real work in this batch, both ways.** [[PM-280-rewrite-cluster-api-config-logic|PM-280]]'s honest XL size correctly caps a 9×9 Impact/Confidence pair at Score 162 — the model working as intended, though the Notion read now shows even Impact/Confidence were assessed against the (superseded) v2-API framing. At least 6 other tickets carry a size that the ticket's own comments or verified code contradict (see [[03_CROSS_CUTTING_FINDINGS|03, finding H1]]), and every one of those is an *under*-estimate that inflates rank.
9. **Two tickets' own comment threads already contradict their stored scoring fields.** [[PM-187-multi-channel-alert-notifications|PM-187]]'s Confidence=High reflects an earlier, more optimistic review comment that a later comment on the same ticket walks back to Medium — the field was never updated. [[PM-284-unify-ui-modal-dialogs|PM-284]] has one comment claiming "Already completed!" and a separate, more recent comment asking whether scope is even understood.

## Critical alerts (immediate action)

- **Close [[PM-505-cluster-ui-improvements|PM-505]]** — refining it further would mean inventing scope its own owner has already relocated to Done tickets.
- **Set Impact/Confidence on [[PM-327-volumeattributesclass-hybrid-cloud|PM-327]] and [[PM-524-hybrid-cloud-integration-tests-real-k8s|PM-524]]** — both are past Idea Intake, actively progressing, and invisible in any Score view. PM-327 in particular is the best-documented ticket in the whole batch; this reads as an oversight, not a genuine unknown.
- **Resolve the [[PM-313-force-deletion-hybrid-cloud-clusters|PM-313]] button-vs-automatic-timeout question** before planning — it's the single blocker on the highest-Score ticket in the quarter and the backend work is already done.
- **Get PM/Eng to pin [[PM-280-rewrite-cluster-api-config-logic|PM-280]] to a specific phase of its own Notion plan** — this is now the cheapest-but-most-consequential lever in this package: the ticket has been "In Progress" against a scope its own linked plan doesn't support as this quarter's deliverable.

## Process recommendation

Run one refinement pass before sprint planning, in this order: (1) the PM-280 phase-scoping conversation surfaced by this resync (mechanical to schedule, not to resolve), (2) the three Score-0/close decisions, (3) a scope-and-size review on the 🟡 tickets' single named blockers (five of six are one decision or one confirmation away from 🟢; PM-280 is now one *scoping conversation* away), (4) a de-duplication conversation for the Backup-UX cluster (PM-165/PM-230/PM-509) and the webhook-vs-email split inside PM-187. Only after that should Tier A/B/C in [[04_PLAN_RECOMMENDATION|04 · Plan & recommendation]] be used to build an actual sprint.

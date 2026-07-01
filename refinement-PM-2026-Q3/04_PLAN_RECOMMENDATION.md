---
title: "Plan & recommendation — Cloud Unit Regions & Clusters (2026-Q3)"
doc: plan
team: "Cloud Unit Regions & Clusters"
board: 267
project: PM
scope: "Sprint = 2026-Q3"
generated: 2026-07-01
readonly: true
tags: [backlog-audit, synthesis, PM]
---

# Plan & recommendation — Cloud Unit Regions & Clusters (2026-Q3)

> [!tldr] Sorted by readiness, not capacity (team velocity is unknown). Tier A (6 tickets, one blocker each) is where a refinement session should focus first; Tier B needs a size/impact recalibration before it's trustworthy; Tier C needs a spike or a product decision before it can be sized at all. Hygiene: close 1, fix scoring on 2. PM-280's Tier A blocker changed this pass — from "read the Notion doc" to "PM/Eng name the actual in-scope phase" — everything else in the tiering is unchanged.

Velocity for this team isn't known from the cards, so this plan sorts by *what's ready*, grouped by the DoR verdict each card carries (🟢 / 🟡 / 🔴), not by how much could fit in a sprint.

## Tier A — executable after light refinement (the 6 🟡 tickets)

Each is fundamentally sound and blocked on exactly one named thing.

| Issue | Score | Why almost ready | Minimal pre-work |
|---|---|---|---|
| [[PM-313-force-deletion-hybrid-cloud-clusters\|PM-313]] | 810 | Backend `force` delete path verified already built; AC drafted in a comment | Resolve the button-vs-automatic-timeout product decision; promote the drafted AC to the AC field |
| [[PM-453-load-balancing-envoy-step2\|PM-453]] | 648 | Solution decided (PM-312, Done) and PoC'd (CP-458, Done); only the rollout plan is missing | Write the migration/rollout + rollback plan as AC; confirm or drop the likely-mislinked PM-184 dependency |
| [[PM-102-dynamic-cpu-memory-reservation-buffers\|PM-102]] | 540 ⚠ | Clear objective, existing per-cluster override mechanism to extend; Notion doc now read and confirms AC (Milestone 1 requirements) | Get the resilience team's sizing formula (the Notion doc doesn't supply it either); re-size to S (see [[03_CROSS_CUTTING_FINDINGS\|03, H1]]) |
| [[PM-509-show-backup-size-in-ui\|PM-509]] | 432 | Data already tracked for billing; exact UI column pattern to copy exists in code | Resolve the PM-165 scope overlap ([[03_CROSS_CUTTING_FINDINGS\|03, H6]]) — decide who ships the backup-size column |
| [[PM-280-rewrite-cluster-api-config-logic\|PM-280]] | 162 | XL size is honest against *some* scope; scope/naming requirement captured in comments | **Changed this pass:** the linked Notion "Cluster module refactor / rewrite plan" is now read, and it reveals PM-280's "v2 API" ask is the plan's last "Bonus" step after a 4-phase Go-service extraction. Pre-work is no longer "read the doc" — it's **PM/Eng naming which phase(s) constitute the actual 2026-Q3 deliverable**, then re-deriving AC and size against that narrower scope (see [[03_CROSS_CUTTING_FINDINGS\|03, H1a]]) |
| [[PM-529-backup-failure-reason-hybrid-cloud\|PM-529]] | 288 | Precise, bounded description; exact tooltip pattern already in code; Notion doc now read and confirms AC (Requirement 4.1's snapshot-reason scenario matches directly) | Confirm the tooltip approach with a PM/designer; verify PM-59's Figma still applies post-split (Figma-tool gap, unaffected by the Notion re-pass) |

## Tier B — recalibrate before committing

Fundamentally real work, but the stored Score can't be trusted until size/confidence is corrected.

| Issue | Current Score | Problem | Expected Score after recalibration |
|---|---|---|---|
| [[PM-486-allow-disk-downscaling\|PM-486]] | 648 | S covers only the UI framing; the real ask is a "very costly" node-recreation + shard-transfer mechanism with zero existing code | 324 (L) or 162 (XL) |
| [[PM-345-hybrid-cloud-support-bundle\|PM-345]] | 648 | Four open PM decisions (bundle contents/security, phase-1 scope); no agent job-trigger mechanism exists yet | 432–486 depending on Size/Confidence correction |
| [[PM-187-multi-channel-alert-notifications\|PM-187]] | 432 | Ticket's own later review comment walks Confidence back to Medium and calls webhook delivery "completely new" | 216–324 |
| [[PM-165-improve-backup-ux\|PM-165]] | 360 | Five bundled asks, two already separately ticketed elsewhere in this scope | 288 once split |
| [[PM-230-cross-region-backups\|PM-230]] | 324 | Zero region-aware code exists in any of 3 repos checked; M understates schema + orchestration + billing + restore-flow | 216 (L) |
| [[PM-164-improve-cluster-metrics-ui\|PM-164]] | 288 | ~25-metric wish-list with no prioritization — reads as an épic, not a single S | Not meaningful until split |
| [[PM-284-unify-ui-modal-dialogs\|PM-284]] | 180 | Confidence=High contradicted by the ticket's own open-questions comment | 120 at Confidence=Medium |

## Tier C — discovery/decision first (spike candidates)

| Issue | Score | What's missing |
|---|---|---|
| [[PM-430-multi-az-hybrid-cloud\|PM-430]] | 72 | Team's own comments call for an unresolved spike (zone-label detection, enforcement mode, StorageClass binding) before this can be sized at all — Confidence=Low is honest, not a defect |
| [[PM-524-hybrid-cloud-integration-tests-real-k8s\|PM-524]] | 0 | Hard-blocked on CRS-1923 (different project, still Backlog, itself unscoped) — cannot start independently |

## Hygiene (do now)

| Issue | Action |
|---|---|
| [[PM-505-cluster-ui-improvements\|PM-505]] | **Close.** Opus-escalated final verdict, unchanged by this resync: every decided piece of its scope already shipped (PM-355, PM-267, both Done); the only surviving idea is deferred by the PM's own comments to a new, design-gated objective that doesn't exist yet. Don't carry into a fourth quarter. |
| [[PM-327-volumeattributesclass-hybrid-cloud\|PM-327]] | Set Impact/Confidence — the best-documented ticket in the batch, currently invisible in ranking on what reads as an oversight, not a genuine unknown. |
| [[PM-524-hybrid-cloud-integration-tests-real-k8s\|PM-524]] | Set Impact/Confidence once CRS-1923's shape is known (see Tier C). |

## Recommended shortlist (value × readiness)

Ordered by what a team could pick up first with the least new information needed, not by raw Score:

1. **[[PM-313-force-deletion-hybrid-cloud-clusters\|PM-313]]** — highest Score, backend done, one product decision away from 🟢.
2. **[[PM-453-load-balancing-envoy-step2\|PM-453]]** — de-risked continuation of in-progress work; write the rollout plan and go.
3. **[[PM-509-show-backup-size-in-ui\|PM-509]]** — small, FULL code reuse, high confidence; resolve the PM-165 overlap first so it isn't duplicated.
4. **[[PM-529-backup-failure-reason-hybrid-cloud\|PM-529]]** — small, FULL code reuse, bounded scope; AC now confirmed via the newly-read Notion doc.
5. **[[PM-102-dynamic-cpu-memory-reservation-buffers\|PM-102]]** — real customer motivation and now-confirmed AC via Notion, but genuinely gated on another team's sizing formula; don't commit a sprint before that lands.
6. **[[PM-280-rewrite-cluster-api-config-logic\|PM-280]]** — already in progress, but moved down this pass: reading the Notion doc didn't unblock it, it re-opened the scoping question. Don't schedule further work here until PM/Eng name the in-scope phase.

Caveat: this shortlist covers the 6 Tier A tickets only — 11/17 issues need at least one scope/size decision before they belong in any sprint plan.

## Design effort recap

Across the 13 UI-relevant tickets (`requires_ui: true` or `probable`): 2 FULL reuse (PM-509, PM-529), 8 PARTIAL (PM-164, PM-165, PM-187, PM-230, PM-284, PM-313, PM-327, PM-345), 1 NONE (PM-486 — no existing shrink-path code or pattern at all), 2 N/A pending scope decisions (PM-430, PM-505). Unchanged by this pass — the Notion re-read affected AC/scope narrative on PM-102, PM-280, and PM-529, none of which are the source of a design-reuse reclassification. Full breakdown with confirmed-vs-deduced status in [[06_DESIGN_FIGMA_REVIEW|06 · Design / Figma review]].

## Proposed Definition of Ready

Reusing the shared rubric from the `definition-of-ready` skill — not reinventing it here. A ticket is 🟢 **Ready to start** only when all seven hold (✅ or a justified N/A); 🟡 **Almost ready** names its single blocker; 🔴 **Not ready** names its reasons from the taxonomy.

| # | Criterion |
|---|---|
| 1 | Objective / description clear — a real description, not a placeholder or a one-liner contradicted by its own comments. |
| 2 | Acceptance criteria defined — in the AC field or a **read** externalized doc; a found-but-unread link is ⚠️, not ✅. |
| 3 | Well scoped — a single story at a realistic size, not an épic bundling several. |
| 4 | Scoring complete — Impact, Confidence, and Size all set so the Score is non-zero and trustworthy. |
| 5 | Design / UI available — a design exists, or is 🔎 deduced from a near-identical existing pattern (logged as a deduction to verify); N/A for backend-only work. |
| 6 | Extrapolable from existing code/contract — buildable by extending what exists, or 🔎 deduced; a genuinely new contract or undecided architecture stays ⚠️/❌ (an ADR is owed). |
| 7 | Context sufficient — origin, dependencies, and constraints captured, not assumed. |

Reason taxonomy for 🔴/🟡 verdicts: missing definitions/AC · missing UI/design · not extrapolable from existing code (ADR owed) · missing context · not well scoped (épic/split) · incomplete scoring · unrealistic estimate. This is the exact taxonomy applied on every card in `tickets/` — see the `definition-of-ready` skill for the full rubric.

**A worked example of criterion 2's "read, not just found" distinction, from this pass:** PM-102 and PM-529's Notion docs moved from unread to read and *confirmed* criterion 2 (✅, real AC found). PM-280's Notion doc also moved from unread to read, but reading it downgraded criterion 2's confidence rather than confirming it — the doc exists and has real content, but that content isn't AC for what the Jira ticket claims is in scope this quarter. "Read" resolves the *unverified* status; it doesn't guarantee the news is good.

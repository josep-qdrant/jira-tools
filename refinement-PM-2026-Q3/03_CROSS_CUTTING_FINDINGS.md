---
title: "Cross-cutting findings — Cloud Unit Regions & Clusters (2026-Q3)"
doc: cross-cutting
team: "Cloud Unit Regions & Clusters"
board: 267
project: PM
scope: "Sprint = 2026-Q3"
generated: 2026-07-01
readonly: true
tags: [backlog-audit, synthesis, PM]
---

# Cross-cutting findings — Cloud Unit Regions & Clusters (2026-Q3)

> [!tldr] Nine patterns repeat across the 17 issues: optimistic sizing on the top-ranked tickets, stale scoring fields, an acceptance-criteria vacuum papered over by rich comment threads (and, for three tickets, by Notion docs now actually read), three Score-0 tickets, a cluster of overlapping Backup-UX scope, and one newly-surfaced scope mismatch (PM-280) uncovered by this pass's Notion re-read.

Patterns across the 17 issues, each with evidence from the cards and a recommended action.

## H1 — Optimistic size inflates the ranking

Six tickets carry a size their own evidence (comments or verified code) contradicts — always as an *under*-estimate, always inflating rank:

| Issue | Score (current) | Size used | Realistic size | Score at realistic size | Evidence |
|---|---|---|---|---|---|
| [[PM-486-allow-disk-downscaling\|PM-486]] | 648 | S (8) | L/XL | 324 (L) / 162 (XL) | Reporter's own comment calls the real mechanism (node recreation + full shard transfer) "very costly"; zero existing code path found. |
| [[PM-345-hybrid-cloud-support-bundle\|PM-345]] | 648 | S (8) | M | 486 | PM's own review comment defers storage/security design to a not-yet-written doc; no agent job-trigger mechanism exists in code today. |
| [[PM-102-dynamic-cpu-memory-reservation-buffers\|PM-102]] | 540 | XS (10) | S | 432 | Sizing formula not yet decided, pending another team's input; spans 4+ cloud-provider paths. The now-read Notion doc confirms AC but doesn't supply the formula either — this risk is unchanged by the Notion re-pass. |
| [[PM-187-multi-channel-alert-notifications\|PM-187]] | 432 | S (8) | M | 324 (at stored Conf) / 216 (at the ticket's own later, more cautious Conf=Medium) | The ticket's own later review comment calls webhook delivery "completely new," contradicting the stored S. |
| [[PM-165-improve-backup-ux\|PM-165]] | 360 | XS (10) | S–M | 288 (S) | Five bundled feature asks, two already tracked as separate Objectives elsewhere in this scope. |
| [[PM-230-cross-region-backups\|PM-230]] | 324 | M (6) | L | 216 | Zero region-aware code in `operator`/`cluster-api`; new schema + snapshot orchestration + billing + restore-flow, confirmed by direct code read. |

By contrast, [[PM-280-rewrite-cluster-api-config-logic|PM-280]]'s XL size correctly caps a 9×9 Impact/Confidence pair at Score 162 — no code partially exists that would shrink the remaining rewrite. That's the model working as designed, not a seventh offender. **Update from this pass:** the newly-read Notion plan shows even that 9×9 Impact/Confidence pair was assessed against the Jira description's "v2 API" framing, which the plan itself treats as the very last "Bonus" step of a much bigger effort — see H1a below, a distinct problem from simple under-sizing.

**Action:** Before planning, re-size these six with the assignee and re-run the ranking. Two of the four highest scores in the batch (PM-486 at #2, PM-345 at #4) sit in this list — the top of the Score ranking is not safe to read at face value.

### H1a — PM-280: the size might be right, but the scope it's sized against might be wrong (new this pass)

Reading PM-280's linked Notion doc ("Cluster module refactor / rewrite plan") for the first time this pass surfaced a distinct problem from H1's under-estimates: PM-280's Jira description frames this quarter's deliverable as a v2 API (5 CRUD endpoints), but the plan sequences that exact ask as **"Bonus: Introduce v2 APIs"** — the last step after four phases (Phase 0–4) of extracting the entire cluster module into a separate Go microservice, touching booking, authentication, quota, alerting, monitoring, and the internal agent along the way. The plan's own "Points to Discuss" section leaves **timeline estimation** blank.

This isn't a case of "the size is too optimistic" (H1's pattern) — it's a case of **not knowing which scope the size was even set against**. XL/162 may be exactly right for an early phase (0–2), wildly wrong for the full plan, or moot if PM-280's real Q3 deliverable is something else entirely. Re-sizing without first pinning the phase would just replace one unverified number with another.

**Action:** PM/Eng name which phase(s) of the linked plan constitute PM-280's actual 2026-Q3 deliverable before touching its Score or Size. This is now the single most consequential open item this resync surfaced — see [[04_PLAN_RECOMMENDATION|04]].

## H2 — Estimates hide multi-repo/cross-team scope

The under-estimated tickets above cluster around a specific shape: a small size that covers only the *visible* framing (a UI tweak, a "wire it up") while the comment thread or code reveals a distributed-systems problem underneath.

- [[PM-486-allow-disk-downscaling|PM-486]]: description asks only for UI messaging; comments reveal a data-migration operation spanning `operator` + `cluster-api` with real data-loss surface.
- [[PM-230-cross-region-backups|PM-230]]: touches 4 repos (`cluster-api`, `operator`, `qdrant-cloud-ui`, `qdrant-cloud`) for schema, snapshot orchestration, billing, and restore-flow — no code partially exists in any of them.
- [[PM-327-volumeattributesclass-hybrid-cloud|PM-327]]: spans 6 repos and is hard-gated on an external, unmerged PR (`qdrant-cloud-agent#646`) outside this team's control.
- [[PM-345-hybrid-cloud-support-bundle|PM-345]]: needs a net-new agent job-trigger mechanism that doesn't exist anywhere in the codebase today.
- [[PM-280-rewrite-cluster-api-config-logic|PM-280]]: the newly-read Notion plan shows the same pattern one level up — a Jira description ("v2 API rewrite") that reads as one repo's work, while the linked plan reveals booking, authentication, quota, alerting, monitoring, and the agent all as dependent modules requiring their own internal-API migration first (see H1a).

**Action:** Treat "touches 3+ repos, one of which has zero existing code for this feature" as an automatic size-review trigger, independent of the stated T-shirt size.

## H3 — Acceptance-criteria vacuum in Jira, but not in substance

The formal `Acceptance Criteria` field (`customfield_10087`) is populated on only 1/17 tickets ([[PM-102-dynamic-cpu-memory-reservation-buffers|PM-102]]) — but that one link is no longer unread. Reading it this pass (along with two more Notion docs reached one hop away, on PM-280 and PM-529) materially improves the picture:

- [[PM-102-dynamic-cpu-memory-reservation-buffers|PM-102]]'s Notion doc, read this pass, confirms five explicit Milestone-1 requirements (correct sizing by node size, schedulability on all providers, headroom for system components, headroom room-to-grow, no restart/disruption) — real AC, now verified, though it still doesn't supply the sizing formula itself (that gap is tracked in Jira comments, not the doc).
- [[PM-529-backup-failure-reason-hybrid-cloud|PM-529]]'s Notion doc, reached one hop via [[PM-59-hybrid-cloud-ux-supportability|PM-59]] and read this pass, contains **Requirement 4.1's "snapshot not finished reason" scenario** — a direct, near-verbatim match for PM-529's stated scope. This resolves the "unread Notion" flag carried since the original audit.
- [[PM-280-rewrite-cluster-api-config-logic|PM-280]]'s Notion doc, read this pass, turns out **not** to be AC for the Jira ticket's stated scope at all — it's a phased architecture plan whose "v2 API" content is its last step, not requirements for this quarter's work (see H1a). Reading it changed the diagnosis from "missing AC" to "AC would be premature until scope is pinned."

Beyond those three, several tickets still have real, detailed requirements outside the formal field — just not filed where the workflow expects them:

- [[PM-313-force-deletion-hybrid-cloud-clusters|PM-313]]: a colleague's comment drafts full AC (resource cleanup, trigger permissions, audit logging) — never promoted to the field.
- [[PM-230-cross-region-backups|PM-230]]: the custom "Observation"/"Value provided" fields function as de facto AC, down to a shouted requirement ("NO CROSS REGION BACKUP RESTORE FOR CLUSTERS!!!").
- [[PM-327-volumeattributesclass-hybrid-cloud|PM-327]]: both open product questions in the description are already answered in a follow-up comment — just not consolidated.
- [[PM-509-show-backup-size-in-ui|PM-509]] and [[PM-529-backup-failure-reason-hybrid-cloud|PM-529]]: descriptions are specific enough that AC can be derived directly (flagged 🔎 on their cards; PM-529's is now also ✅ confirmed via Notion).

Genuine vacuums (no AC anywhere, not even in comments or a readable doc) are [[PM-164-improve-cluster-metrics-ui|PM-164]], [[PM-284-unify-ui-modal-dialogs|PM-284]], [[PM-345-hybrid-cloud-support-bundle|PM-345]], [[PM-430-multi-az-hybrid-cloud|PM-430]], [[PM-486-allow-disk-downscaling|PM-486]], and [[PM-524-hybrid-cloud-integration-tests-real-k8s|PM-524]].

**Action:** A cheap, mechanical pass — promoting comment-thread AC into the AC field, and formally linking the now-read Notion requirements on PM-102/PM-529 — would move at least 4 tickets one notch on the DoR ladder without any new decisions. PM-280 needs a different action: don't promote its doc's content as AC until the phase-scoping question (H1a) is answered.

## H4 — Scoring incomplete / data hygiene

Three tickets score 0 because Impact and Confidence are both null: [[PM-327-volumeattributesclass-hybrid-cloud|PM-327]], [[PM-505-cluster-ui-improvements|PM-505]], [[PM-524-hybrid-cloud-integration-tests-real-k8s|PM-524]]. Two of the three (PM-327, PM-524) are already past "Idea Intake" — PM-327 is "Ready for planning," PM-524 is "Technical Design" — meaning active engineering investment is happening on tickets invisible to any Score-ranked view.

PM-327 is the sharpest case: it's the best-documented ticket in the entire batch (verified code citations, both open questions already answered in comments) with no principled reason for the missing Impact/Confidence — this reads as a refinement oversight, not a genuine unknown.

**Action:** Set Impact/Confidence on PM-327 and PM-524 this week (cheap, no new research needed for PM-327; PM-524 needs a quick sizing conversation once its CRS-1923 dependency is understood). For PM-505, don't re-score — close it (see H4a).

### H4a — PM-505: close, don't refine

[[PM-505-cluster-ui-improvements|PM-505]] went through an Opus escalation in the prior audit pass because its scope had shifted three times across a 5-comment thread. With Notion access restored for that pass, the doc turned out to spec an already-shipped, different feature (the API-key modal, via [[PM-267-improve-cluster-api-key-modal|PM-267]], Done). This resync re-read the card fresh and confirms the finding is unchanged: cross-referencing linked tickets confirmed both decided pieces of PM-505's original ambition already shipped elsewhere — alerts via [[PM-355|PM-355]] (Done), API-key modal via PM-267 (Done) — and the one surviving idea (cluster-overview redesign) is explicitly deferred by the PM's own comments to a not-yet-created, design-gated Q3 objective. There is no refinable residual scope left inside PM-505 itself.

**Action:** Close PM-505 as superseded/done-elsewhere; open a fresh "Cluster overview" objective once design is ready, with Impact/Confidence set from day one.

## H5 — Impact/Confidence inflated or stale relative to the ticket's own evidence

- [[PM-187-multi-channel-alert-notifications|PM-187]]: stored Confidence=High (9) reflects an *earlier* review comment; a *later* comment on the same ticket explicitly walks Confidence back to Medium, and the field was never updated.
- [[PM-284-unify-ui-modal-dialogs|PM-284]]: Confidence=High is directly contradicted by the ticket's own open-questions comment ("What is our confidence based on?"); at Medium the Score would drop from 180 to 120.
- [[PM-345-hybrid-cloud-support-bundle|PM-345]]: Confidence=High sits awkwardly next to four open PM decisions (bundle contents, security review, phase-1 scope) in the reporter's own review comment; a Medium-Confidence recompute drops the Score from 648 to 432.
- [[PM-486-allow-disk-downscaling|PM-486]]: Confidence=High is hard to justify when the reporter's own comment says the only viable approach is an undesigned mechanism borrowed from a different feature.
- [[PM-280-rewrite-cluster-api-config-logic|PM-280]]: not stale in the same way, but flagged this pass for a related reason — Impact=Significant/Confidence=High were both assessed against the Jira description's v2-API scope, which the ticket's own linked plan now shows isn't the near-term deliverable (see H1a). Worth a fresh look once the phase is pinned, not because the current values look wrong on their face, but because what they're rating may not be what ships.

**Action:** Re-confirm Confidence with whoever last commented on each ticket before trusting these five in a Score-ranked view — all five skew the ranking upward on stale, contested, or scope-ambiguous input.

## H6 — Duplicate / overlapping scope in the Backup-UX cluster

Three tickets in this batch touch the same Backups screens with real, named overlap:

- [[PM-165-improve-backup-ux|PM-165]] lists "Add a backup size column to both backup screens" as one of its own five bundled asks.
- [[PM-509-show-backup-size-in-ui|PM-509]] is that identical deliverable, filed as its own Objective, and is formally "blocked by" PM-165 via a Jira issue link.
- [[PM-230-cross-region-backups|PM-230]] is also formally "blocked by" PM-165 (same screens, different feature — region selector), and PM-165's comments separately float "maybe a separate objective" for the multi-region work PM-230 now owns.
- PM-165 also duplicates the already-**Done** [[PM-213-redesign-backups-section|PM-213]]'s deleted-cluster-metadata-preservation scope, and overlaps an **In Progress** sibling design ticket, MKT-317, covering the same schedule UX.

**Action:** Designate one owner per shared deliverable: recommend PM-509 ships the backup-size column independently (it's small, high-confidence, and PM-165 has no committed timeline) and PM-165 strikes that bullet; sequence PM-230's region-selector work explicitly after PM-165's redesign lands; check PM-213's Done scope before re-building any of it inside PM-165.

## H7 — Bucket vs. score mismatch

Not applicable in the strict sense — all 17 issues share a single bucket (`Sprint 2026-Q3`), so there is no cross-bucket mis-ranking to report this quarter. The closer analogue is **status vs. score mismatch**: [[PM-327-volumeattributesclass-hybrid-cloud|PM-327]] ("Ready for planning") and [[PM-524-hybrid-cloud-integration-tests-real-k8s|PM-524]] ("Technical Design") are both actively progressing through the workflow while scoring 0 — see H4. A related variant, new this pass: [[PM-280-rewrite-cluster-api-config-logic|PM-280]] is "In Progress" against a Score computed for a scope its own linked plan doesn't support as the near-term deliverable (H1a) — not a scoring-incomplete case, but a scoring-against-the-wrong-scope case.

## H8 — Ownership & carryover

10/17 tickets are unassigned, including the current #2 and #4 by Score ([[PM-486-allow-disk-downscaling|PM-486]], [[PM-345-hybrid-cloud-support-bundle|PM-345]]) and the current top-ranked ticket by a wide margin, [[PM-313-force-deletion-hybrid-cloud-clusters|PM-313]] (Score 810). 6/17 are carried over from an earlier quarter (PM-102, PM-164, PM-165, PM-280, PM-327, PM-453), and [[PM-505-cluster-ui-improvements|PM-505]] has been open across at least three quarters per its own card — the clearest carryover case, and the one this package recommends closing rather than carrying again.

**Action:** Assign an owner to PM-313 before planning, given it's both the top Score and one blocker away from 🟢. Don't carry PM-505 into a fourth quarter — close it per H4a. PM-280 already has an owner (Bastian Hofmann) — route the phase-scoping question (H1a) to them directly.

## H9 — Scope hidden in linked tickets

11/17 tickets carry linked issues (`linked_issues` non-empty); zero tickets in this batch use formal Jira `subtasks` — all hierarchy signal comes from `issuelinks`, not subtasks.

| Parent | Size | Linked-issue count | Linked issues |
|---|---|---|---|
| [[PM-505-cluster-ui-improvements\|PM-505]] | M | 6 | PM-267 (Done), MKT-232, MKT-233 (Done), MKT-234 (Done), MKT-235, PM-355 (Done) |
| [[PM-187-multi-channel-alert-notifications\|PM-187]] | S | 6 | PM-403, PM-305, CRC-2031, PM-500, PM-517, PM-527 |
| [[PM-165-improve-backup-ux\|PM-165]] | XS | 4 | PM-213 (Done), MKT-317, PM-509, PM-230 |
| [[PM-453-load-balancing-envoy-step2\|PM-453]] | S | 3 | PM-312 (Done), CP-458 (Done), PM-184 (likely mislinked, flagged) |
| [[PM-280-rewrite-cluster-api-config-logic\|PM-280]] | XL | 2 | PM-310 (Done), PM-281 |
| [[PM-230-cross-region-backups\|PM-230]] | M | 2 | PM-404, PM-165 |
| [[PM-509-show-backup-size-in-ui\|PM-509]] | S | 2 | PM-501, PM-165 |
| [[PM-164-improve-cluster-metrics-ui\|PM-164]] | S | 1 | PM-435 |
| [[PM-313-force-deletion-hybrid-cloud-clusters\|PM-313]] | XS | 1 | CRC-125 |
| [[PM-529-backup-failure-reason-hybrid-cloud\|PM-529]] | S | 1 | PM-59 |
| [[PM-524-hybrid-cloud-integration-tests-real-k8s\|PM-524]] | S | 1 | CRS-1923 (Backlog, unscoped — hard blocker) |

PM-505's six links are the sharpest "hidden scope in reverse" case: three of the six are already Done, which is exactly how the H4a close-verdict was reached — the parent looks open, but its decided scope is already delivered across its own linked tickets.

**One-hop-away signals worth linking directly on the parent:**
- **Design found only via a linked ticket** (`design_source: linked_ticket`): [[PM-529-backup-failure-reason-hybrid-cloud|PM-529]], credited from PM-59's Figma — flagged unconfirmed since PM-59's own text strikes through that section as superseded. **This pass also reached PM-59's own linked Notion doc and read it**: Requirement 4.1's "snapshot not finished reason" scenario confirms the doc still applies to PM-529 post-split, resolving the AC question even though the Figma-node question remains open (a separate, Figma-tool gap).
- **Design found one hop away but explicitly not counted** (wrong scope match): [[PM-230-cross-region-backups|PM-230]] (PM-165's Figma covers PM-165's own redesign, not cross-region) and [[PM-505-cluster-ui-improvements|PM-505]] (two Figmas one hop away — MKT-235's nav draft and PM-267's API-key-dialog design — neither matches PM-505's stated scope).
- **A Notion doc found one hop away that changed the diagnosis, not just filled a checkbox**: [[PM-280-rewrite-cluster-api-config-logic|PM-280]]'s Technical Documentation link (direct on the ticket, not one hop, but newly read this pass) revealed the scope mismatch in H1a — the clearest example this pass of why "found but unread" should never be treated as equivalent to "checked."
- **A hard external blocker surfaced only via a linked ticket**: [[PM-524-hybrid-cloud-integration-tests-real-k8s|PM-524]] depends on CRS-1923 (a different project, still Backlog) — the dependency is visible only via `issuelinks`, not named in PM-524's own description.

**Action:** For PM-529, either confirm and link the Figma directly on the parent or drop the design credit (the AC question is now closed). For PM-524, add the CRS-1923 dependency explicitly to the description so it isn't only discoverable one hop away. For PM-280, treat the newly-read plan as the trigger for the phase-scoping conversation in H1a, not as a solved checkbox.

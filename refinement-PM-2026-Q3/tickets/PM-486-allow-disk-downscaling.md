---
ticket: PM-486
aliases: ["PM-486"]
title: "Allow disk downscaling"
type: Objective
status: Idea Intake
bucket: 2026-Q3
objective_class: Standard
owner: unassigned
priority: Medium
domain: "—"
carryover: false
size: S
size_factor: 8
impact: 9
confidence: 9
score: 648
scoring_complete: true
requires_ui: probable
design_linked: false
design_source: none
design_reuse: NONE
code_reuse: NONE
repos: [qdrant-cloud-cluster-api, operator, qdrant-cloud-ui]
notion: none
slack_context: none
github_context: none
subtasks: []
linked_issues: []
child_context: none
dor: not-ready
jira: https://qdrant.atlassian.net/browse/PM-486
tags: [backlog-audit, ticket, PM, readiness/not-ready]
---

# PM-486 · Allow disk downscaling

> [!tldr] 🔴 NOT READY · Score 648 (S) — **the ticket's own comment thread says this needs a costly node-recreation + shard-transfer mechanism, not a UI tweak; description and S size only cover the UI framing**

**Type:** Objective · **Sprint:** 2026-Q3 (new, no carryover) · **Status:** Idea Intake · **Objective Class:** Standard · **Owner:** unassigned · **Priority:** Medium
**Link:** [PM-486](https://qdrant.atlassian.net/browse/PM-486) · **Reporter:** Andrey Vasnetsov · **Domain:** — · **Created/Updated:** 2026-06-01 / 2026-06-25
**Subtasks:** none
**Linked issues:** none
**Related:** none found in this batch

---

## Audit summary

| Axis | Verdict | Short note |
|------|---------|------------|
| 1. Goal / scope | Gap | Description asks for UI messaging only; **comments reveal the real ask is a backend capability that doesn't exist** |
| 2. UI / Design | Risk | No design of any kind; UI is the smallest part of the real problem |
| 3. Size (S) | Risk | **S badly understates a "recreate node on smaller disk + transfer all shards" operation the reporter calls "very costly"** |
| 4. Prioritization (Score 648) | Risk | Impact/Confidence (9×9) plausible for the underlying capability, but **the Score is computed against an S estimate that only covers the UI framing, not the actual work** |

## Project & technical notes

**Project(s):** `qdrant-cloud-cluster-api` (Python, leader — booking/cluster resize logic), `operator` (Go, secondary — would need to orchestrate node recreation/shard transfer if built), `qdrant-cloud-ui` (React/TS, secondary — status/messaging surface only)
**How it'd be done (high level):** Per the ticket's own comments, disk downscaling can't be done in-place (cloud providers don't support shrinking a live volume); it would have to reuse the on-demand-replication mechanism — provision a new node with a smaller disk and transfer shards onto it, then decommission the old node — with the UI showing progress/status throughout.
**Technical notes:** **Zero existing code path for this** — confirmed by repo search (see Code reuse below). This is a distributed data-migration operation, not a UI feature, with real risk (data-loss surface during shard transfer, time-consuming operation needs a robust status/progress mechanism).
**Identification confidence:** Medium — the UI surface is easy to place; the actual backend mechanism (on-demand replication reuse) is named in a comment but not specified as a plan, spec, or ticket anywhere.

## 1. Goal & scope clarity

The **description** asks only for UI messaging ("Explain in the UI that this operation will take time... think of how to show status"), framed around a scale-up-then-can't-scale-down-later pain point. But the **3-comment thread is the real spec**, and it says something different: Bastian Hofmann states cloud providers don't allow volume shrink at all, so the only way is "recreate the whole node on a smaller disk... transferring all shards... a very costly operation," and Andrey Vasnetsov confirms it can reuse the on-demand-replication approach. **This is a material scope gap between what the ticket says and what the people on it actually agreed is needed** — no acceptance criteria, no plan for the shard-transfer mechanism, no discussion of triggers/limits/rollback. There is no Notion link, no Draft Requirements, nothing externalized — this ticket's real definition lives only in three Jira comments.

## 2. UI / Design needs

**Design reuse (code `qdrant-cloud-ui`):** NONE — the closest existing pattern, `ClusterScaleSettingsDiskSpace.tsx`, explicitly hard-codes "disk space can only be increased" and gates any shrink path off entirely (`isDiskExpandable` check, `MIN_DISK_SPACE`/`MAX_DISK_SPACE` only used for growth). There is no in-progress/status-messaging component in this codebase for a long-running node-recreation operation to copy from.

**Design / Figma:** No — checked all five places: design fields (`UX Designs`, `Concept Design`, `Design` all null), 0 attachments, description has no figma.com/notion.so URL, 0 issue links, 0 remote links (`getJiraIssueRemoteIssueLinks` confirmed empty).

**Requires UI? Probable** — a status/progress indicator during the (potentially long) shard-transfer operation, plus messaging about the cost/duration up front. But the UI is the small part; the missing piece is the backend mechanism it would report on.

Missing design-asset checklist:

- [ ] Backend plan/spec for the node-recreation + shard-transfer mechanism (nothing exists yet, in code or in writing beyond one comment)
- [ ] UI mockup or pattern for showing long-running-operation status (no analogous "in-progress migration" indicator found in the UI repo)
- [ ] Trigger/limits definition (when can a customer request this, are there guardrails on frequency/size delta)

## 3. Size coherence (T-Shirt Size)

Size **S** (factor 8).

> [!warning] Estimate alert (under/over-estimation risk)
> **S is not credible against the ticket's own comment thread.** A "very costly operation" (reporter's words) that recreates a node and transfers all shards to a new, smaller-disk node is a distributed migration feature touching the operator's provisioning path and the cluster-api's resize/booking logic — with real data-loss risk during transfer. Nothing in the repos suggests this exists in any form today (confirmed empty searches across `cluster-api` and `operator` for resize/shrink/volume terms). Realistic estimate is **L or XL**; review before committing.

Recomputing with a more realistic size: Impact 9 × Confidence 9 × Size(L=4) = **324** (down from 648), or × Size(XL=2) = **162**. Either way this ticket would drop meaningfully in rank — from tied-for-top (648) to mid-pack or near the bottom of this quarter's scope.

## 4. Prioritization (Impact / Confidence / Score)

| Variable | Value | Numeric |
|----------|-------|---------|
| Impact (calc) | Significant | 9 |
| Confidence (calc) | High | 9 |
| Size factor (S) | — | 8 |
| **Score (RICE)** | — | **648** |

Model check: 9 × 9 × 8 = **648 ✓** (arithmetic reconciles).

Assessment: Impact=Significant is plausible (disk-downscale is a real, recurring customer pain per the description's framing). **Confidence=High is hard to justify** given the reporter's own comment says the only viable approach is an expensive, undesigned mechanism reused from a different feature (on-demand replication) — that is a "Confidence: Medium" situation at best until someone confirms the approach actually works for this use case. **The Score is real only if the S size is real, and it isn't** — see axis 3.

## Code reuse (`qdrant-cloud-cluster-api`, `operator`, `qdrant-cloud-ui`)

**Verdict: NONE — no disk-shrink path exists anywhere in the three repos checked.**

**Already exists (reusable):**

- `qdrant-cloud-ui/src/components/Clusters/ClusterScale/ClusterScaleSettingsDiskSpace.tsx` — the disk-space scaling UI, but it only supports growth and explicitly blocks shrink (`"Note: Cluster disk space can only be increased"`).
- The on-demand-replication mechanism referenced in Andrey's comment, as a conceptual analog for moving shards to a new node — not verified in code this pass (out of scope for a 3-term sweep); would need a targeted follow-up search if this ticket moves forward.

**New / to build:**

- The actual node-recreation + shard-transfer orchestration (likely `operator` + `cluster-api` coordination).
- A resize/downscale-request API path in `cluster-api` (none found: zero hits for `disk_size`/`resize`/`shrink`/`volume_size` terms in the repo).
- UI messaging/status component for a long-running migration operation.

**Suggested approach:** Don't scope this as a UI ticket. Split into (1) a backend spike/design-doc for the shard-transfer mechanism (ADR-level decision), and (2) a UI-only follow-up once the backend contract exists.

## Linked-ticket context

No linked tickets — child_context: none. `subtasks` and `linked_issues` are both empty; issue links array is empty and 0 remote links were found.

## Notion context

No Notion links found — notion: none. (Acceptance Criteria, Draft Requirements, Technical Documentation, Concept Design, and UX Designs fields are all null on this ticket.)

## Definition of Ready (DoR)

> [!danger] Verdict: 🔴 NOT READY — the description undersells the real scope; the actual requirement (a costly backend migration mechanism) lives only in comments, with no plan, no AC, and a size that doesn't remotely match it

| DoR criterion | Status |
|---|---|
| Objective / description clear | ⚠️ |
| Acceptance criteria defined | ❌ |
| Well scoped (realistic size, not an épic) | ❌ |
| Scoring complete (Impact·Confidence·Size) | ✅ |
| Design / UI available | ❌ |
| Extrapolable from existing code/contract | ❌ |
| Context sufficient | ⚠️ |

**Deductions to verify:** none — every gap here is stated plainly (comments) or confirmed by code search, not inferred.

**To be ready it needs:** **Not well scoped (épic/split)** — split the backend mechanism (design/ADR) from the UI messaging follow-up — plus **unrealistic estimate** (S should be L/XL) and **missing definitions/AC** (no requirements beyond the comment thread). Until the backend approach is designed and sized honestly, this can't enter a sprint as a single S-sized story.

---
ticket: PM-430
aliases: ["PM-430"]
title: "Multi AZ Support in Hybrid Cloud"
type: Objective
status: Backlog
bucket: 2026-Q3
objective_class: Standard
owner: unassigned
priority: Medium
domain: Clusters
carryover: false
size: M
size_factor: 6
impact: 6
confidence: 2
score: 72
scoring_complete: true
requires_ui: probable
design_linked: false
design_source: none
design_reuse: N/A
code_reuse: NONE
repos: [operator, qdrant-cloud-cluster-api, qdrant-cloud-ui]
notion: none
slack_context: none
github_context: found
subtasks: []
linked_issues: []
child_context: none
dor: not-ready
jira: https://qdrant.atlassian.net/browse/PM-430
tags: [backlog-audit, ticket, PM, readiness/not-ready]
---

# PM-430 · Multi AZ Support in Hybrid Cloud

> [!tldr] 🔴 NOT READY · Score 72 (M) · **explicitly flagged Low confidence — the team's own comments say a spike is needed before this can even be scoped**

**Type:** Objective · **Sprint:** 2026-Q3 (not carryover — created 2026-04-15) · **Status:** Backlog · **Objective Class:** Standard · **Owner:** unassigned · **Priority:** Medium
**Link:** [PM-430](https://qdrant.atlassian.net/browse/PM-430) · **Reporter:** Bastian Hofmann · **Domain:** Clusters · **Created/Updated:** 2026-04-15 / 2026-06-25
**Subtasks:** none
**Linked issues:** none
**Related:** same Hybrid Cloud admin-tooling theme as [[PM-345-hybrid-cloud-support-bundle|PM-345]]; the PM-312 (Improve load balancing, Step 1) engineering thread references a **different, already-in-progress** managed-cloud objective "Multi AZ - Topology aware LB routing" (PM-364) — worth checking for overlap, not fetched here (outside PM-430's own links)

---

## Audit summary

| Axis | Verdict | Short note |
|------|---------|------------|
| 1. Goal / scope | Gap | Description states the goal but the team's own comments say a **spike is needed** to even know how the flag maps to operator behavior |
| 2. UI / Design | N/A (probable) | No enable/disable toggle design found; likely needed but genuinely secondary to the backend uncertainty |
| 3. Size (M) | Risk | **M assumes the mechanism is known; a comment raises unresolved edge cases (zone-label detection, constraint type, storage-class binding mode) that could expand scope significantly** |
| 4. Prioritization (Score 72) | OK | **Confidence=Low is honestly reflected in the Score — this is correctly the lowest-ranked ticket in the 17-issue scope, exactly because the team flagged it as unproven** |

## Project & technical notes

**Project(s):** `operator` (leader — must translate the Multi-AZ flag into `topologySpreadConstraints` on the StatefulSet/pods) and `qdrant-cloud-cluster-api` (API surface for the toggle, proto field already referenced as existing); secondary: `qdrant-cloud-ui` (enable/disable control), if the toggle is customer-facing.
**How it'd be done (high level):** Expose a Multi-AZ boolean on the Hybrid Cloud cluster config, translate it into a Kubernetes `topologySpreadConstraint` on the deployed pods, and decide whether to enforce (`DoNotSchedule`, as managed cloud does) or merely hint (`ScheduleAnyway`) given Qdrant doesn't control hybrid customers' node pools.
**Technical notes:** A senior engineer's comment raises real, unresolved risk: hybrid clusters run on customer-owned infrastructure, so Qdrant can't guarantee zone labels exist or that `DoNotSchedule` is safe (a customer with too few zones/nodes could get stuck-Pending pods). This is a legitimate **architecture question, not just an estimate wrinkle** — worth an ADR before committing size.
**Identification confidence:** Medium — repos are right (confirmed no multi-AZ/topology code exists yet in either `operator` or `qdrant-cloud-cluster-api`, matching the team's own "this doesn't exist yet" framing), but the actual mechanism is undecided.

## 1. Goal & scope clarity

The description is short but real: enable/disable Multi-AZ independent of `topologySpreadConstraints`, with topology-aware shard distribution when active, at no extra charge (Hybrid Cloud doesn't own the infra). That's a clear one-line goal.

But the two engineering comments attached to the ticket make clear this is **pre-spike, not pre-build**:

- Josep Fornies (comment): *"spike: how does the Multi-AZ flag map to `topologySpreadConstraints` in the operator; are there edge cases with rebalancing or upgrades?"* — an open spike, not a resolved question.
- Anton Antonov (comment): raises whether Qdrant should check `topology.kubernetes.io/zone` labels or just assume they exist (with a warning), which enforcement mode to use (`DoNotSchedule` vs `ScheduleAnyway`), whether the customer should control `maxSkew` via UI, and flags `StorageClass` / `volumeBindingMode: WaitForFirstConsumer` implications. **None of these are answered in the ticket.**

There's no formal AC (`customfield_10087` null), and the "Observation" field (business-context notes) only covers parity/restriction framing ("all hybrid customers", "same restrictions as managed"), not the technical unknowns above.

## 2. UI / Design needs

**Design reuse:** N/A for this audit pass — the ticket doesn't clearly establish whether a customer-facing toggle is even needed yet (the "enable/disable independent of topologySpreadConstraints" wording could mean an internal flag). Given the backend mechanism itself is unresolved, judging design reuse now would be premature.

**Design / Figma:** No — checked all five places: `Concept Design`/`UX Designs`/`Technical Documentation` all null; 0 attachments; no `figma.com`/`notion.so` URL in description, AC, or comments; 0 issuelinks; 0 remote links (`getJiraIssueRemoteIssueLinks` returned `[]`).

**Requires UI? Probable** — if customers can toggle Multi-AZ and/or control `maxSkew`/enforcement mode (per Anton's comment), a UI surface is needed; unconfirmed until the spike resolves scope.

Missing design-asset checklist (deferred — backend spike gates this):

- [ ] Decide if the toggle is customer-facing before scoping UI at all

## 3. Size coherence (T-Shirt Size)

Size **M** (factor 6).

> [!warning] Estimate alert (under/over-estimation risk)
> **M was set before the spike the team itself called for.** If zone-label detection, enforcement-mode choice, and StorageClass binding-mode interactions turn out to need real design work (per Anton's comment), this could grow past M — especially since hybrid clusters, unlike managed, aren't under Qdrant's infrastructure control, so failure modes must be handled defensively rather than assumed away. Realistic estimate: **keep at M provisionally, but do not commit until the spike lands** — this could become L if the enforcement-mode question requires new UI/API surface.

Re-estimating at **L** (factor 4, per the scope's own placeholder value — not confirmed against any 2026-Q3 issue): 6 × 2 × 4 = **48**, an even lower Score — the size risk here cuts toward *less* urgency, not more, reinforcing that this shouldn't be picked up before the spike.

## 4. Prioritization (Impact / Confidence / Score)

| Variable | Value | Numeric |
|----------|-------|---------|
| Impact (calc) | Measurable | 6 |
| Confidence (calc) | Low | 2 |
| Size factor (M) | — | 6 |
| **Score (RICE)** | — | **72** |

Model check: 6 × 2 × 6 = **72 ✓**

Assessment: This is the **one ticket in the 2026-Q3 scope with Confidence=Low**, and the comments justify it well — genuine unresolved architecture questions, not just missing paperwork. The low Score correctly reflects that. No incoherence here: the scoring model is doing its job by ranking this near the bottom until the spike closes the gap.

## Code reuse (`operator`, `qdrant-cloud-cluster-api`)

**Verdict: NONE — confirmed, no multi-AZ/topology-aware scheduling code exists in either repo today.**

**Already exists (reusable):**

- None found. Targeted searches (`rg -i topology`, `rg -i "multi.?az|availabilityZone"`) in `operator` (`*.go`) and `qdrant-cloud-cluster-api` (`*.py`) returned no matches.
- The managed-cloud equivalent Anton's comment cites (`cluster_api/cluster/cr_service.py` lines 188-211, `DoNotSchedule` enforcement) is **referenced but not found at that path in the current repo snapshot** — likely moved/refactored since the comment was written (2026-06-09); worth re-locating before using it as a template.

**New / to build:**

- Zone-label detection/fallback logic in the operator
- The `topologySpreadConstraint` translation itself (enforcement mode, `maxSkew`)
- Any customer-facing control surface, if confirmed needed

**Suggested approach:** Do the spike first — locate the current managed-cloud topology-aware scheduling code (renamed from `cr_service.py`) as a starting template, then decide enforcement mode for hybrid before writing any hybrid-specific code.

## Linked-ticket context

No linked tickets — child_context: none.

## Notion context

No Notion links found — notion: none.

## Definition of Ready (DoR)

> [!danger] Verdict: 🔴 NOT READY — the team's own comments call for an unresolved spike before this can be built

| DoR criterion | Status |
|---|---|
| Objective / description clear | ✅ |
| Acceptance criteria defined | ❌ |
| Well scoped (realistic size, not an épic) | ⚠️ |
| Scoring complete (Impact·Confidence·Size) | ✅ |
| Design / UI available | N/A |
| Extrapolable from existing code/contract | ❌ |
| Context sufficient | ⚠️ |

**Deductions to verify:** none — this card intentionally avoids deducing a design/code path, since the team itself flagged the mechanism as an open spike; deducing here would overstate readiness.

**To be ready it needs:** Not extrapolable from existing code (the operator/cluster-api topology-aware scheduling pattern needs to be located and evaluated for hybrid's constraints — an ADR is effectively owed on enforcement mode) and missing context (the spike Josep and Anton called for in comments hasn't been logged as resolved anywhere in the ticket). Do not commit a size/Score until the spike lands.

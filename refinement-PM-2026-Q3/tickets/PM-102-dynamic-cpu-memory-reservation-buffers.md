---
ticket: PM-102
aliases: ["PM-102"]
title: "Dynamic CPU and Memory reservation buffers in managed cloud"
type: Objective
status: Ready for planning
bucket: 2026-Q3 (carried over from 2025-Q3)
objective_class: Standard
owner: Bastian Hofmann
priority: Medium
domain: Clusters
carryover: true
size: XS
size_factor: 10
impact: 9
confidence: 6
score: 540
scoring_complete: true
requires_ui: false
design_linked: false
design_source: none
design_reuse: N/A
code_reuse: PARTIAL
repos: [qdrant-cloud-cluster-api, operator]
notion: read
slack_context: none
github_context: none
subtasks: []
linked_issues: []
child_context: none
dor: almost-ready
jira: https://qdrant.atlassian.net/browse/PM-102
tags: [backlog-audit, ticket, PM, readiness/almost-ready]
---

# PM-102 · Dynamic CPU and Memory reservation buffers in managed cloud

> [!tldr] 🟡 ALMOST READY · Score 540 (XS) · Notion doc read (Milestone 1 requirements confirm AC) — remaining blocker is the sizing algorithm itself: no formula yet, no resilience-team input, and XS likely underestimates a per-provider rollout with no-restart migration

**Type:** Objective · **Sprint:** 2026-Q3 (carried from 2025-Q3, closed without completing; created 2025-06-06) · **Status:** Ready for planning · **Objective Class:** Standard · **Owner:** Bastian Hofmann · **Priority:** Medium
**Link:** [PM-102](https://qdrant.atlassian.net/browse/PM-102) · **Reporter:** Bastian Hofmann · **Domain:** Clusters · **Created/Updated:** 2025-06-06 / 2026-06-25
**Subtasks:** none
**Linked issues:** none
**Related:** backend counterpart to the reservation logic touched by [[PM-280-rewrite-cluster-api-config-logic|PM-280]] (cluster-api config rewrite); worth sequencing together.

---

## Audit summary

| Axis                          | Verdict | Short note                                                                                                                                       |
| ----------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1. Goal / scope               | Risk    | Objective and rationale are clear; the actual sizing algorithm is an open question, not just a formalization detail                              |
| 2. UI / Design                | N/A     | Backend-only; only UI touch is an optional dismissible "promote this change" copy, explicitly flagged open                                       |
| 3. Size (XS)                  | Risk    | **XS likely underestimates**: a new formula (pending resilience-team input), per-cloud-provider values, and a no-restart-required migration path |
| 4. Prioritization (Score 540) | OK      | Impact/Confidence match the documented "Objective review" rationale; arithmetic checks out                                                       |

## Project & technical notes

**Project(s):** `qdrant-cloud-cluster-api` (leader, owns the reservation-percentage calculation and per-cluster config); `operator` (secondary, applies the resulting resource requests/limits to node pods on reconcile).
**How it'd be done (high level):** replace the flat per-provider reservation percentage with a formula that scales down (in percentage terms) as node size grows, reusing the existing per-cluster override columns; the operator picks up new values on the next reconcile/restart, no code change needed there if the contract (percentage in, resources out) stays the same.
**Technical notes:** the actual formula is not decided; the ticket explicitly asks the resilience team for numbers (unanswered as of the last comment, 2026-06-16). Depends on aligning cross-team before implementation starts.
**Identification confidence:** High (the exact functions and migration implementing today's flat-percentage mechanism were found and read).

## 1. Goal & scope clarity

Objective is clear and well-motivated: today's reservation is a fixed percentage of CPU/memory per cloud provider, independent of node size, over-reserving on large nodes. The rich "Objective review" custom field lays out Impact/Confidence/Size reasoning explicitly (competitor comparison, no observed churn yet, formula and copy are named as **open questions**), which is unusually good documentation for a Jira ticket, but it's also the field self-declaring the gap: **no formula chosen yet**, and "asked resilience team to provide their input" (comment thread) has no resolution as of 2026-06-16, two weeks before the quarter starts. Migration constraint is explicit and sound: no restart on change, applied on next natural restart.

The AC field is a bare Notion link (see Notion context below); it was read this pass. It confirms the same problem framing (fixed per-provider percentage over-reserving on large nodes) and adds a Milestone 1 "Requirements" list — correctly-calculated values, schedulability on all providers, headroom for system/monitoring (with room to grow), and no restart/disruption during rollout. It does **not** state the actual formula — that's still the open item tracked in the ticket's own comments (resilience-team input pending), consistent with, not contradicted by, the Jira description.

## 2. UI / Design needs

**Requires UI? No.** This is a backend resource-calculation change. The one UI-adjacent item ("copy to promote this change more prominently, in a dismissible format") is explicitly logged as an open question, not committed scope.

**Design / Figma:** No; not applicable. Hunted all five places (design fields empty, no attachments, no Figma/Notion-embedded design links, no issue links, 0 remote links) and none apply since there's no UI surface.

## 3. Size coherence (T-Shirt Size)

Size **XS** (factor 10).

> [!warning] Estimate alert (under/over-estimation risk)
> XS assumes a small, contained code change. But the real scope is: (1) design a new formula, not yet decided, blocked on another team's input; (2) apply it across at least 4 cloud-provider paths (AWS/GCP/Azure/Hybrid, each with its own reserved-percentage config already in code); (3) the ax4 GPU package's extra hard-coded CPU reservation needs revisiting too; (4) verify the no-restart/queue-until-next-restart migration path actually holds for existing clusters. Realistic estimate **S**; review before committing, and don't start implementation before the resilience-team formula lands.

Re-estimating S (8) instead of XS (10): 9 × 6 × 8 = 432 vs. current 540, a **17% score drop**, enough to move it below [[PM-345-hybrid-cloud-support-bundle|PM-345]], [[PM-453-load-balancing-envoy-step2|PM-453]] and [[PM-486-allow-disk-downscaling|PM-486]] (all Score 648) in the ranking, though it would still rank above the bulk of the S/M tickets in this batch.

## 4. Prioritization (Impact / Confidence / Score)

| Variable | Value | Numeric |
|----------|-------|---------|
| Impact (calc) | Significant | 9 |
| Confidence (calc) | Medium | 6 |
| Size factor (XS) | n/a | 10 |
| **Score (RICE)** | n/a | **540** |

Model check: 9 × 6 × 10 = **540 ✓**

Assessment: Impact=Significant and Confidence=Medium are both justified by the ticket's own review notes (churn-reduction rationale, competitor precedent, but "not to the extent of leaving yet," hence Medium, not High, confidence). The Score itself is arithmetically sound; the risk is entirely in the Size input (axis 3), which would pull the Score down to 432 if corrected.

## Code reuse (`qdrant-cloud-cluster-api`)

**Verdict: PARTIAL. The configuration surface and calculation call sites already exist; only the formula changes.**

**Already exists (reusable):**

- `cluster_api/cluster/kubernetes.py::get_reserved_cpu_percentage` / `get_reserved_ram_percentage`: resolve a flat percentage per cloud provider (AWS/GCP/Azure/Hybrid), with a per-cluster override (`cluster.configuration.reserved_cpu_percentage` / `reserved_memory_percentage`).
- `cluster_api/cluster/kubernetes.py::calculate_cpu_amount_after_reservation` / `calculate_ram_amount_after_reservation`: apply the percentage to the node's total resources; already has one size-aware special case (the `ax4` GPU package gets extra reserved CPU).
- Migration `613478f05255_add_configurable_resource_reservations.py`: the `reserved_cpu_percentage`/`reserved_memory_percentage` columns on `cluster_configurations` already ship a per-cluster override path.

**New / to build:**

- The actual size-scaling formula (percentage decreasing as node size grows), not started, pending resilience-team numbers.
- Wiring the formula into `get_reserved_cpu_percentage`/`get_reserved_ram_percentage` by node size instead of (or in addition to) cloud provider.
- Confirming existing clusters pick up the new values without a restart (migration/rollout plan), and whether `operator` needs any change to how it reads these values on reconcile.

**Suggested approach:** keep the existing per-provider override architecture; replace the flat percentage lookup with a size-bucketed (or continuous) formula once resilience provides the numbers, and verify `operator` reconciliation applies changed values on the cluster's next natural restart without extra work.

## Linked-ticket context

No linked tickets, child_context: none.

## Notion context

> Re-audited 2026-07-01 — the Notion MCP tool was available this pass (it was not in the original session).

| Notion doc | Fetched? | Doc type | Last edited | Found in |
|---|---|---|---|---|
| [Dynamic CPU and Memory reservation buffers in managed cloud](https://www.notion.so/qdrant/Dynamic-CPU-and-Memory-reservation-buffers-in-managed-cloud-22c674779d33809ca561f8b2e39c6c07) | ✅ read | Objective spec (Milestone 1: "Implement Dynamic Resource Reservation Logic") | ~2025-07-22 (page snapshot date) | Acceptance Criteria field |

**Key takeaways (from the doc):**

- **Requirements / AC:** Milestone 1 lists five explicit requirements: (1) new CPU/memory values correctly calculated by node size, (2) nodes of all sizes remain schedulable on all cloud providers, (3) sufficient headroom left for system/monitoring components, (4) that headroom stays conservative enough to let system/monitoring grow, (5) no service disruption or restarts for existing clusters during the initial rollout.
- **Decisions recorded:** None beyond the requirements above — the doc doesn't name a formula or provider-specific values.
- **Open questions:** None stated in the doc itself; the "formula not yet decided, pending resilience-team input" gap is tracked only in the Jira ticket's comment thread, not in this doc.
- **Links inside the doc:** None found.
- **Scope boundaries:** Single milestone ("Milestone 1"); no phase 2 or later work defined — matches the ticket's single-story framing.

**Freshness:** Notion page snapshot ~2025-07-22 vs. ticket updated 2026-06-25 — stale by ~11 months, but not contradicted: this is a stable, high-level Objective spec that predates the later cross-team formula discussion, not a doc that should have tracked it.

**Discrepancies with the Jira ticket:** None. The no-restart/no-disruption constraint and the fixed-percentage-over-reserves-on-large-nodes framing match the Jira description exactly.

**Effect on DoR:** Criterion 2 moves to ✅ *externalized in Notion — read*, containing real requirements. This does not resolve the ticket's actual open blocker (the sizing formula itself, and the XS size-estimate risk) — those stand independently of Notion coverage.

## Definition of Ready (DoR)

> [!warning] Verdict: 🟡 ALMOST READY — AC now confirmed via Notion; the remaining, single blocker is the resilience team's sizing formula (and the XS size estimate that depends on it)

| DoR criterion                             | Status                                                                    |
| ----------------------------------------- | ------------------------------------------------------------------------- |
| Objective / description clear             | ✅                                                                         |
| Acceptance criteria defined               | ✅ externalized in Notion — read (Milestone 1 requirements)                |
| Well scoped (realistic size, not an épic) | ⚠️ single coherent story, but size input (XS) is likely wrong, see axis 3 |
| Scoring complete (Impact·Confidence·Size) | ✅                                                                         |
| Design / UI available                     | N/A (backend-only)                                                        |
| Extrapolable from existing code/contract  | 🔎 deduced                                                                |
| Context sufficient                        | ✅                                                                         |

**Deductions to verify:**
- The change is extrapolable from the existing per-cluster reservation-percentage override mechanism (`kubernetes.py`); basis: analogous code already computes and overrides reserved CPU/RAM percentage per cluster, including one size-aware special case (ax4); confidence: High; confirm by: engineer confirming the new formula plugs into the same function signatures without a contract change.

**To be ready it needs:** Not extrapolable from existing code in one respect: the sizing **formula itself** is a genuine open decision pending resilience-team input, not something derivable from today's code or the (now-read) Notion doc. Next step: get the resilience team's numbers and re-size to S before planning; AC is otherwise confirmed.

---
ticket: PM-164
aliases: ["PM-164"]
title: "Improve Cluster Metrics UI"
type: Objective
status: Requirement Definition
bucket: 2026-Q3 (carried over, comment confirms "not ready to start implementation")
objective_class: Standard
owner: Amogha Sathyanarayana
priority: Medium
domain: Clusters
carryover: true
size: S
size_factor: 8
impact: 6
confidence: 6
score: 288
scoring_complete: true
requires_ui: true
design_linked: false
design_source: none
design_reuse: PARTIAL
code_reuse: PARTIAL
repos: [qdrant-cloud-ui]
notion: none
slack_context: none
github_context: none
subtasks: []
linked_issues: [PM-435]
child_context: full
dor: not-ready
jira: https://qdrant.atlassian.net/browse/PM-164
tags: [backlog-audit, ticket, PM, readiness/not-ready]
---

# PM-164 · Improve Cluster Metrics UI

> [!tldr] 🔴 NOT READY · Score 288 (S) · Huge, unscoped wish-list of ~25 new metrics with no design and no prioritization: this is several stories, not one

**Type:** Objective · **Sprint:** 2026-Q3 (carried over; comment: "not ready to start implementation") · **Status:** Requirement Definition · **Objective Class:** Standard · **Owner:** Amogha Sathyanarayana · **Priority:** Medium
**Link:** [PM-164](https://qdrant.atlassian.net/browse/PM-164) · **Reporter:** Bastian Hofmann · **Domain:** Clusters · **Created/Updated:** 2025-06-20 / 2026-06-25
**Subtasks:** none
**Linked issues:** [[PM-435-access-to-better-metrics-dashboard|PM-435]] (requests action, Done/Accepted, "Access to better metrics dashboard similar to internal Grafana")
**Related:** none beyond the linked Product Request.

---

## Audit summary

| Axis                          | Verdict | Short note                                                                                                                                           |
| ----------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Goal / scope               | Gap     | **A long, unprioritized wish-list of ~25 new metrics/graphs plus a "design refresh," with no boundary on what's actually in scope for this quarter** |
| 2. UI / Design                | Risk    | **No Figma anywhere; "Goal UX design and requirements" comment confirms design hasn't started**                                                      |
| 3. Size (S)                   | Risk    | **S badly understates an open-ended metrics wish-list plus a visual redesign**                                                                       |
| 4. Prioritization (Score 288) | Risk    | Impact=Measurable is defensible, but the Score is stable only if scope is cut down first; as written it's pricing one story, not ~10                 |

## Project & technical notes

**Project(s):** `qdrant-cloud-ui` (sole repo; Cluster Metrics tab and its chart components).
**How it'd be done (high level):** extend the existing `Clusters/Metrics` module (already a mature set of chart components) with new graphs from the wish-list, and separately refresh the node picker and visual polish, but only once the wish-list is prioritized into a bounded first slice.
**Technical notes:** several requested metrics (collection config parameters, computed `max_indexing_threads`, shard transfer status) may need new backend/API support beyond the UI; that's unverified and could hide backend scope under a UI-only Score.
**Identification confidence:** High for the UI repo/module; Low for whether all wish-list metrics are already exposed by an existing API (not checked beyond the UI layer).

## 1. Goal & scope clarity

The description names three real, narrow issues (node picker not intuitive, graphs lack detail, graphs could look better) that alone would be a clean, boundable ticket. But the comments then stack an open-ended wish-list from two different stakeholders (Konstantin/Kirstin, then a separate list "from the recent interaction with Canva"): cluster-wide CPU/mem/disk utilization, RPS/latency for read and write, disk IOPS, network throughput, open connections, response codes by method, shard transfers, per-node breakdowns, node status/termination-reason timelines, per-collection memory/storage, and roughly a dozen named collection-config parameters (HNSW params, optimizer config, `on_disk`/`in_memory` flags, `strict_mode_config`, etc.). That is **easily 5 to 10 distinct stories** bundled into one Objective with no stated priority order or cut line. A reply even asks "Aren't these accessible already through the Collection page?", unanswered, meaning duplicate scope may already exist elsewhere in the product. No formal Acceptance Criteria field is populated at all (null) and no Notion link either; the wish-list in comments is the only spec, and it isn't prioritized.

## 2. UI / Design needs

**Design reuse (code `qdrant-cloud-ui`):** PARTIAL, deduced from `src/components/Clusters/Metrics/` (`ClusterMetrics.tsx`, `ClusterNodeMetrics.tsx`, `NodeMetricsWithTimeSlices.tsx`, `RequestMetrics.tsx`, `StackedLinearMetric.tsx`, `GpuMetricsChart.tsx`, and others): a substantial, mature chart-component library already exists. New graphs of the same chart types (utilization %, RPS/latency) look **Extrapolable** from these; but the node picker "not intuitive" fix and any new interaction pattern (e.g., grouped per-collection config display) are a **New design** question until scoped, since no Figma or spec says what the fixed picker should look like.

**Design / Figma:** No. Hunted all five places: design fields (Concept Design, UX Designs, Technical Documentation) all null; no attachments; no `figma.com`/`notion.so` in description or 6 comments; the one issue link (PM-435, checked below) has no design fields populated either; 0 remote links. A comment explicitly states "Goal UX design and requirements" (2026-03-25) as a still-open goal, confirming design work hasn't started three months later.

**Requires UI? Yes.** Node picker redesign, new/changed metric graphs, visual refresh of the whole metrics tab.

Missing design-asset checklist:

- [ ] Prioritized subset of the wish-list (which metrics ship this quarter)
- [ ] Node picker redesign (no analogous "intuitive" pattern cited yet)
- [ ] Figma or spec for the new graphs' layout, especially if per-node breakdowns are added on top of cluster-wide ones

## 3. Size coherence (T-Shirt Size)

Size **S** (factor 8).

> [!warning] Estimate alert (under/over-estimation risk)
> S implies a single, contained UI story. The actual comment thread describes what reads like a multi-quarter metrics overhaul: ~25 requested signals across compute, network, storage, and collection-config domains, some of which may not even be exposed by the backend yet. Realistic estimate, **as currently scoped, is an épic that needs splitting**, not a single T-shirt size at all; review before committing.

Given the scope is undefined, a single re-estimated Score isn't meaningful yet; the real fix is scope, not size. If forced to size just the three original description items (node picker, more graph detail, visual polish) alone, S/M would be defensible; the wish-list additions are what break the estimate.

## 4. Prioritization (Impact / Confidence / Score)

| Variable | Value | Numeric |
|----------|-------|---------|
| Impact (calc) | Measurable | 6 |
| Confidence (calc) | Medium | 6 |
| Size factor (S) | n/a | 8 |
| **Score (RICE)** | n/a | **288** |

Model check: 6 × 6 × 8 = **288 ✓**

Assessment: Impact/Confidence are plausible for a UX-polish ticket, but **the Score prices only the described three-issue scope, not the wish-list the comments actually accumulated**: the ticket's true size is unknown until it's split, so this Score can't be trusted for ranking against single-story tickets in this batch.

## Code reuse (`qdrant-cloud-ui`)

**Verdict: PARTIAL. The metrics chart library is mature and directly reusable; the node picker and any new metric types are net-new work.**

**Already exists (reusable):**

- `src/components/Clusters/Metrics/ClusterMetrics.tsx`, `ClusterNodeMetrics.tsx`, `NodeMetricsWithTimeSlices.tsx`, `RequestMetrics.tsx`, `RequestsMetricsChart.tsx`, `StackedLinearMetric.tsx`, `GpuMetricsChart.tsx`, `GpuRamMetricsChart.tsx`, `MultiAZGroupedTable.tsx`: an established chart-component set covering most of the requested utilization/RPS/latency graph types.
- `src/components/Clusters/Metrics/useMetricsTimeRange.ts` and `utils.ts`: shared time-range and formatting logic new graphs can reuse directly.

**New / to build:**

- A redesigned node picker (no existing "intuitive" pattern identified).
- Any collection-config-parameter display not already surfaced on the Collection page (per the open, unanswered comment question); needs product decision before engineering.
- Backend/API support for metrics not yet exposed (shard transfer status, node termination reason); unverified, out of this repo's scope to confirm.

**Suggested approach:** once the wish-list is prioritized, extend the existing `Metrics/` chart components for anything backed by data the API already returns; treat the node picker and any genuinely new metric types as separate, explicitly designed sub-tickets.

## Linked-ticket context

| Key | Relationship | Title | Figma | Notion | Slack | GitHub | Notes |
|-----|-------------|-------|-------|--------|-------|--------|-------|
| [[PM-435-access-to-better-metrics-dashboard\|PM-435]] | is a request from (Product Request) | "Access to better metrics dashboard similar to internal Grafana" | None | None | None | None | Done/Accepted; a customer (TryandAI) asked for Grafana-like metrics, origin signal for this Objective, but adds no new spec or design |

## Notion context

No Notion links found, notion: none.

## Definition of Ready (DoR)

> [!danger] Verdict: 🔴 NOT READY, the wish-list must be split and prioritized before this can be estimated or designed

| DoR criterion                             | Status                                                                                                    |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Objective / description clear             | ⚠️ the original 3-issue description is clear; the comment wish-list is not bounded                        |
| Acceptance criteria defined               | ❌ no AC field, no Notion link; only an unprioritized comment list                                         |
| Well scoped (realistic size, not an épic) | ❌ reads as an épic bundling ~10 distinct metric/UX stories                                                |
| Scoring complete (Impact·Confidence·Size) | ✅ (but Score untrustworthy until split, see axis 3)                                                       |
| Design / UI available                     | ❌ no Figma; "Goal UX design and requirements" still open as of last comment                               |
| Extrapolable from existing code/contract  | 🔎 deduced for chart-reuse portion only                                                                   |
| Context sufficient                        | ⚠️ origin (PM-435) and stakeholder wish-lists captured, but no decision on what's in vs. out this quarter |

**Deductions to verify:**
- New utilization/RPS/latency-style graphs are extrapolable from the existing `Clusters/Metrics/` chart components; basis: analogous chart components already cover most requested signal types; confidence: Medium (doesn't cover the node picker or collection-config display); confirm by: a PM/design pass that names the first-slice metrics and checks each against an existing chart type.

**To be ready it needs:** Not well scoped (épic / split) is the primary blocker; a PM decision is owed on which subset of the wish-list ships this quarter. Missing UI / design is secondary and follows once scope narrows: only then can Figma/pattern-reuse be assessed per sub-story.

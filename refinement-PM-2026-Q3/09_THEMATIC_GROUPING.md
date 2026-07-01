---
title: "Thematic grouping — Cloud Unit Regions & Clusters (2026-Q3)"
doc: thematic-grouping
team: "Cloud Unit Regions & Clusters"
board: 267
project: PM
scope: "Sprint = 2026-Q3"
generated: 2026-07-01
readonly: true
tags: [backlog-audit, synthesis, PM]
---

# Thematic grouping — Cloud Unit Regions & Clusters (2026-Q3)

> [!tldr] 17/17 tickets cluster into 7 themes. **Backups** (4 tickets, combined score 1404) is the strongest candidate to attack as one conceptual objective now — half its members are already 🟡 almost-ready and the overlap between them is already documented. **Hybrid Cloud cluster lifecycle** (5 tickets, combined score 1530) is the biggest theme but also the least ready — 4/5 members are 🔴 not-ready, each blocked on a different open decision or external dependency.

> [!info] Nothing was modified in Jira. Generated 2026-07-01.

**Method note:** there is no native Jira `Theme`/`Initiative` field on these tickets — `domain` is set to "Clusters" on 13/17 of them, too coarse to discriminate. This grouping is a synthesis judgment call, made from each card's title, description, and TL;DR — not a verified Jira fact. Treat it as one reasonable partition, not the only correct one; see [[05_METHODOLOGY_AND_SCORING|05 · Methodology & scoring]] for what *is* field-verified.

## Theme summary

| Theme                                      | # tickets | Combined score | DoR mix (🟢/🟡/🔴) | Rationale                                                                                                                                     |
| ------------------------------------------ | --------- | -------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backups & data protection**              | 4         | 1404           | 0 / 2 / 2          | All four touch the same backup surface (UX, cross-region, size, failure reason) and two already cite each other's scope.                      |
| **Hybrid Cloud cluster lifecycle & infra** | 5         | 1530           | 0 / 1 / 4          | All five are lifecycle/infra operations specific to Hybrid Cloud clusters (deletion, storage class, support bundle, AZ topology, test infra). |
| **Cluster management UI/UX**               | 3         | 468            | 0 / 0 / 3          | General cluster-console UI work not specific to backups or Hybrid Cloud — metrics UI, modal dialogs, and the parent "cluster UI" catch-all.   |
| **Capacity & resource elasticity**         | 2         | 1188           | 0 / 1 / 1          | Both resize cluster resources dynamically without customer-visible downtime (CPU/memory buffers, disk downscaling).                           |
| **Networking / traffic infra**             | 1         | 648            | 0 / 1 / 0          | Single ticket — the Envoy/route-manager load-balancing migration.                                                                             |
| **Alerting & observability**               | 1         | 432            | 0 / 0 / 1          | Single ticket — multi-channel alert notifications.                                                                                            |
| **Core cluster-api refactor**              | 1         | 162            | 0 / 1 / 0          | Single ticket — internal config-logic rewrite, foundation work rather than a customer-facing feature.                                         |
| **Total**                                  | **17**    | **5832**       | **0 / 6 / 11**     | Matches [[02_MASTER_TABLE\|02 · Master table]] and [[00_README_index\|00 · Index]] totals.                                                    |

## Backups & data protection

- [[PM-165-improve-backup-ux|PM-165]] (Score 360, 🔴 not-ready) — "A live Figma exists, but scope overlaps two other in-flight tickets and hinges on a still-open scheduler-frequency decision."
- [[PM-230-cross-region-backups|PM-230]] (Score 324, 🔴 not-ready) — "Well-specified requirements, but M badly understates cross-region snapshot replication + billing + restore-flow work across 3+ repos."
- [[PM-509-show-backup-size-in-ui|PM-509]] (Score 432, 🟡 almost-ready) — "clear, well-scoped... overlaps with [[PM-165-improve-backup-ux|PM-165]]'s own 'backup size column' line item."
- [[PM-529-backup-failure-reason-hybrid-cloud|PM-529]] (Score 288, 🟡 almost-ready) — "Notion doc read — confirms AC directly... remaining gaps are the secondhand Figma credit from PM-59 and one code-level confirmation."

**Why grouped:** all four modify the same backup screens/data model (schedule, size, cross-region replication, failure reason), and the cards themselves already cross-reference each other (PM-509 ↔ PM-165) rather than being independently discovered as similar. [[00_README_index|00 · Index]]'s "Top 3 immediate actions" already calls for de-duplicating this exact cluster — this theme *is* that cluster, made explicit.

**Note:** PM-529 also touches Hybrid Cloud (its title says "in Hybrid Cloud"), but its subject is a backup-failure UI message, not cluster lifecycle — kept in Backups since that's the primary deliverable.

## Hybrid Cloud cluster lifecycle & infra

- [[PM-313-force-deletion-hybrid-cloud-clusters|PM-313]] (Score 810, 🟡 almost-ready) — "backend logic already exists and is verified in code; single blocker is an unresolved internal disagreement on whether the UI needs a customer-facing button at all."
- [[PM-327-volumeattributesclass-hybrid-cloud|PM-327]] (Score 0, 🔴 not-ready) — "best-documented ticket in this batch but Impact/Confidence are both unset, and it hard-depends on an open external PR that hasn't merged."
- [[PM-345-hybrid-cloud-support-bundle|PM-345]] (Score 648, 🔴 not-ready) — "no AC, no design, and the PM's own review comment lists four open decisions still unresolved."
- [[PM-430-multi-az-hybrid-cloud|PM-430]] (Score 72, 🔴 not-ready) — "explicitly flagged Low confidence — the team's own comments say a spike is needed before this can even be scoped."
- [[PM-524-hybrid-cloud-integration-tests-real-k8s|PM-524]] (Score 0, 🔴 not-ready) — "Scoring incomplete and blocked on an unscoped dependency (CRS-1923, still in Backlog)."

**Why grouped:** every ticket is a Hybrid Cloud-specific cluster operation (deletion, storage class config, diagnostics bundle, AZ topology, test coverage) rather than a feature shared with the SaaS/managed-cloud fleet — distinct from the other themes, none of which are Hybrid Cloud-specific. This is the biggest theme by ticket count but also the least ready: 4/5 are 🔴, each blocked on a *different* open decision (internal disagreement, unmerged PR, unresolved decisions, needed spike, unscoped dependency) — there's no single unblocking action for the theme as a whole.

## Cluster management UI/UX

- [[PM-164-improve-cluster-metrics-ui|PM-164]] (Score 288, 🔴 not-ready) — "Huge, unscoped wish-list of ~25 new metrics with no design and no prioritization: this is several stories, not one."
- [[PM-284-unify-ui-modal-dialogs|PM-284]] (Score 180, 🔴 not-ready) — "one-liner description, no defined 'unified' target, and status/comment directly contradicts the open review comment asking whether scope is even understood."
- [[PM-505-cluster-ui-improvements|PM-505]] (Score 0, 🔴 not-ready) — "Close, don't refine: every decided piece of PM-505's scope has already shipped."

**Why grouped:** all three are general cluster-console UI work, not tied to a specific backend feature (backups, Hybrid Cloud, capacity) — they're about how the console looks/behaves rather than what a cluster does. All three are 🔴 not-ready for unrelated reasons (unscoped wish-list, undefined target, already-shipped scope) — this theme's readiness problem is definitional, not sequencing.

## Capacity & resource elasticity

- [[PM-102-dynamic-cpu-memory-reservation-buffers|PM-102]] (Score 540, 🟡 almost-ready) — "remaining blocker is the sizing algorithm itself: no formula yet, no resilience-team input."
- [[PM-486-allow-disk-downscaling|PM-486]] (Score 648, 🔴 not-ready) — "the ticket's own comment thread says this needs a costly node-recreation + shard-transfer mechanism, not a UI tweak."

**Why grouped:** both resize a cluster's allocated resources (CPU/memory headroom, disk) live, without a restart/downtime — the same class of problem (safe, no-restart resource elasticity) even though one is compute and the other is storage.

## Networking / traffic infra

- [[PM-453-load-balancing-envoy-step2|PM-453]] (Score 648, 🟡 almost-ready) — "already In Progress with its design/PoC dependencies Done — the one gap is a rollout/migration plan for the live Traefik→Envoy cutover."

**Why its own theme:** no other ticket in this batch touches the request-routing/load-balancing layer. Single-ticket theme — already the most execution-ready item in the batch.

## Alerting & observability

- [[PM-187-multi-channel-alert-notifications|PM-187]] (Score 432, 🔴 not-ready) — "email config is a small extension, but the webhook half is genuinely undefined new scope and still Idea Intake."

**Why its own theme:** no other ticket in this batch is about notification/alerting delivery. Single-ticket theme.

## Core cluster-api refactor

- [[PM-280-rewrite-cluster-api-config-logic|PM-280]] (Score 162, 🟡 almost-ready) — "the Jira ticket's 'v2 API' ask is literally the last/'Bonus' step of a much larger 4-phase plan to extract the entire cluster module into a separate Go service."

**Why its own theme:** it's internal foundation/tech-debt work (config-logic rewrite), not a customer-facing feature like the other six themes — grouping it with any of them would blur the "conceptual objective" framing this doc is meant to give.

## Coverage check

17/17 tickets placed in exactly one theme. No ticket dropped, none double-counted — verified by summing the theme table's ticket counts (4+5+3+2+1+1+1 = 17) and combined scores (1404+1530+468+1188+648+432+162 = 5832), both matching [[02_MASTER_TABLE|02 · Master table]]'s totals.

## Cross-theme dependencies

None found **between** two of these themes. The overlaps the cards do surface are either **within** the Backups theme (PM-165 ↔ PM-509, already noted above) or point **outside** this batch entirely:

- [[PM-529-backup-failure-reason-hybrid-cloud|PM-529]] credits its Figma to PM-59 — a ticket not in this quarter's scope.
- [[PM-524-hybrid-cloud-integration-tests-real-k8s|PM-524]] is blocked on CRS-1923 — a different Jira project, not in this batch.
- [[PM-505-cluster-ui-improvements|PM-505]]'s decided scope already shipped via PM-267 and PM-355 (also outside this batch).

None of these are sequencing links between two of the seven themes above — no theme needs to wait on another theme in this batch to start.

## Recommendation

- **Attack Backups first as one conceptual objective.** It has the best readiness mix (2 of 4 already 🟡) and the de-duplication work is already scoped by this audit — assign one owner, resolve the PM-165/PM-230/PM-509 overlap once, and the theme moves as a unit instead of three separate re-litigations of the same backup screen.
- **Treat Hybrid Cloud cluster lifecycle as a discovery-first theme**, not a Q3 delivery theme — 4/5 tickets need a decision or a spike before any of them can be sized, and each blocker is different, so there's no single unblocking conversation.
- **Capacity & resource elasticity** is a natural pairing for a single design/RFC pass (one sizing algorithm + one resize-mechanism review) even though the tickets currently read as unrelated (compute vs. disk).
- **If this kind of grouping proves useful beyond this one-off audit**, consider asking the team to adopt a persistent Jira field (`Theme`/`Initiative`) so future audits don't have to re-derive it from titles — this doc is a recommendation to consider that, not a change made to Jira.

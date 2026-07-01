---
title: "Tickets by project — Cloud Unit Regions & Clusters (2026-Q3)"
doc: tickets-by-project
team: "Cloud Unit Regions & Clusters"
board: 267
project: PM
scope: "Sprint = 2026-Q3"
generated: 2026-07-01
readonly: true
tags: [backlog-audit, synthesis, PM]
---

# Tickets by project — Cloud Unit Regions & Clusters (2026-Q3)

> [!tldr] `qdrant-cloud-cluster-api` leads 7/17 tickets, `qdrant-cloud-ui` leads 5/17 — together they're the leader on 12/17. The other 5 spread across `operator`/`kubernetes-api`, `qdrant-cloud-agent`, `qdrant-cloud-route-manager`, and `qdrant-cloud` (test infra). Every ticket's leader repo is confidently identified; several secondary-repo associations are repo-map inferences, not ticket-specific code reads — flagged per card. Unchanged by this pass — the Notion re-audit on PM-102/PM-280/PM-529 added requirements/scope context, not new repo signals.

**Repos base path:** identified per-ticket from each audit card's "Project & technical notes" section, cross-checked against `codegraph`/`rg` reads reported in the cards. **Date:** 2026-07-01. **Read-only** — no code was changed during identification, and none was re-read for this resynthesis.

> [!info] This matrix is a synthesis of what each card already stated; it re-derives no new repo associations beyond what's on the cards.

## Repo characterization

| Repo | Language | Scope |
|---|---|---|
| `qdrant-cloud-cluster-api` | Python | Core backend service: cluster CRUD, backup/schedule data model, billing/metering, notifications, booking/resize logic. |
| `qdrant-cloud-ui` | React/TypeScript | Cloud console front end — Clusters, Backups, Metrics, dialogs. |
| `operator` | Go | Kubernetes operator — reconciles cluster CRs into pods/PVCs/StatefulSets. |
| `kubernetes-api` | Go | CRD type definitions and validation (`QdrantCluster`, `Region`, etc.). |
| `qdrant-cloud-agent` | Go | In-cluster agent for Hybrid Cloud — job triggering, environment status reporting. |
| `qdrant-cloud-public-api` | Protobuf | Public API contract (gRPC/proto) surfaced to customers and internal services. |
| `qdrant-cloud-route-manager` | Go | xDS-driven route manager service driving Envoy. |
| `qdrant-cloud-envoy` | — (Helm chart) | Envoy deployment chart + health/drain sidecar. |
| `qdrant-cloud` | — (CI/Terraform) | Acceptance-test CI workflows, multi-region Terraform setups. |
| `qdrant-cloud-platform-api` | — | Platform-level cluster provisioning (used for test-infra provisioning per PM-524). |
| `qdrant-cloud-admin-v2` | — | Admin-side UI/tooling, referenced as a secondary surface for PM-345. |

## Who leads each ticket

| Leader repo | Count | Tickets |
|---|---|---|
| `qdrant-cloud-cluster-api` | 7 | PM-102, PM-187, PM-230, PM-280, PM-313, PM-486, PM-529 |
| `qdrant-cloud-ui` | 5 | PM-164, PM-165, PM-284, PM-505, PM-509 |
| `operator` (jointly with `kubernetes-api`) | 1 | PM-327 |
| `qdrant-cloud-agent` | 1 | PM-345 |
| `operator` | 1 | PM-430 |
| `qdrant-cloud-route-manager` | 1 | PM-453 |
| `qdrant-cloud` | 1 | PM-524 |

`qdrant-cloud-cluster-api` and `qdrant-cloud-ui` together lead 12/17 (71%) of the quarter's scope — consistent with this being a Clusters-domain backlog. PM-280 stays led by `qdrant-cloud-cluster-api` despite the phase-scoping question this pass surfaced (see [[03_CROSS_CUTTING_FINDINGS|03, H1a]]) — its Notion plan's later phases move the module to a new Go service, which would eventually change this row, but that hasn't been decided as in-scope for 2026-Q3 yet.

## Involvement matrix

★ leader · ● involved · ○ minor/possible

| Issue | cluster-api | ui | operator | k8s-api | agent | public-api | route-mgr | envoy | qdrant-cloud | platform-api | admin-v2 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| [[PM-102-dynamic-cpu-memory-reservation-buffers\|PM-102]] | ★ | | ● | | | | | | | | |
| [[PM-164-improve-cluster-metrics-ui\|PM-164]] | | ★ | | | | | | | | | |
| [[PM-165-improve-backup-ux\|PM-165]] | ● | ★ | | | | | | | | | |
| [[PM-187-multi-channel-alert-notifications\|PM-187]] | ★ | ● | | | | | | | | | |
| [[PM-230-cross-region-backups\|PM-230]] | ★ | ● | ● | | | | | | ○ | | |
| [[PM-280-rewrite-cluster-api-config-logic\|PM-280]] | ★ | | | | | | | | | | |
| [[PM-284-unify-ui-modal-dialogs\|PM-284]] | | ★ | | | | | | | | | |
| [[PM-313-force-deletion-hybrid-cloud-clusters\|PM-313]] | ★ | ● | | | | ● | | | | | |
| [[PM-327-volumeattributesclass-hybrid-cloud\|PM-327]] | ● | ● | ★ | ★ | ● | ● | | | | | |
| [[PM-345-hybrid-cloud-support-bundle\|PM-345]] | ● | ● | | | ★ | | | | | | ● |
| [[PM-430-multi-az-hybrid-cloud\|PM-430]] | ● | ○ | ★ | | | | | | | | |
| [[PM-453-load-balancing-envoy-step2\|PM-453]] | ● | | | | | | ★ | ● | | | |
| [[PM-486-allow-disk-downscaling\|PM-486]] | ★ | ● | ● | | | | | | | | |
| [[PM-505-cluster-ui-improvements\|PM-505]] | | ★ | | | | | | | | | |
| [[PM-509-show-backup-size-in-ui\|PM-509]] | ● | ★ | | | | ● | | | | | |
| [[PM-524-hybrid-cloud-integration-tests-real-k8s\|PM-524]] | | | | | | | | | ★ | ● | |
| [[PM-529-backup-failure-reason-hybrid-cloud\|PM-529]] | ★ | ● | | | | | | | | | |

## Per-repo ticket counts (including secondary involvement)

| Repo | Leads | Involved-in-total (leader + secondary) |
|---|---|---|
| `qdrant-cloud-cluster-api` | 7 | 13 |
| `qdrant-cloud-ui` | 5 | 12 |
| `operator` | 2 | 5 |
| `qdrant-cloud-public-api` | 0 | 2 |
| `kubernetes-api` | 1 | 1 |
| `qdrant-cloud-agent` | 1 | 2 |
| `qdrant-cloud-route-manager` | 1 | 1 |
| `qdrant-cloud-envoy` | 0 | 1 |
| `qdrant-cloud` | 1 | 2 |
| `qdrant-cloud-platform-api` | 0 | 1 |
| `qdrant-cloud-admin-v2` | 0 | 1 |

## Tickets with scope NOT confidently identifiable

None. All 17 tickets have a confidently identified leader repo, per each card's own stated "identification confidence" (High on 12/17, Medium on 5/17 — see each card's "Project & technical notes" section for the exact confidence level and reasoning). The Medium-confidence cases are secondary-repo associations, not leader-repo doubt:

- [[PM-230-cross-region-backups\|PM-230]]: `qdrant-cloud` (Terraform) involvement is a repo-map association, not verified against this ticket's specific requirements.
- [[PM-345-hybrid-cloud-support-bundle\|PM-345]]: repos are right, but *how* the agent job-trigger mechanism would work doesn't exist yet in any repo checked.
- [[PM-430-multi-az-hybrid-cloud\|PM-430]]: repo (`operator`) is right; the actual mechanism (topology translation) is an open spike.
- [[PM-505-cluster-ui-improvements\|PM-505]]: repo (`qdrant-cloud-ui`) was never in doubt — what's unclear is what to build, not where (see [[03_CROSS_CUTTING_FINDINGS\|03, H4a]]).
- [[PM-524-hybrid-cloud-integration-tests-real-k8s\|PM-524]]: the "leader" repo (`qdrant-cloud`, where the current k3d suite runs) is inferred, not confirmed in the ticket text.
- **[[PM-280-rewrite-cluster-api-config-logic\|PM-280]]** remains High confidence for the repo itself (`qdrant-cloud-cluster-api` is the confirmed sole owner of the current code); the newly-read Notion plan adds a *different* kind of uncertainty — not which repo, but which of the plan's phases is this quarter's work, and whether a later phase (Phase 3) eventually moves ownership to a new Go service. Not re-classified as Medium here, since the repo itself was never in doubt.

## Caveats

- **`operator`/`kubernetes-api` naming**: both are Go repos with closely related scope (CRD types vs. reconciliation logic); PM-327 treats them as joint leaders because the ticket's own code citations split evenly across both.
- **Internal vs. customer-facing distinction**: `qdrant-cloud-admin-v2` (PM-345's secondary) is an internal admin tool, not the customer-facing cloud UI — don't conflate its involvement with `qdrant-cloud-ui`'s.
- **Confirm per team**: repo ownership boundaries (e.g., who owns `qdrant-cloud-agent` vs. `qdrant-cloud-platform-api` for Hybrid Cloud test provisioning) were inferred from code location, not confirmed with the owning teams — treat the "leader" column as a strong hypothesis, not an assignment.
- **PM-280's future repo boundary is an open question, not a caveat about this pass's accuracy**: if the Notion plan's Phase 3 (extracting cluster into a separate Go service) is eventually confirmed as in-scope for some future quarter, this matrix's `qdrant-cloud-cluster-api` leadership for PM-280 would need revisiting then — flagged for awareness, not acted on here.

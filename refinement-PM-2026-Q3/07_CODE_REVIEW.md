---
title: "Code review — Cloud Unit Regions & Clusters (2026-Q3)"
doc: code-review
team: "Cloud Unit Regions & Clusters"
board: 267
project: PM
scope: "Sprint = 2026-Q3"
generated: 2026-07-01
readonly: true
tags: [backlog-audit, synthesis, PM]
---

# Code review — Cloud Unit Regions & Clusters (2026-Q3)

> [!tldr] 2/13 UI tickets can ship with FULL existing-component reuse, 8/13 are PARTIAL (some pieces exist, some don't), 1/13 has NONE (a genuinely new UI concept), and 2/13 can't be classified until their scope is decided. Repos: `qdrant-cloud-ui` (React/TS) for the front end, `qdrant-cloud-cluster-api` (Python) for the backing services. Unchanged by this pass — no code was re-read; the Notion re-audit on PM-102/PM-280/PM-529 didn't touch any code-reuse citation.

**Repos:** `qdrant-cloud-ui` (React/TypeScript — all UI-facing work), `qdrant-cloud-cluster-api` (Python — backend service most UI tickets depend on), plus feature-specific repos noted per ticket below. **Read-only** — all findings are code reads (`rg`, direct file reads, codegraph queries) against the repos on disk, carried over unchanged from the original per-ticket audit; no code was changed or re-read for this resynthesis.

**Objective:** for each of the 13 UI-relevant tickets, determine whether it can extend existing code/design or needs a genuinely new design.

**Result:** 2 FULL reuse, 8 PARTIAL, 1 NONE, 2 undetermined pending scope — a 2/8/1/2 split.

## Classification table

| Level | Tickets |
|---|---|
| **FULL** (existing component/pattern covers it) | [[PM-509-show-backup-size-in-ui\|PM-509]], [[PM-529-backup-failure-reason-hybrid-cloud\|PM-529]] |
| **PARTIAL** (some pieces exist, some don't) | [[PM-164-improve-cluster-metrics-ui\|PM-164]], [[PM-165-improve-backup-ux\|PM-165]], [[PM-187-multi-channel-alert-notifications\|PM-187]], [[PM-230-cross-region-backups\|PM-230]], [[PM-284-unify-ui-modal-dialogs\|PM-284]], [[PM-313-force-deletion-hybrid-cloud-clusters\|PM-313]], [[PM-327-volumeattributesclass-hybrid-cloud\|PM-327]], [[PM-345-hybrid-cloud-support-bundle\|PM-345]] |
| **NONE** (needs new design/code, nothing to extend) | [[PM-486-allow-disk-downscaling\|PM-486]] |
| **Undetermined** (scope not stable enough to classify) | [[PM-430-multi-az-hybrid-cloud\|PM-430]], [[PM-505-cluster-ui-improvements\|PM-505]] |

Note: [[PM-280-rewrite-cluster-api-config-logic|PM-280]] and [[PM-102-dynamic-cpu-memory-reservation-buffers|PM-102]] are backend-only (`requires_ui: false`) and sit outside this UI-focused table; their backend code-reuse verdicts (both PARTIAL) are on their own cards and in [[08_TICKETS_BY_PROJECT|08]], unaffected by this pass's Notion re-read — PM-280's newly-read plan changes what scope its rewrite should target (see [[03_CROSS_CUTTING_FINDINGS|03, H1a]]), not whether the legacy `cluster_api/cluster/` module is a reasonable migration source.

## Per-issue detail

### FULL reuse

**[[PM-509-show-backup-size-in-ui|PM-509]]** — `qdrant-cloud-ui/src/components/Clusters/Backups/BackupsTable.tsx` (lines 271–353) already has a `Duration` column in the `allColumns` array; a `Backup Size` column is a direct structural copy. Backend data already exists: `cluster_api/booking/models_db.py:754` (`SnapshotLog.bytes`) plus a computed `size_gib` property, already used for Orb metering (`cluster_api/billing/metering/adapters/backup_storage.py`). **Confident citation**, not a deduction — the column pattern and the backend field were both read directly. The only real gap is a proto field on `Backup` in `qdrant-cloud-public-api/proto/.../backup.proto` (confirmed absent), a small additive contract change.

**[[PM-529-backup-failure-reason-hybrid-cloud|PM-529]]** — `BackupsTable.tsx` already imports MUI `Tooltip` for a different affordance in the same table, and computes per-row status color via `getStatusColor`. Adding a tooltip with the failure `message` on the FAILED chip is a direct extension. Backend: `cluster_api/cluster/backup/schemas.py::PydanticBackupStatusIn.message` is already captured from the status webhook but dropped before reaching the outward `PydanticBackup` schema or the DB model. **Confident citation** for the pattern; the one doubtful piece is the linked-ticket Figma credit (see [[06_DESIGN_FIGMA_REVIEW|06]]), which doesn't affect this code-reuse call since no new UI component is needed either way. The Notion doc read this pass confirms the AC side of this ticket but doesn't change the code-reuse picture — it's a requirements document, not a design or implementation spec.

### PARTIAL reuse

**[[PM-165-improve-backup-ux|PM-165]]** — `ClusterBackupsTab.tsx`, `BackupSchedulesForm/BackupScheduleFormDialog.tsx`, `BackupCostInfo.tsx` are the exact components the ticket calls "too busy"; extend rather than rebuild. **Confident citation.** Unconfirmed: whether the "backup name no longer used as ID in gRPC API" contract change described in the ticket has actually landed in `qdrant-cloud-cluster-api` — not verified this session, worth a direct check before estimating the naming-feature sub-scope.

**[[PM-509-show-backup-size-in-ui|PM-509]]** overlap note: see [[03_CROSS_CUTTING_FINDINGS|03, H6]] — PM-165 lists the same backup-size column PM-509 owns; resolve which ticket ships it before either is coded.

**[[PM-187-multi-channel-alert-notifications|PM-187]]** — `cluster_api/notification/clients/base.py` (`EmailRequest`) and `cluster_api/notification/schemas/recipient.py` (`RecipientType`, `AccountsRecipient`, etc.) are a working, typed email-delivery model — confirmed via codegraph, **confident citation**. Email-recipient config is Extrapolable from this. Webhook delivery is a **genuinely new** contract: no `webhook` variant exists anywhere in `cluster_api/notification/`, confirmed by direct search — this half needs an ADR, not a design pass.

**[[PM-230-cross-region-backups|PM-230]]** — `ClusterCreateProviderRegionSelectorsCompact`/`useProviderRegionsGeography` (`qdrant-cloud-ui/src/components/Clusters/ClusterSetup/`) is a working cloud-provider-aware region selector, confirmed via codegraph — **confident citation** for the selector control only. `cluster_api/cluster/backup/models_db.py`'s `Backup`/`Schedule` models were read directly and confirmed to carry only a single `private_region_id` — no secondary-region column, no cross-region logic anywhere in `operator`. The selector is reusable; the orchestration, billing, and restore-flow enforcement are net-new across 3 repos.

**[[PM-313-force-deletion-hybrid-cloud-clusters|PM-313]]** — `cluster_api/cluster/service/__init__.py:1525` (`delete_cluster(..., force=True)`) and `cluster_api/cluster/backup/snapshot_service.py:290-352` (backup `force` delete) are **confirmed to already exist**, read line-by-line — this is the strongest backend-readiness citation in the batch. UI pattern (`src/components/HybridCloudEnvironments/DeletionDialog.tsx`, `Common/ButtonDangerAction.tsx`) is a close variant, **confident citation**, but contingent on the still-open button-vs-automatic-timeout product decision (see [[04_PLAN_RECOMMENDATION|04]]).

**[[PM-327-volumeattributesclass-hybrid-cloud|PM-327]]** — the strongest multi-repo citation set in the batch, all verified line-by-line: `operator/pkg/controller/qdrant_cluster_pvc.go:154-172`, `kubernetes-api/api/v1/qdrantcluster_types.go:861-863,931-935`, `kubernetes-api/api/v1/region_types.go:116-118`, `qdrant-cloud-cluster-api/cluster_api/cluster/models_db.py:611`. UI pattern: `ClusterSettingsDiskSpeedForm.tsx` (disk-speed/storage-tier selector), **confident citation** for the selection control; no pattern found for the "modification status" UI state the description also asks for. Hard-blocked on an external, unmerged PR (`qdrant-cloud-agent#646`, confirmed OPEN via `gh`).

**[[PM-164-improve-cluster-metrics-ui|PM-164]]** — `src/components/Clusters/Metrics/` (`ClusterMetrics.tsx`, `ClusterNodeMetrics.tsx`, `RequestMetrics.tsx`, `StackedLinearMetric.tsx`, `GpuMetricsChart.tsx`, and others) is a mature, established chart-component library — **confident citation** covering most of the requested utilization/RPS/latency graph types. The node-picker redesign and any new collection-config display have no analogous pattern found — genuinely doubtful, and gated on a PM decision about which subset of a ~25-metric wish-list ships this quarter (see [[03_CROSS_CUTTING_FINDINGS|03, H2]]).

**[[PM-284-unify-ui-modal-dialogs|PM-284]]** — `src/components/Dialog/BaseDialog.tsx` and `ModalDialog.tsx` already exist as the unification target; confirmed via `rg` that only 10/41 dialog files import `BaseDialog` and 14/41 import `ModalDialog` — the fragmentation the ticket describes is real and directly measurable. **Confident citation for the target primitive**; doubtful on scope, since no list of in-scope dialogs exists yet (the ticket's own review comment asks for this).

**[[PM-345-hybrid-cloud-support-bundle|PM-345]]** — `qdrant-cloud-support-tools/support-bundle/support-bundle.sh` (confirmed via `gh api`) is a working, documented script that already collects the exact data needed (CR statuses, pod logs, k8s version) — **confident citation** for the collection-logic portion, portable into an in-cluster job. The UI "actions dropdown + async status" pattern named in a comment could **not** be matched to any existing component in a targeted search — this is the weakest deduction in the whole design/code review (see [[06_DESIGN_FIGMA_REVIEW|06]]).

### NONE — needs new design and new code

**[[PM-486-allow-disk-downscaling|PM-486]]** — `qdrant-cloud-ui/src/components/Clusters/ClusterScale/ClusterScaleSettingsDiskSpace.tsx` explicitly hard-codes "disk space can only be increased" and gates any shrink path off entirely (`isDiskExpandable` check) — **confirmed absence**, not a search gap. No resize/shrink/volume terms found anywhere in `cluster-api` or `operator`. Both the backend mechanism (node recreation + shard transfer) and the UI (long-running-operation status) need to be designed from scratch.

### Undetermined pending scope

**[[PM-430-multi-az-hybrid-cloud|PM-430]]** — confirmed via `rg` that no multi-AZ/topology-aware scheduling code exists in `operator` or `cluster-api` today. Whether a customer-facing UI toggle is even needed is unresolved per the team's own comments — classifying design/code reuse now would be premature; do the spike first.

**[[PM-505-cluster-ui-improvements|PM-505]]** — `qdrant-cloud-ui/src/components/Clusters/ClusterOverview.tsx` (212 lines) is the natural landing spot *if* overview work survives in this ticket, but per the Opus escalation (unchanged by this pass), it likely doesn't — see [[03_CROSS_CUTTING_FINDINGS|03, H4a]]. Not scoping code further here.

## Recommendations

- Ship [[PM-509-show-backup-size-in-ui|PM-509]] and [[PM-529-backup-failure-reason-hybrid-cloud|PM-529]] first — both are confident-citation FULL reuse with small, well-understood gaps; PM-529's AC is now also confirmed via Notion.
- Confirm the three doubtful citations before planning around them: **PM-345**'s UI pattern (no match found), **PM-164**'s node-picker (no analogous pattern), **PM-284**'s scope (no dialog list yet).
- Treat **PM-486** as a design-and-architecture task, not a sprint-sizeable UI ticket, until the backend mechanism is spec'd.
- **New this pass:** before scoping any further code work on [[PM-280-rewrite-cluster-api-config-logic|PM-280]]'s rewrite, get PM/Eng to confirm which phase of its newly-read Notion plan is this quarter's target — the legacy `cluster_api/cluster/` module cited as the migration source is a reasonable starting point for early phases, but not for the plan's Phase 3 (separate Go service), which is a new architecture, not a code-reuse candidate at all.
- The owning team (`qdrant-cloud-ui` / `qdrant-cloud-cluster-api` maintainers) should confirm every cited path above before estimates are finalized — these are audit-time reads, not a guarantee the code hasn't moved since.

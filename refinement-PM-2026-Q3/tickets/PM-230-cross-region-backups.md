---
ticket: PM-230
aliases: ["PM-230"]
title: "Cross-region backups"
type: Objective
status: Backlog
bucket: 2026-Q3
objective_class: Standard
owner: unassigned
priority: Medium
domain: "—"
carryover: false
size: M
size_factor: 6
impact: 9
confidence: 6
score: 324
scoring_complete: true
requires_ui: true
design_linked: false
design_source: none
design_reuse: PARTIAL
code_reuse: NONE
repos: [qdrant-cloud-cluster-api, operator, qdrant-cloud-ui, qdrant-cloud]
notion: none
slack_context: none
github_context: none
subtasks: []
linked_issues: [PM-404, PM-165]
child_context: full
dor: not-ready
jira: https://qdrant.atlassian.net/browse/PM-230
tags: [backlog-audit, ticket, PM, readiness/not-ready]
---

# PM-230 · Cross-region backups

> [!tldr] 🔴 NOT READY · Score 324 (M) · Well-specified requirements, but M badly understates cross-region snapshot replication + billing + restore-flow work across 3+ repos with zero region-awareness in the code today

**Type:** Objective · **Sprint:** 2026-Q3 · **Status:** Backlog · **Objective Class:** Standard · **Owner:** unassigned · **Priority:** Medium
**Link:** [PM-230](https://qdrant.atlassian.net/browse/PM-230) · **Reporter:** Bastian Hofmann · **Domain:** — · **Created/Updated:** 2025-09-01 / 2026-06-25
**Subtasks:** none
**Linked issues:** [[PM-404-cross-region-backups-request|PM-404]] (is a request from — Accepted), [[PM-165-improve-backup-ux|PM-165]] (is blocked by — Requirement Definition)
**Related:** same Backup UI surface as [[PM-165-improve-backup-ux|PM-165]] and [[PM-509-show-backup-size-in-ui|PM-509]] (both in this quarter's scope).

---

## Audit summary

| Axis | Verdict | Short note |
|------|---------|------------|
| 1. Goal / scope | OK | Unusually well-specified: "Observation"/"Value provided" fields spell out billing, UI, and restore-scope rules in detail |
| 2. UI / Design | Risk | **No Figma; blocked on [[PM-165-improve-backup-ux\|PM-165]]'s in-flight redesign of the same screens, which isn't done yet** |
| 3. Size (M) | Risk | **M implies a contained feature; code shows zero region-awareness in the backup data model — this is new schema + cross-region snapshot orchestration + billing + restore-flow changes** |
| 4. Prioritization (Score 324) | OK | Impact=Significant and Confidence=Medium are both defensible given the explicit requirements, but the Score is only trustworthy once size is corrected |

## Project & technical notes

**Project(s):** `qdrant-cloud-cluster-api` (leader — backup/schedule data model and billing integration), `operator` (secondary — cross-region VolumeSnapshotClass orchestration), `qdrant-cloud-ui` (secondary — region selector in schedule/backup dialogs), `qdrant-cloud` (secondary — Terraform multi-region-setups, per the repo map).
**How it'd be done (high level):** add a secondary-region field to `Schedule`/`Backup`, orchestrate cross-region snapshot copy at the operator/cloud-provider level (AWS/GCP/Azure each expose this per the description's own links), add per-region billing line items, and add a region-scoped restore flow that explicitly disallows cross-region cluster restore (an explicit requirement).
**Technical notes:** verified via code read — `cluster_api/cluster/backup/models_db.py`'s `Backup` and `Schedule` models only carry a single `private_region_id` (the cluster's home region); there is no secondary-region column, no cross-region replication logic, and no `VolumeSnapshotClass` handling in the `operator` repo. This is genuinely new capability, not an extension — the ticket's own body already reflects this ("technically it is not possible to restore a cluster from backup of a different region" is stated as a current-state constraint, not a requirement to build around). [[PM-165-improve-backup-ux|PM-165]] is actively redesigning the exact same Backup/Schedule screens this quarter — sequencing risk if both land UI changes independently.
**Identification confidence:** High for `qdrant-cloud-cluster-api` and the absence of existing region logic (verified directly against `models_db.py`); Medium for `operator`/`qdrant-cloud` (repo-map association, not verified against ticket-specific requirements); Medium for UI (a reusable region-selector pattern exists but not confirmed as a fit for the backup-schedule form specifically).

## 1. Goal & scope clarity

Better specified than most tickets in this batch: beyond the one-paragraph description (cross-region backup copy, priced identically to same-region, restore only into the target region, one secondary region per schedule), the "Observation" and "Value provided" custom fields lay out concrete UI rules — a secondary-region dropdown scoped to the cloud provider, existing schedules default to opted-out, backup lists show a region column, and an explicit, shouted requirement: **"NO CROSS REGION BACKUP RESTORE FOR CLUSTERS!!!"**. No formal Acceptance Criteria field is populated and there's no Notion link, but the "Observation" field functions as a de facto AC list. The blocking relationship to [[PM-165-improve-backup-ux|PM-165]] is real and current — PM-165 is mid-redesign of the same backup/schedule screens right now (status "Requirement Definition"), so building the region selector before that redesign lands risks rework.

## 2. UI / Design needs

**Design reuse (code `qdrant-cloud-ui`):** PARTIAL — 🔎 deduced. Codegraph confirms an existing, reusable cloud-provider/region-selector pattern (`ClusterCreateProviderRegionSelectorsCompact`, `useProviderRegionsGeography` in `src/components/Clusters/ClusterSetup/`) used at cluster-creation time. The ticket's own requirement ("drop-down of available secondary regions according to cloud provider") maps closely onto this existing selector, so the *selector control itself* is Extrapolable. What is not extrapolable: how it's embedded into the existing `BackupScheduleForm`/`BackupScheduleTable` components, and the backup-list region column — no analogous "extra column keyed by region" pattern was found.

**Design / Figma:** No — hunted all five places: Concept Design, UX Designs, Technical Documentation fields all null; no attachments; no `figma.com`/`notion.so` in description or the "Observation"/"Value provided" fields; 0 remote links; neither linked ticket (PM-404: empty Product Request, no design; PM-165: has its **own** Figma for its own backup-UX redesign scope, not for cross-region specifically) carries a design asset for this feature.

**Requires UI? Yes** — secondary-region selector in schedule/backup creation dialogs, a region column in both backup list views, and restore-flow messaging that makes the region restriction explicit.

Missing design-asset checklist:

- [ ] Region-selector placement inside the (currently being redesigned) `BackupScheduleForm`
- [ ] Region column design for both backup list surfaces
- [ ] Restore-flow copy/UI enforcing "same region only" (currently just a requirement, no mockup)
- [ ] Sequencing decision with [[PM-165-improve-backup-ux|PM-165]] so region work isn't built against a UI about to be redesigned

## 3. Size coherence (T-Shirt Size)

Size **M** (factor 6).

> [!warning] Estimate alert (under/over-estimation risk)
> M suggests a single, contained feature. The actual scope, confirmed against the codebase, is: (1) new secondary-region field on `Schedule`/`Backup` plus migration, (2) cross-region snapshot orchestration at the operator/cloud-provider level — genuinely new infrastructure work, not present anywhere in `operator` today, (3) billing changes so a cross-region backup line-items correctly, (4) a region-scoped restore flow with an explicit safety constraint, and (5) UI changes competing for the same screens [[PM-165-improve-backup-ux|PM-165]] is mid-redesigning. Realistic estimate is **L**; review before committing.

Re-estimating L (factor 4) instead of M (factor 6) at the current 9×6 Impact×Confidence: 9 × 6 × 4 = 216 (vs. stored 324) — a 108-point drop that would move it below several other tickets in this batch (e.g. PM-187 at 432, PM-509 at 432).

## 4. Prioritization (Impact / Confidence / Score)

| Variable | Value | Numeric |
|----------|-------|---------|
| Impact (calc) | Significant | 9 |
| Confidence (calc) | Medium | 6 |
| Size factor (M) | — | 6 |
| **Score (RICE)** | — | **324** |

Model check: 9 × 6 × 6 = **324 ✓** (arithmetic reconciles against the stored field).

Assessment: Impact=Significant is reasonable — the "Value provided" field states this directly ("production customers running critical workloads will not be limited by region-level failures"), a real resilience story. Confidence=Medium is defensible given the multi-repo, cross-cloud-provider technical uncertainty (AWS/GCP/Azure each implement cross-region snapshot copy differently, per the description's own reference links). **The one real incoherence is Size, not Impact/Confidence** — no bold flag needed on those two variables.

## Code reuse (`qdrant-cloud-cluster-api`, `operator`, `qdrant-cloud-ui`)

**Verdict: NONE — no existing region-aware backup/restore logic in any repo checked; this is new capability across the stack.**

**Already exists (reusable):**

- `cluster_api/cluster/backup/models_db.py` (`Schedule`, `Backup`, `Restore`, `VolumeSnapshot`) — the data model to extend, with a `private_region_id` field already present as the pattern for how region is stored today (though scoped to the cluster's single home region, not a secondary one).
- `qdrant-cloud-ui`: `ClusterCreateProviderRegionSelectorsCompact` / `useProviderRegionsGeography` — a working cloud-provider-aware region selector to extend or reuse for the secondary-region dropdown.
- `qdrant-cloud-ui`: `BackupScheduleForm`, `BackupScheduleTable`, `Backups` component tree — the screens to extend with the new region field/column.

**New / to build:**

- Secondary-region column(s) on `Schedule`/`Backup` plus a DB migration (this repo already has a precedent pattern of small backup-table migrations — e.g. `add_backup_retention`, `add_name_column_to_backup_table` — so the migration mechanics are well-trodden even though the region field itself is new).
- Cross-region snapshot copy orchestration — confirmed absent from `operator` (no `VolumeSnapshotClass` handling found); needs new per-cloud-provider logic (AWS/GCP/Azure each cited with different native mechanisms in the ticket description).
- Billing line-item support for a region-tagged backup (confirmed absent from `cluster_api/billing/metering/adapters/backup_storage.py` — no region dimension in the current billing query, not deep-checked beyond file presence).
- Region-scoped restore-flow enforcement (`Restore` model has its own `private_region_id`, but no cross-check against the backup's region to block cross-region restore).

**Suggested approach:** sequence after [[PM-165-improve-backup-ux|PM-165]]'s UI redesign lands (or explicitly coordinate both), then extend `Schedule`/`Backup` schema + reuse the cluster-creation region selector for the new dropdown; treat cross-region snapshot orchestration and billing as their own technical-design spikes given zero existing code to extrapolate from.

## Linked-ticket context

| Key | Relationship | Title | Figma | Notion | Slack | GitHub | Notes |
|-----|-------------|-------|-------|--------|-------|--------|-------|
| [[PM-404-cross-region-backups-request|PM-404]] | is a request from | "Cross Region Backups" | None | None | None | None | Accepted Product Request; empty description — the origin request, no additional spec beyond PM-230 itself |
| [[PM-165-improve-backup-ux|PM-165]] | is blocked by | "Improve Backup UX" | **[Figma](https://www.figma.com/design/jKD48OnXUbSqWsAaVIPGU6/Qdrant-Cloud-Design?node-id=13183-22197)** | None | None | None | **Design credit: found via [[PM-165-improve-backup-ux\|PM-165]], but scoped to PM-165's own backup-UX refresh (naming, grouping, cluster-info display) — does not cover cross-region UI.** Status "Requirement Definition" — this redesign is not yet finalized, real sequencing risk for PM-230's region-selector placement. |

**Design credit rule applied:** PM-165's Figma does not cover PM-230's cross-region scope, so `design_linked` stays `false` for PM-230 itself — the find is noted here as sequencing context, not counted as PM-230's design.

## Notion context

No Notion links found — notion: none.

## Definition of Ready (DoR)

> [!danger] Verdict: 🔴 NOT READY — realistic size is L, not M, and the design surface is mid-redesign by a blocking ticket

| DoR criterion | Status |
|---|---|
| Objective / description clear | ✅ description plus "Observation"/"Value provided" fields give a clear, detailed goal |
| Acceptance criteria defined | ⚠️ no formal AC field or Notion link, but "Observation" field functions as a detailed de facto requirements list |
| Well scoped (realistic size, not an épic) | ❌ M understates cross-repo new capability (schema + orchestration + billing + restore-flow + UI) |
| Scoring complete (Impact·Confidence·Size) | ✅ all three populated and arithmetic reconciles |
| Design / UI available | ❌ no Figma for cross-region scope; the one Figma found ([[PM-165-improve-backup-ux\|PM-165]]) doesn't cover this feature and is itself still in Requirement Definition |
| Extrapolable from existing code/contract | 🔎 deduced for the region-selector control only; ❌ for cross-region snapshot orchestration (no analogous code in `operator`) and billing (no region dimension in metering) |
| Context sufficient | ✅ origin (PM-404), business rationale, and explicit constraints (no cross-region cluster restore) are all captured |

**Deductions to verify:**
- The secondary-region dropdown control is Extrapolable from `ClusterCreateProviderRegionSelectorsCompact` — basis: an existing, cloud-provider-aware region selector already in production for cluster creation; confidence: Medium (control itself likely reusable, but its integration into the backup/schedule dialogs, and interaction with PM-165's in-flight redesign, is unverified); confirm by: a design/eng pass once PM-165's redesign is finalized.

**To be ready it needs:** Unrealistic estimate — re-size to L before ranking, given confirmed absence of any cross-region logic in `operator`/`cluster-api`/billing. Not extrapolable from existing code — an ADR is owed on cross-region snapshot orchestration per cloud provider (AWS/GCP/Azure differ). Sequence explicitly against [[PM-165-improve-backup-ux|PM-165]] before finalizing the UI design.

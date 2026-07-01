---
ticket: PM-529
aliases: ["PM-529"]
title: "Show backup failure reason in Hybrid Cloud"
type: Objective
status: In Progress
bucket: 2026-Q3
objective_class: Standard
owner: unassigned
priority: Medium
domain: Clusters
carryover: false
size: S
size_factor: 8
impact: 6
confidence: 6
score: 288
scoring_complete: true
requires_ui: true
design_linked: true
design_source: linked_ticket
design_reuse: FULL
code_reuse: PARTIAL
repos: [qdrant-cloud-cluster-api, qdrant-cloud-ui]
notion: read
slack_context: none
github_context: none
subtasks: []
linked_issues: [PM-59]
child_context: full
dor: almost-ready
jira: https://qdrant.atlassian.net/browse/PM-529
tags: [backlog-audit, ticket, PM, readiness/almost-ready]
---

# PM-529 · Show backup failure reason in Hybrid Cloud

> [!tldr] 🟡 ALMOST READY · Score 288 (S) · Notion doc read — confirms AC directly (Req 4.1's "snapshot not finished reason" scenario matches this ticket's scope); remaining gaps are the secondhand Figma credit from [[PM-59-hybrid-cloud-ux-supportability|PM-59]] and one code-level confirmation

**Type:** Objective · **Sprint:** 2026-Q3 (no carryover) · **Status:** In Progress · **Objective Class:** Standard · **Owner:** unassigned · **Priority:** Medium
**Link:** [PM-529](https://qdrant.atlassian.net/browse/PM-529) · **Reporter:** Amogha Sathyanarayana · **Domain:** Clusters · **Created/Updated:** 2026-06-19 / 2026-06-25
**Subtasks:** none
**Linked issues:** PM-59 (relates to, "Hybrid Cloud UX & Supportability improvements")
**Related:** carved out of [[PM-59-hybrid-cloud-ux-supportability|PM-59]] per its own "Observation" field ("This is carved out of PM-59 since backup failure is a separate topic"); same Cluster-Detail-Page redesign context as PM-272 (out of this batch)

---

## Audit summary

| Axis | Verdict | Short note |
|------|---------|------------|
| 1. Goal / scope | OK | Clear, bounded, well-written description; single concrete behavior change |
| 2. UI / Design | Risk | **No Figma/UX field on PM-529 itself — design signal only exists one hop away in PM-59**, and PM-59's own description marks the relevant section struck through (done/superseded) |
| 3. Size (S) | OK | S/8 looks realistic for a status-field propagation + tooltip |
| 4. Prioritization (Score 288) | OK | 6 × 6 × 8 = 288 ✓, Impact/Confidence both plausible for a support/UX polish item |

## Project & technical notes

**Project(s):** `qdrant-cloud-cluster-api` (leader — owns backup status ingestion and the API surface to the UI) and `qdrant-cloud-ui` (secondary — renders the Backups table).
**How it'd be done (high level):** Propagate the `message` field already captured from the Kubernetes `VolumeSnapshot`/backup-status webhook (`PydanticBackupStatusIn.message`) through storage and the outward `PydanticBackup` API schema, then surface it in the UI as a tooltip on the failed-status chip in the existing Backups table.
**Technical notes:** No data-loss or migration risk — this is an additive field. Dependency-free within this batch; PM-59 is a "relates to" context link, not a blocker.
**Identification confidence:** High — found the exact ingestion field (`message: str | None` in `PydanticBackupStatusIn`, `qdrant-cloud-cluster-api/cluster_api/cluster/backup/schemas.py`) that is captured but currently dropped before it reaches `PydanticBackup` (the API-facing schema) or the DB model, and the exact UI component (`BackupsTable.tsx`) that already uses MUI `Tooltip` for a different purpose in the same table.

## 1. Goal & scope clarity

The description is precise and single-purpose: *"When a backup fails in a Hybrid Cloud environment, surface the specific failure reason in the Backups table on the cluster detail page. Currently only a success/failure boolean is shown; the reason from the underlying Kubernetes `VolumeSnapshot` is never propagated to the user."* This is a clear, bounded, one-behavior change with an explicit technical root cause named. No formal Acceptance Criteria field is filled on PM-529 itself (`customfield_10087` is null) — but the description alone is specific enough to derive AC from (see Deductions). The ticket's own "Observation" field documents its lineage: carved out of PM-59 because backup failure was judged a separate topic — a well-captured scoping decision, not a red flag.

## 2. UI / Design needs

**Design reuse (code `qdrant-cloud-ui`):** FULL — `BackupsTable.tsx` already imports and uses MUI `Tooltip` in the same table (for a "See Details" affordance) and already computes a per-row status/color via `getStatusColor(status: ExtendedBackupStatus)`. Adding a tooltip with the failure `message` on the FAILED-status chip is a direct extension of an existing, in-file pattern — no new component, no new interaction model.

**Design / Figma:** Yes, but **indirectly** — PM-529 itself has no design field, no attachments, and 0 remote links. The only design signal in this batch comes from the linked ticket **PM-59**, whose Concept Design field holds a Figma link (`Qdrant-Cloud-Design`, node `4316-30324`) for the broader Hybrid Cloud redesign. However, PM-59's own description explicitly **strikes through** the paragraph describing this exact feature ("~~We need to report the reason up why a Pod is not ready, or why a snapshot is not finished~~ … ~~This reason message should also be displayed on the cluster detail page~~") and annotates it as now covered by PM-272 and PM-529 separately — meaning the Figma in PM-59 was likely for the *original*, now-split scope, not a dedicated mockup for this feature. **Figma link could not be verified** — no Figma MCP tool was available in this session to confirm the node still shows a failure-reason design; treat the design credit as unconfirmed.

**Requires UI? Yes** — the Backups table cell/tooltip on the cluster detail page.

Missing design-asset checklist:

- [ ] Confirm whether Figma node `4316-30324` in PM-59 still contains a mockup of the failure-reason tooltip/text, or whether it was superseded by the strikethrough note (design may in fact be Extrapolable-only, with no dedicated mockup at all)

## 3. Size coherence (T-Shirt Size)

Size **S** (factor 8).

> [!warning] Estimate alert (under/over-estimation risk)
> S looks realistic for the code change itself (add a column, thread a string through 2-3 layers, add a tooltip) — no hidden migration or billing surface found. The only risk to the estimate is scope creep if "the reason" needs translation/normalization (raw Kubernetes messages can be technical/unfriendly for end customers) rather than a straight pass-through; if a friendlier message-mapping layer is required, this nudges toward the top of S but not into M. No re-estimate needed at this time.

## 4. Prioritization (Impact / Confidence / Score)

| Variable | Value | Numeric |
|----------|-------|---------|
| Impact (calc) | Measurable | 6 |
| Confidence (calc) | Medium | 6 |
| Size factor (S) | — | 8 |
| **Score (RICE)** | — | **288** |

Model check: 6 × 6 × 8 = **288 ✓** (matches stored Score exactly).

Assessment: Impact=Measurable and Confidence=Medium are both reasonable for a supportability/UX polish item that reduces support-ticket volume but doesn't unlock new revenue — no incoherence found. The Score holds up.

## Code reuse (`qdrant-cloud-cluster-api`, `qdrant-cloud-ui`)

**Verdict: PARTIAL — the ingestion field already exists; it's dropped before reaching the API/UI layer.**

**Already exists (reusable):**

- `cluster_api/cluster/backup/schemas.py::PydanticBackupStatusIn.message` — the failure message is already received from the status webhook (also present on `PydanticScheduleStatusIn` and `PydanticRestoreStatusIn` — the whole family already carries a `message` field for schedules and restores too, just not exposed).
- `qdrant-cloud-ui/.../Backups/BackupsTable.tsx` — existing `Tooltip` (MUI) usage and `getStatusColor` status-chip logic to extend.

**New / to build:**

- Persist `message` on the backup DB model (`backup/models_db.py` currently has no such column) and thread it into the outward `PydanticBackup` schema (currently missing entirely).
- Backend endpoint/gRPC field to expose it, and the UI query hook (`backupService`) update to consume it.
- Tooltip wiring on the FAILED-status chip in `BackupsTable.tsx`.

**Suggested approach:** Reuse the existing `message` capture and the existing `Tooltip` pattern end-to-end; the only genuinely new work is a DB column + schema field + one UI tooltip binding.

## Linked-ticket context

| Key | Relationship | Title | Figma | Notion | Slack | GitHub | Notes |
|-----|-------------|-------|-------|--------|-------|--------|-------|
| [[PM-59-hybrid-cloud-ux-supportability\|PM-59]] | relates to | "Hybrid Cloud UX & Supportability improvements" | [Qdrant Cloud Design, node 4316-30324](https://www.figma.com/design/jKD48OnXUbSqWsAaVIPGU6/Qdrant-Cloud-Design?node-id=4316-30324&p=f&t=OmHTpZXDZXOvK4ws-0) — found but **unverified** (no Figma tool available this run) | [Hybrid Cloud Environment Redesign](https://www.notion.so/qdrant/Hybrid-Cloud-Environment-Redesign-238674779d3380a1b96ac5d58a463545) — **read**, Req 4.1's "snapshot not finished reason" scenario confirmed to cover PM-529 | None | None | PM-59's own text explicitly carves out backup-failure reporting into PM-529 and strikes through that section as superseded — **the Notion doc's Req 4.1 confirms it still covers PM-529's snapshot-reason scope post-split**; the Figma stays unconfirmed (separate tool gap) |

Design credit: `design_linked: true`, `design_source: linked_ticket` set on this basis, but flagged unconfirmed — see the missing-asset checklist above.

## Notion context

> Re-audited 2026-07-01 — the Notion MCP tool was available this pass (it was not in the original session). This resolves the prior follow-up flag.

| Notion doc | Fetched? | Doc type | Last edited | Found in |
|---|---|---|---|---|
| [Hybrid Cloud Environment Redesign](https://www.notion.so/qdrant/Hybrid-Cloud-Environment-Redesign-238674779d3380a1b96ac5d58a463545) | ✅ read | Objective spec (Milestones 1–4, each with Acceptance Criteria) | ~2025-10-09 (page snapshot) | PM-59 Acceptance Criteria field (one hop from PM-529) |

**Key takeaways (from the doc):**

- **Requirements / AC:** **Milestone 4 ("Enhance Cluster Detail Page in Hybrid Cloud Environments") → Requirement 4.1** is the direct match for PM-529: "Display specific reason messages for non-ready Pods or PVCs and unfinished snapshots... moving beyond simple boolean flags." Its acceptance-criteria scenarios include **"Display snapshot not finished reason"** — e.g. showing "Snapshot can't be created due to missing snapshot class" next to the snapshot's status. Since backups in this system *are* Kubernetes `VolumeSnapshot`s (per the code-reuse section above), this scenario is PM-529's AC almost verbatim.
- **Decisions recorded:** Requirement 4.1 originally bundled **both** Pod-not-ready reasons and snapshot-not-finished reasons; PM-59's own (struck-through) text confirms this was later split — Pod-reason work went to PM-272, snapshot/backup-reason work to PM-529. This doc is the pre-split parent spec for both.
- **Open questions:** None flagged in the doc itself; no comments checked (`notion-get-comments` not run — the doc reads as a settled, if pre-split, spec).
- **Links inside the doc:** None found in the fetched text — no Figma link embedded in this page. The Figma node cited on PM-59 (`4316-30324`) isn't corroborated by anything in this specific Requirement 4.1 section.
- **Scope boundaries:** Four milestones total (creation-flow redesign, detail-page redesign, cluster-creation storage options, detailed status reasons); PM-529 maps only to Milestone 4 / Requirement 4.1's snapshot-reason scenario, not the rest of the doc.

**Freshness:** Notion page snapshot ~2025-10-09, roughly 8 months before PM-529 was created (2026-06-19) — consistent with PM-529 being carved out of this older, broader Objective, not a discrepancy.

**Discrepancies with the Jira ticket:** None — this **resolves** the previous flag-for-follow-up. The doc still applies to PM-529 post-split: Requirement 4.1's snapshot-reason scenario is written for exactly this feature, distinct from the Pod-reason scenario that went to PM-272.

**Effect on DoR:** Criterion 2 moves from 🔎 *(derived from PM-529's own description)* to **✅ externalized in Notion — read**, with a real, matching acceptance-criteria scenario. This does not resolve the Figma-credit question (criterion 5) — that's a Figma-tool gap, not a Notion one.

**Effect on DoR:** Criterion 2 stays ⚠️ *externalized, unverified* (one hop away, unread) rather than ✅ — PM-529's own description is detailed enough to derive AC from directly (see Deductions), so this doesn't block readiness on its own.

## Definition of Ready (DoR)

> [!warning] Verdict: 🟡 ALMOST READY — pending confirmation of 2 deductions (Figma coverage, and the operator's `message` field in practice); AC is now confirmed via Notion, no longer a deduction

| DoR criterion | Status |
|---|---|
| Objective / description clear | ✅ |
| Acceptance criteria defined | ✅ externalized in Notion — read (PM-59's linked doc, Requirement 4.1's snapshot-reason scenario matches directly) |
| Well scoped (realistic size, not an épic) | ✅ |
| Scoring complete (Impact·Confidence·Size) | ✅ |
| Design / UI available | 🔎 |
| Extrapolable from existing code/contract | 🔎 |
| Context sufficient | ✅ |

**Deductions to verify:**
- **Design / UI** — classified FULL reuse (tooltip on existing status chip, no new Figma needed) based on the existing `Tooltip` pattern already present in `BackupsTable.tsx`. Basis: analogous code in the same file; confidence: High; confirm by: a designer or PM confirming a plain tooltip (vs. something richer) is sufficient, and clarifying whether PM-59's Figma node (still unverified — separate Figma-tool gap) shows anything beyond what Notion's Req 4.1 already specifies in text.
- **Extrapolable from existing code** — the `message` field already exists on the ingestion schema (`PydanticBackupStatusIn`) for backups (and schedules/restores); assumed it can be threaded through to `PydanticBackup` and the DB model without a new contract. Basis: analogous, already-existing field on a sibling schema; confidence: High; confirm by: an engineer checking the operator's `VolumeSnapshot` status payload actually populates `message` on failure today (not just on schema, but in practice).

**Confirmed this pass (no longer a deduction):** Acceptance criteria — Notion doc Req 4.1's "snapshot not finished reason" scenario is a direct match for PM-529's scope (backups are `VolumeSnapshot`s in this system); read, not derived.

**To be ready it needs:** Missing UI / design confirmation (Figma-node relevance, tooltip-vs-richer-treatment sign-off) — everything else is now either ✅ or a normal-strength deduction. Once the two remaining deductions above are confirmed, this moves to 🟢.

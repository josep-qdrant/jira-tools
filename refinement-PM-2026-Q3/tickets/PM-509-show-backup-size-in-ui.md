---
ticket: PM-509
aliases: ["PM-509"]
title: "Show backup size in UI"
type: Objective
status: Backlog
bucket: 2026-Q3
objective_class: Standard
owner: unassigned
priority: Medium
domain: Clusters
carryover: false
size: S
size_factor: 8
impact: 6
confidence: 9
score: 432
scoring_complete: true
requires_ui: true
design_linked: false
design_source: none
design_reuse: FULL
code_reuse: PARTIAL
repos: [qdrant-cloud-ui, qdrant-cloud-cluster-api, qdrant-cloud-public-api]
notion: none
slack_context: none
github_context: none
subtasks: []
linked_issues: [PM-501, PM-165]
child_context: full
dor: almost-ready
jira: https://qdrant.atlassian.net/browse/PM-509
tags: [backlog-audit, ticket, PM, readiness/almost-ready]
---

# PM-509 · Show backup size in UI

> [!tldr] 🟡 ALMOST READY · Score 432 (S) — **clear, well-scoped, and the backend already tracks the data for billing; the one blocker is that the public API contract doesn't expose it yet, and this overlaps with [[PM-165-improve-backup-ux|PM-165]]'s own "backup size column" line item**

**Type:** Objective · **Sprint:** 2026-Q3 (new, no carryover) · **Status:** Backlog · **Objective Class:** Standard · **Owner:** unassigned · **Priority:** Medium
**Link:** [PM-509](https://qdrant.atlassian.net/browse/PM-509) · **Reporter:** Bastian Hofmann · **Domain:** Clusters · **Created/Updated:** 2026-06-13 / 2026-06-25
**Subtasks:** none
**Linked issues:** PM-501 "Show backup storage size (GB) in the UI" (requests action, Product Request, status Accepted/Done) — the originating customer request; [[PM-165-improve-backup-ux|PM-165]] "Improve Backup UX" (is blocked by, Objective, In Progress)
**Related:** **same deliverable as a line item already inside [[PM-165-improve-backup-ux|PM-165]]'s own scope** — see axis 1

---

## Audit summary

| Axis | Verdict | Short note |
|------|---------|------------|
| 1. Goal / scope | Risk | Description is clear and concrete, but **duplicates a line item already listed inside PM-165's scope** ("Add a backup size column to both backup screens") |
| 2. UI / Design | OK | No Figma, but the exact column pattern to copy exists in code (`Duration` column in `BackupsTable.tsx`) — Extrapolable, not a real gap |
| 3. Size (S) | OK | S is realistic for the UI layer; the gating work is a proto/API contract change, not UI complexity |
| 4. Prioritization (Score 432) | OK | 6×9×8 reconciles; Impact=Measurable is defensible for a billing-transparency feature |

## Project & technical notes

**Project(s):** `qdrant-cloud-ui` (React/TS, leader for the column UI), `qdrant-cloud-cluster-api` (Python, secondary — already computes the size), `qdrant-cloud-public-api` (protobuf, secondary but **blocking** — the contract must add the field first)
**How it'd be done (high level):** Add a `size_bytes`/`size_gib`-equivalent field to the `Backup` message in `backup.proto`, wire it through `backup_grpc_service.py` from the already-existing `SnapshotLog.bytes` column, then add a "Backup Size" column to `BackupsTable.tsx` following the exact pattern already used for the `Duration` column.
**Technical notes:** No data-loss or migration risk — this is additive (new read-only field + new UI column). Genuinely blocked by [[PM-165-improve-backup-ux|PM-165]] per the explicit "is blocked by" issue link, and that dependency is worth resolving via a scope conversation rather than parallel work (see axis 1).
**Identification confidence:** High — verified the exact backend field (`cluster_api/booking/models_db.py:754` `bytes: Mapped[int]`, plus a `size_gib` computed property at line 803-804) and confirmed via `grep` that the public `backup.proto` contract has no size field on the `Backup` message today (only pagination `total_size`).

## 1. Goal & scope clarity

The description is unusually good for this batch: concrete ("new column in both backup screens," names the header text "Backup Size"), states the business reason (already used for metering, billed per GB/month, currently the customer has no visibility and must check GCP manually), and traces to a real customer-facing origin via the linked Product Request **PM-501** ("Show backup storage size (GB) in the UI," status Accepted). This is a well-formed, single-outcome ticket.

**The one real gap is not inside PM-509 — it's the overlap with PM-165.** PM-165 ("Improve Backup UX," status Requirement Definition, In Progress) already lists as one of its own bullet points: *"Add a backup size column to both backup screens"* — the identical deliverable, same two screens, under its "Enhanced Cluster Information" section. PM-165 also **blocks** PM-509 via an explicit Jira issue link. **This means either (a) PM-509 is scope that's already covered once PM-165 ships and should be de-duplicated/closed, or (b) PM-509 is meant to ship this specific column ahead of PM-165's broader UX refresh, in which case the two tickets' owners should agree on who does it and PM-165's bullet should be struck.** As written, there's a real risk of double work or of PM-509 sitting blocked indefinitely behind a broader redesign ticket for a one-column addition that doesn't need to wait.

## 2. UI / Design needs

**Design reuse (code `qdrant-cloud-ui`):** FULL — `BackupsTable.tsx` already implements a `Duration` column (`accessorFn` reading a proto duration field, `cell` formatting it, `header: 'Duration'`) in the exact same `TanStackTable` `allColumns` array a `Backup Size` column would join. This is a one-column addition to an established, uniform pattern — no new UI concept, no design decision needed beyond "which unit to display" (bytes vs. GiB — the backend already computes both).

**Design / Figma:** No — checked all five places: no design fields on PM-509 (all null), 0 attachments, description has no figma.com/notion.so URL, issue links checked (PM-501, PM-165 — neither carries a Figma; PM-165's own `UX Designs` field is null though PM-165 mentions a broader visual redesign), 0 remote links (`getJiraIssueRemoteIssueLinks` confirmed empty). **Absence of a Figma here is not a blocker** — see design-reuse verdict above.

**Requires UI? Yes** — one new table column, no new screen or modal.

Missing design-asset checklist: none — the pattern to copy is unambiguous and cited above; no new design asset is needed for a single data-only column matching existing formatting conventions.

## 3. Size coherence (T-Shirt Size)

Size **S** (factor 8).

> [!warning] Estimate alert (under/over-estimation risk)
> S is realistic for the UI change itself (copy the existing column pattern), but **it likely does not include the proto contract change** (adding a size field to `Backup` in `backup.proto`, regenerating clients, wiring `backup_grpc_service.py` to read `SnapshotLog.bytes`). That's a small, well-understood, low-risk change — the data already exists — so S probably still holds end-to-end, but it's worth the assignee confirming the proto/API layer is included in the estimate, not assumed to be "already done" just because the underlying DB field exists.

Re-estimating: even under a more conservative M (factor 6), Score would be 6 × 9 × 6 = 324 — still solidly mid-pack in this quarter's ranking, so the ranking wouldn't flip on this alone. S is the more defensible call and is kept as-is.

## 4. Prioritization (Impact / Confidence / Score)

| Variable | Value | Numeric |
|----------|-------|---------|
| Impact (calc) | Measurable | 6 |
| Confidence (calc) | High | 9 |
| Size factor (S) | — | 8 |
| **Score (RICE)** | — | **432** |

Model check: 6 × 9 × 8 = **432 ✓**.

Assessment: Impact=Measurable (not Significant) is reasonable — this is a transparency/trust improvement, not a new capability, so a moderate impact rating tracks. Confidence=High is well-supported: the data already exists in production for metering, the UI pattern to copy is concrete, and there's a validated customer request (PM-501) behind it. No incoherence found in the scoring itself — the only open question is the PM-165 overlap (axis 1), which affects sequencing, not the Score's arithmetic.

## Code reuse (`qdrant-cloud-cluster-api`, `qdrant-cloud-public-api`, `qdrant-cloud-ui`)

**Verdict: PARTIAL — the data and the UI pattern both already exist; the missing link is the public API contract.**

**Already exists (reusable):**

- `cluster_api/booking/models_db.py:754` — `SnapshotLog.bytes: Mapped[int]` (size already stored per snapshot), plus a computed `size_gib` property (line 803-804: `self.bytes / 1024 / 1024 / 1024`).
- `cluster_api/billing/metering/adapters/backup_storage.py` — confirms this exact field is already used for Orb metering events today (`size_bytes=entity.bytes` in `BackupStorageMeteringAdapter.build_event`), matching the ticket's claim "we are already using this information for metering."
- `qdrant-cloud-ui/src/components/Clusters/Backups/BackupsTable.tsx` (lines 271–353) — the `allColumns` array with the `Duration` column as a direct structural template for a new `Backup Size` column; renders on both backup screens (`backups.component.tsx` and `clusters/$clusterId/backups.component.tsx`) since they share this table.

**New / to build:**

- A size field on the `Backup` message in `qdrant-cloud-public-api/proto/qdrant/cloud/cluster/backup/v1/backup.proto` — confirmed absent today (only `total_size` for pagination exists in that file).
- Wiring in `grpc_api/cluster/backup/v1/backup_grpc_service.py` to populate the new field from `SnapshotLog.bytes`/`size_gib`.
- The new `Backup Size` column itself in `BackupsTable.tsx` (small, following the `Duration` column's exact shape).

**Suggested approach:** Add the proto field first (small, additive, no migration), regenerate clients, expose it in the gRPC service, then add the UI column by copying the `Duration` column definition. Resolve the PM-165 overlap before starting (axis 1) so the work isn't duplicated.

## Linked-ticket context

| Key | Relationship | Title | Figma | Notion | Slack | GitHub | Notes |
|-----|-------------|-------|-------|--------|-------|--------|-------|
| PM-501 | requests action (inward: "is a request from") | "Show backup storage size (GB) in the UI" | None | None | None | None | Status Accepted (Done-category); Product Request type; description confirms billing/metering already tracks GB but customer has no visibility — the origin of PM-509, no additional design signal |
| [[PM-165-improve-backup-ux\|PM-165]] | is blocked by (PM-165 blocks PM-509) | "Improve Backup UX" | [Figma](https://www.figma.com/design/jKD48OnXUbSqWsAaVIPGU6/Qdrant-Cloud-Design?node-id=13183-22197) (PM-165's own UX Designs field) | None | None | None | **Same "backup size column" line item already listed in PM-165's description** — see axis 1 for the overlap/dependency risk |

`child_context: full` — both linked tickets fetched and hunted; no cap reached.

## Notion context

No Notion links found — notion: none. (Acceptance Criteria, Technical Documentation, Concept Design, UX Designs fields are all null on PM-509 itself; PM-501 also has no Acceptance Criteria content.)

## Definition of Ready (DoR)

> [!warning] Verdict: 🟡 ALMOST READY — single blocker: resolve the scope overlap/dependency with PM-165 before committing (which ticket owns the backup-size column)

| DoR criterion | Status |
|---|---|
| Objective / description clear | ✅ |
| Acceptance criteria defined | 🔎 |
| Well scoped (realistic size, not an épic) | ✅ |
| Scoring complete (Impact·Confidence·Size) | ✅ |
| Design / UI available | 🔎 |
| Extrapolable from existing code/contract | 🔎 |
| Context sufficient | ✅ |

**Deductions to verify:**
- **Acceptance criteria** — no formal AC field is filled, but the description is specific enough (new column, both screens, header text given) to derive AC directly; basis: derivable requirement from the description itself; confidence: High; confirm by: PM writing the one-liner AC into the ticket (mechanical, not a scope question).
- **Design available** — deduced Extrapolable from the existing `Duration` column in `BackupsTable.tsx`; basis: analogous code, same table, same formatting pattern; confidence: High; confirm by: engineer picking up the ticket confirming the column shape (units: GiB vs. raw bytes) with design/PM before implementing.
- **Extrapolable from existing code/contract** — the UI and DB layers are confirmed extrapolable; the public-API proto layer is a new field addition to an existing message, which is a low-risk but real contract change; basis: analogous code (`SnapshotLog.bytes`, existing metering adapter) plus a normal additive-proto-field pattern; confidence: High; confirm by: whoever picks up PM-509 confirming the field addition doesn't need a broader API versioning conversation.

**To be ready it needs:** resolve the **overlap with PM-165** first — decide whether PM-509 ships the column independently (recommended, given PM-165's broader redesign has no committed timeline and this is small + high-confidence) or whether PM-165 absorbs it and PM-509 is closed as a duplicate. Once that's settled, this is a 🟢-ready ticket.

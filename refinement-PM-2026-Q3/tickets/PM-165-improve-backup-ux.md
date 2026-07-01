---
ticket: PM-165
aliases: ["PM-165"]
title: "Improve Backup UX"
type: Objective
status: Requirement Definition
bucket: 2026-Q3 (carried over, comment confirms "not ready to start implementation")
objective_class: Standard
owner: Amogha Sathyanarayana
priority: Medium
domain: Clusters
carryover: true
size: XS
size_factor: 10
impact: 6
confidence: 6
score: 360
scoring_complete: true
requires_ui: true
design_linked: true
design_source: jira_design_field
design_reuse: PARTIAL
code_reuse: PARTIAL
repos: [qdrant-cloud-ui, qdrant-cloud-cluster-api]
notion: none
slack_context: found
github_context: none
subtasks: []
linked_issues: [PM-213, MKT-317, PM-509, PM-230]
child_context: full
dor: not-ready
jira: https://qdrant.atlassian.net/browse/PM-165
tags: [backlog-audit, ticket, PM, readiness/not-ready]
---

# PM-165 · Improve Backup UX

> [!tldr] 🔴 NOT READY · Score 360 (XS) · A live Figma exists, but scope overlaps two other in-flight tickets and hinges on a still-open scheduler-frequency decision: split before sizing

**Type:** Objective · **Sprint:** 2026-Q3 (carried over; comment: "not ready to start implementation") · **Status:** Requirement Definition · **Objective Class:** Standard · **Owner:** Amogha Sathyanarayana · **Priority:** Medium
**Link:** [PM-165](https://qdrant.atlassian.net/browse/PM-165) · **Reporter:** Bastian Hofmann · **Domain:** Clusters · **Created/Updated:** 2025-06-20 / 2026-06-29
**Subtasks:** none
**Linked issues:** [[PM-213-redesign-backups-section|PM-213]] (relates to, Done), [[MKT-317-improve-backup-schedule-ux|MKT-317]] (requests action, In Progress Design Request), [[PM-509-show-backup-size-in-ui|PM-509]] (blocks, Backlog, same batch), [[PM-230-cross-region-backups|PM-230]] (blocks, Backlog, same batch)
**Related:** overlaps in scope with [[PM-509-show-backup-size-in-ui|PM-509]] (backup size column is already named as in-scope here) and [[PM-230-cross-region-backups|PM-230]] (multi-region backup explicitly discussed as "maybe a separate objective" in comments, still unresolved).

---

## Audit summary

| Axis | Verdict | Short note |
|------|---------|------------|
| 1. Goal / scope | Risk | **Overlaps two other tickets it also "blocks" (PM-509, PM-230), plus an in-progress sibling design ticket (MKT-317) covering the same schedule UX** |
| 2. UI / Design | OK | Figma link present in UX Designs field; a live, in-progress design ticket (MKT-317) with screenshots exists one hop away: real signal, not a gap |
| 3. Size (XS) | Risk | **XS is very unlikely for a UI redesign touching schedule config, cluster-metadata retention, custom naming, and grouping/visual hierarchy** |
| 4. Prioritization (Score 360) | Risk | Reasonable Impact/Confidence, but Score rests on an XS that doesn't match the description's five bundled feature asks |

## Project & technical notes

**Project(s):** `qdrant-cloud-ui` (leader; Backups tab, schedule forms, restore/backup lists); `qdrant-cloud-cluster-api` (secondary; backup naming, since "the backup name is no longer used as ID in the gRPC API," implying an API contract change already landed or is assumed).
**How it'd be done (high level):** redesign the Backups tab (group by status/cluster, add backup-size column, custom names, preserved cluster metadata post-deletion) and rework the schedule form to support more frequency options, but only after the schedule-frequency decision (open question below) and after de-duplicating with MKT-317 and PM-509/PM-230.
**Technical notes:** a fresh customer ask for 30-minute schedule frequency (comment, 2026-06-29, two days before this run) is not yet reflected in the ticket's competitor-analysis table (which only compares daily/weekly/monthly/hourly); the requirement may already be stale.
**Identification confidence:** High for the UI repo/module (`Clusters/Backups/`); Medium for the cluster-api naming-contract change (referenced but not verified in code this session).

## 1. Goal & scope clarity

The description bundles five distinct asks: (1) more schedule frequency options (with an explicit "TBD, competitor analysis needed," and the competitor table in comments doesn't even cover the granularity a customer requested five days ago), (2) custom backup names, (3) preserved cluster metadata for deleted clusters (name, creation date, purpose, collections), (4) a backup-size column, and (5) visual regrouping (by status, by cluster ID). Two of these are **already separately ticketed**: backup-size is [[PM-509-show-backup-size-in-ui|PM-509]] (which this ticket also lists as something it "blocks," a real dependency, not just an overlap), and the "preserve cluster metadata for deleted clusters" ask is functionally the same as the already-**Done** [[PM-213-redesign-backups-section|PM-213]] ("Redesign the general Backups section to improve usability for backups from deleted clusters"). A detailed Q&A thread (2026-05-19) answers several open product questions (no backup quota, no restriction on active schedules, 1-year schedule retention vs. indefinite manual retention, no PITR/RPO planned), genuinely useful captured context, but the **schedule-frequency decision is still explicitly unresolved**, and a brand-new customer ask (30 min) arrived after the competitor review closed. No formal AC field is populated (null); the Q&A comments are the closest thing to requirements.

## 2. UI / Design needs

**Design reuse (code `qdrant-cloud-ui`):** PARTIAL. `src/components/Clusters/Backups/ClusterBackupsTab.tsx`, `BackupSchedulesForm/BackupScheduleFormDialog.tsx`, and `BackupSchedulesForm/BackupCostInfo.tsx` already implement the backup list, schedule list, and schedule-creation dialog described as "too busy": these are the very components in scope for the redesign, so most of the new layout can extend rather than replace them. The custom-naming and grouping features are new UI states on top of that existing structure.

**Design / Figma:** Yes. Found in the **UX Designs** field (`jira_design_field`): `https://www.figma.com/design/jKD48OnXUbSqWsAaVIPGU6/Qdrant-Cloud-Design?node-id=13183-22197`. Existence confirmed by the link being present and well-formed; full design-context pull wasn't needed since PM-165 already clears the "has a Figma" bar and the design-effort classification (PARTIAL) isn't a close call. The linked ticket [[MKT-317-improve-backup-schedule-ux|MKT-317]] (Design Request, In Progress, same author) also carries **3 screenshot attachments** of the current busy UI: reference material for the "before" state, not a mockup of the "after," but genuine design-hunt signal one hop away.

**Requires UI? Yes.** Schedule form redesign, backup/restore list redesign, new naming UI, grouping/visual hierarchy changes.

Missing design-asset checklist:

- [ ] Confirm the linked Figma node covers the schedule-frequency options once that decision is made (competitor review is stale after the 30-min customer ask)
- [ ] Reconcile design scope with the in-progress MKT-317 design request (same UI, same author, unclear if it's the same Figma file)

## 3. Size coherence (T-Shirt Size)

Size **XS** (factor 10).

> [!warning] Estimate alert (under/over-estimation risk)
> XS is hard to square with five bundled feature asks (schedule frequency change, custom naming with a gRPC API contract change, deleted-cluster metadata preservation, a new UI column, and list regrouping), two of which are tracked as separate Objectives elsewhere in this same backlog. Realistic estimate **S to M** if scoped as one ticket, or **XS is right only if this ticket is narrowed** to the visual/grouping polish and the already-answered Q&A items, with PM-509 (size column) and the naming/API change split out explicitly. Review scope before committing to XS.

Re-estimating at S (8) instead of XS (10): 6 × 6 × 8 = 288 vs. current 360, a 20% score drop that would tie it with [[PM-164-improve-cluster-metrics-ui|PM-164]] and [[PM-529-backup-failure-reason-hybrid-cloud|PM-529]] at 288.

## 4. Prioritization (Impact / Confidence / Score)

| Variable | Value | Numeric |
|----------|-------|---------|
| Impact (calc) | Measurable | 6 |
| Confidence (calc) | Medium | 6 |
| Size factor (XS) | n/a | 10 |
| **Score (RICE)** | n/a | **360** |

Model check: 6 × 6 × 10 = **360 ✓**

Assessment: Impact/Confidence look reasonable for a UX-polish-plus-feature ticket with real customer signal (Q&A thread, a fresh 30-min-frequency ask). The Score is arithmetically correct but, as with PM-164, **rests on an XS that doesn't match the bundled scope**: the ranking implication (XS pushes this ticket's Score above [[PM-187-multi-channel-alert-notifications|PM-187]]-tier work) should be revisited once the ticket is split.

## Code reuse (`qdrant-cloud-ui`, `qdrant-cloud-cluster-api`)

**Verdict: PARTIAL. The Backups tab and schedule dialog already exist and are the direct target of the redesign; custom naming needs an API-side check.**

**Already exists (reusable):**

- `src/components/Clusters/Backups/ClusterBackupsTab.tsx`: the tab this ticket redesigns.
- `src/components/Clusters/Backups/BackupSchedulesForm/BackupScheduleFormDialog.tsx` and `BackupCostInfo.tsx`: the schedule-creation dialog described as too busy; extend rather than rebuild.
- `src/api/services/backups.ts`: existing backup data-fetching layer to extend for size/name/metadata fields.

**New / to build:**

- Custom backup naming: description states "the backup name is no longer used as ID in the gRPC API" implying the contract change is assumed done or already shipped; **not verified in `qdrant-cloud-cluster-api`** this session, worth a direct check before estimating.
- Deleted-cluster metadata preservation: overlaps with the already-Done [[PM-213-redesign-backups-section|PM-213]]; check whether that work already covers this before re-scoping it here.
- New schedule frequency options: blocked on the still-open frequency decision.

**Suggested approach:** verify the gRPC naming-contract assumption directly in `qdrant-cloud-cluster-api`, confirm what [[PM-213-redesign-backups-section|PM-213]] already shipped, then extend the existing Backups components for whatever narrowed scope remains after de-duplicating with PM-509/PM-230/MKT-317.

## Linked-ticket context

| Key | Relationship | Title | Figma | Notion | Slack | GitHub | Notes |
|-----|-------------|-------|-------|--------|-------|--------|-------|
| [[PM-213-redesign-backups-section\|PM-213]] | relates to | "Redesign the general Backups section to improve usability for backups from deleted clusters" | None | None | None | None | **Done**; AC there (custom names, deleted-cluster identifiability, grouping, backward compatibility) reads nearly identical to three of this ticket's five asks; check for actual scope overlap/duplication before sizing PM-165 |
| [[MKT-317-improve-backup-schedule-ux\|MKT-317]] | requests action (is a request from) | "Improve Backup Schedule UX" | None (3 PNG screenshots of current UI, not mockups) | None | None | None | In Progress Design Request, same reporter (Bastian Hofmann), assigned to a designer (Juan Carmona); active design work on the same schedule UX may already be underway outside this ticket's visibility |
| [[PM-509-show-backup-size-in-ui\|PM-509]] | blocks | "Show backup size in UI" | own card in this batch | own card in this batch | own card in this batch | own card in this batch | Same backup-size feature this ticket's description also claims ("Add a backup size column"); likely duplicated scope, not just a dependency |
| [[PM-230-cross-region-backups\|PM-230]] | blocks | "Cross-region backups" | own card in this batch | own card in this batch | own card in this batch | own card in this batch | Comment thread explicitly floats moving multi-region backup to this separate objective; decision was made, consistent with the "blocks" link |

> **Design credit:** MKT-317's attachments are reference screenshots of the current UI, not new mockups; they don't upgrade the design-effort classification, but confirm active parallel design work exists. The Figma credited to this card's frontmatter comes directly from PM-165's own UX Designs field, not from the linked tickets.

## Notion context

No Notion links found, notion: none.

## Slack context (found, not read)

A Slack thread is linked from a comment (2026-06-29): `https://qdrant.slack.com/archives/C0833STGBNY/p1782736332972829`, immediately following a note that "a customer is requesting a schedule frequency of every 30min." No Slack MCP tool was available in this session to fetch the thread; `slack_context: found`, not `read`. This is the freshest signal on the still-open frequency question and should be read before finalizing the schedule-frequency scope.

## Definition of Ready (DoR)

> [!danger] Verdict: 🔴 NOT READY, de-duplicate against PM-213/PM-509/MKT-317 and resolve the schedule-frequency question before sizing

| DoR criterion | Status |
|---|---|
| Objective / description clear | ⚠️ each of the five asks is individually clear; their overlap with other tickets is not resolved |
| Acceptance criteria defined | ❌ no AC field; Q&A comments cover product decisions but not formal AC |
| Well scoped (realistic size, not an épic) | ❌ bundles at least 2 features already tracked as separate Objectives (PM-509, and likely PM-213's already-Done work) |
| Scoring complete (Impact·Confidence·Size) | ✅ (Score reliability flagged, see axis 3) |
| Design / UI available | ✅ Figma linked in UX Designs field, existence confirmed |
| Extrapolable from existing code/contract | 🔎 deduced for the UI redesign portion; ⚠️ unverified for the naming/gRPC contract claim |
| Context sufficient | ✅ rich Q&A thread captures real product decisions, though the schedule-frequency answer is stale after a new customer ask |

**Deductions to verify:**
- The Backups tab and schedule dialog redesign is extrapolable from the existing `ClusterBackupsTab.tsx`/`BackupScheduleFormDialog.tsx` components; basis: these are the literal components the ticket describes as "too busy"; confidence: High; confirm by: designer/engineer confirming the linked Figma extends these components rather than replacing them.

**To be ready it needs:** Not well scoped (épic / split): separate the backup-size ask (duplicate of PM-509) and re-check against PM-213's already-shipped work; then resolve the schedule-frequency decision (read the linked Slack thread) before re-sizing. Missing context is secondary: the naming/gRPC-contract claim needs a direct code check, not just the ticket's word.

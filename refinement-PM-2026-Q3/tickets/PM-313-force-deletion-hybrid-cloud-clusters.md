---
ticket: PM-313
aliases: ["PM-313"]
title: "Allow force deletion of Hybrid Cloud clusters"
type: Objective
status: Ready for planning
bucket: 2026-Q3
objective_class: Standard
owner: unassigned
priority: Medium
domain: Clusters
carryover: false
size: XS
size_factor: 10
impact: 9
confidence: 9
score: 810
scoring_complete: true
requires_ui: probable
design_linked: false
design_source: none
design_reuse: PARTIAL
code_reuse: PARTIAL
repos: [qdrant-cloud-cluster-api, qdrant-cloud-ui, qdrant-cloud-public-api]
notion: none
slack_context: none
github_context: none
subtasks: []
linked_issues: [CRC-125]
child_context: full
dor: almost-ready
jira: https://qdrant.atlassian.net/browse/PM-313
tags: [backlog-audit, ticket, PM, readiness/almost-ready]
---

# PM-313 · Allow force deletion of Hybrid Cloud clusters

> [!tldr] 🟡 ALMOST READY · Score 810 (XS) · backend logic already exists and is verified in code; single blocker is an **unresolved internal disagreement** on whether the UI needs a customer-facing button at all

**Type:** Objective · **Sprint:** 2026-Q3 (not carryover) · **Status:** Ready for planning · **Objective Class:** Standard · **Owner:** unassigned · **Priority:** Medium
**Link:** [PM-313](https://qdrant.atlassian.net/browse/PM-313) · **Reporter:** Bastian Hofmann · **Domain:** Clusters · **Created/Updated:** 2026-02-11 / 2026-06-25
**Subtasks:** none
**Linked issues:** [[CRC-125|CRC-125]] (relates to)
**Related:** none found in this batch

---

## Audit summary

| Axis | Verdict | Short note |
|------|---------|------------|
| 1. Goal / scope | OK | Clear problem, formal AC drafted in comments, but **UX approach reversed mid-thread and never reconciled** |
| 2. UI / Design | Risk | No Figma; **deduced PARTIAL reuse** from existing danger-action dialog pattern, but whether a UI element is needed at all is contested |
| 3. Size (XS) | Risk | Backend logic already exists (verified) — XS is plausible for the exposure work, but the UX-decision churn is unbounded until resolved |
| 4. Prioritization (Score 810) | OK | Impact=Significant, Confidence=High both justified by an already-existing backend implementation; **XS ranks this near the top of the whole 17-issue scope — worth the extra scrutiny the scope hand-off flagged** |

## Project & technical notes

**Project(s):** `qdrant-cloud-cluster-api` (leader — Python; the `force` delete path already exists here) · `qdrant-cloud-ui` (secondary — button/dialog if the UI path is chosen) · `qdrant-cloud-public-api` (secondary — protobuf contract to expose `force` if going through the public API rather than only the internal/CLI path).
**How it'd be done (high level):** Expose the existing `delete_cluster(..., force=True)` path (currently only reachable via CLI/internal commands) through the public API, then decide whether a customer-facing UI trigger is warranted or whether it's fully automatic (per Bastian's later comment) based on agent-heartbeat staleness.
**Technical notes:** Backup deletion already supports its own `force` flag (`snapshot_service.py`), so the "ensure backups don't hang in deleting state" part of the description is also close to being solved by an existing pattern, not a new concept. Open dependency: none technical, but a **product decision** (checkbox vs. automatic) is unresolved and gates the UI work. Linked ticket [[CRC-125|CRC-125]] is a thin milestone pointing back to this ticket — no independent content.
**Identification confidence:** High (backend code path confirmed by direct source read; UI pattern confirmed by existing danger-action components).

## 1. Goal & scope clarity

Objective and rationale are clear: hybrid cloud clusters can get stuck in `Deleting` state when the underlying infra is already gone, and self-service force deletion (plus force-deleting backups so they don't hang) is the fix. The description states this plainly and is not a placeholder.

**Acceptance criteria are unusually well-developed for a ticket without a formal AC field** — Josep Fornies' comment (2026-06-09) lists exactly what formal AC should cover: which resources get cleaned up (backups, PVCs, operator state), who can trigger it (customer vs. admin-only), and what's audit-logged. This reads as a solid AC draft, just not promoted to the `Acceptance Criteria` field (`customfield_10087` is empty) or a Notion doc.

**The scope has an internal contradiction that isn't resolved in the ticket**: Emruz Hossain's comment (2026-06-09) frames this as "just expose an existing option in public API and UI" (implying a user-facing control). Bastian Hofmann's comment two days later (2026-06-10) explicitly pushes back: *"I don't think we should add some kind of 'force delete' checkbox to the UI, but just assume that the cluster is successfully deleted if the agent has not reported back for a TBD time"* — i.e., no user control, an automatic timeout instead. Then Bastian's own follow-up comment on 2026-06-16 **reverses again**: *"If hybrid cloud, and if already deleting, add a button to force delete it for the customer with explanation why."* The ticket currently ends on the button approach, but the automatic-timeout idea was never formally retracted — this is a genuine open product decision, not just a formality.

## 2. UI / Design needs

**Design reuse (code `qdrant-cloud-ui`):** PARTIAL — a "danger action requiring explicit confirmation" pattern already exists: `src/components/HybridCloudEnvironments/DeletionDialog.tsx`, `HybridCloudCleanUpDialog.tsx`, and the shared `src/components/Common/ButtonDangerAction.tsx` / `ConfirmationDialogDangerAction.tsx`. A force-delete button for a stuck hybrid cloud cluster is a close variant of the existing hybrid-cloud-environment deletion flow. **Deduced from these patterns, no Figma found** — flagged as a Deduction to verify.

**Design / Figma:** No — checked all five places: design fields empty, no attachments, no `figma.com`/`notion.so` in description/AC/comments, `issuelinks` has only the CRC-125 relation (not a design), 0 remote links.

**Requires UI? Probable** — contingent on which side of the open product decision wins (button = yes; automatic timeout = no UI at all, or only a status message). This is the single blocker.

Missing design-asset checklist (only if the button approach is confirmed):

- [ ] Confirm button vs. automatic-timeout approach (blocks everything else in this axis)
- [ ] If button: light design for the trigger + confirmation copy explaining "we don't verify your infra is actually gone" (per the Observation field's warning requirement)

## 3. Size coherence (T-Shirt Size)

Size **XS** (factor 10).

> [!warning] Estimate alert (under/over-estimation risk)
> The backend `force` delete path is **verified to already exist** (`cluster_api/cluster/service/__init__.py:1525`, wired via `commands.py` for CLI/internal use, plus an equivalent `force` flag in backup deletion). That makes XS plausible for "expose what exists." But the ticket also carries an unresolved product decision (checkbox vs. automatic) plus new documentation/links work for "how to verify cleanup" the Observation field calls for — if the automatic-timeout path is chosen instead, that's a different (not obviously smaller) scope: agent-heartbeat staleness detection, a TBD timeout value, and no existing pattern for it. Realistic estimate stays **XS–S** once the product decision lands; flag for re-estimation after that decision, not before.

No re-scoring needed yet since XS is still plausible either way, but this is exactly the kind of "ranks near the top on an XS estimate" case the scope hand-off flagged for extra scrutiny — worth a second look once the UX approach is locked.

## 4. Prioritization (Impact / Confidence / Score)

| Variable | Value | Numeric |
|----------|-------|---------|
| Impact (calc) | Significant | 9 |
| Confidence (calc) | High | 9 |
| Size factor (XS) | — | 10 |
| **Score (RICE)** | — | **810** |

Model check: 9 × 9 × 10 = **810 ✓**.

Assessment: Impact=Significant is justified — stuck-deleting clusters are a real support burden and self-service resolution has clear customer + support value. Confidence=High is reasonable given the backend logic is confirmed to already exist (this isn't a speculative build). The Score correctly places this near the top of the 17-issue Q3 scope; the ranking is earned by real backend readiness, not an estimation artifact — **but it's earned assuming the small "expose it" scope, not the automatic-timeout alternative**, so the open product decision is worth resolving before treating 810 as final.

## Code reuse (`qdrant-cloud-cluster-api`, `qdrant-cloud-ui`)

**Verdict: PARTIAL — the hard part (safe force-deletion semantics) already exists; what's missing is exposure and a product decision on UX.**

**Already exists (reusable):**

- `cluster_api/cluster/service/__init__.py:1525` — `delete_cluster(cluster_id, db, *, commit=True, force=False)`, already handles forceful deletion "without k8s interaction."
- `cluster_api/cluster/commands.py:191,223,254` — CLI command already wires `force` through to the service (confirms Emruz's comment: "We already have respective functionality... We use it CLI").
- `cluster_api/cluster/backup/snapshot_service.py:290-352` — backups already support a `force` flag on delete, addressing the "backups do not hang in deleting state" requirement from the description.
- `src/components/HybridCloudEnvironments/DeletionDialog.tsx`, `Common/ButtonDangerAction.tsx` — UI pattern for a confirmed destructive hybrid-cloud action.

**New / to build:**

- Expose `force` through the public API (currently CLI/internal-only) — needs a protobuf field in `qdrant-cloud-public-api` if going that route.
- Permissions check for who can trigger it (customer vs. admin-only) — not yet defined per the AC draft comment.
- Audit-log entry for the action.
- UI trigger (button + confirmation dialog + explanatory copy) **if** the button approach is confirmed over the automatic-timeout alternative.
- Documentation links for customers to verify their infra is actually cleaned up (explicitly called out in the Observation field as still needed).

**Suggested approach:** Resolve the button-vs-automatic decision first (cheap, high-leverage); then reuse `delete_cluster(force=True)` and the backup `force` flag as-is, add the public API surface, and — only if the button path wins — reuse `DeletionDialog`/`ButtonDangerAction` rather than building new UI.

## Linked-ticket context

| Key | Relationship | Title | Figma | Notion | Slack | GitHub | Notes |
|-----|-------------|-------|-------|--------|-------|--------|-------|
| [[CRC-125|CRC-125]] | relates to | "Force delete hybrid cloud cluster" | None | None | None | None | Thin Milestone (status To Do) that just points back to PM-313 for details ("Details will be defined in PM-313"); imported from GitHub issue qdrant/cloud-pm#717. No additional signals beyond confirming the same scope. |

`subtasks: []`, `linked_issues: [CRC-125]`. child_context: full (CRC-125 fetched and hunted; 0 remote links on it).

## Notion context

No Notion links found — notion: none.

## Definition of Ready (DoR)

> [!warning] Verdict: 🟡 ALMOST READY — pending resolution of the button-vs-automatic-timeout decision; everything else (backend readiness, scope, scoring) checks out

| DoR criterion | Status |
|---|---|
| Objective / description clear | ✅ |
| Acceptance criteria defined | ⚠️ |
| Well scoped (realistic size, not an épic) | ✅ |
| Scoring complete (Impact·Confidence·Size) | ✅ |
| Design / UI available | 🔎 |
| Extrapolable from existing code/contract | ✅ |
| Context sufficient | ✅ |

**Deductions to verify:**
- UI pattern = `DeletionDialog`/`ButtonDangerAction` family — basis: analogous existing hybrid-cloud destructive-action dialogs; confidence: Medium (contingent on the button approach winning at all); confirm by: PM/eng decision on button vs. automatic timeout, then designer sign-off that the existing pattern covers the "explanation why" copy requirement.

**To be ready it needs:** Missing definitions / AC formally — promote the AC already drafted in comments (resource cleanup list, trigger permissions, audit logging) to the Acceptance Criteria field, and resolve the single open blocker: confirm whether this ships as a customer-facing button or an automatic agent-timeout with no UI control. Once that's decided, this is ready to plan.

---
ticket: PM-327
aliases: ["PM-327"]
title: "Make VolumeAttributesClass configurable in hybrid cloud"
type: Objective
status: Ready for planning
bucket: 2026-Q3
objective_class: Standard
owner: Bastian Hofmann
priority: Medium
domain: Clusters
carryover: true
size: XS
size_factor: 10
impact: null
confidence: null
score: 0
scoring_complete: false
requires_ui: true
design_linked: false
design_source: none
design_reuse: PARTIAL
code_reuse: PARTIAL
repos: [operator, kubernetes-api, qdrant-cloud-cluster-api, qdrant-cloud-ui, qdrant-cloud-public-api, qdrant-cloud-agent]
notion: none
slack_context: none
github_context: read
subtasks: []
linked_issues: []
child_context: none
dor: not-ready
jira: https://qdrant.atlassian.net/browse/PM-327
tags: [backlog-audit, ticket, PM, readiness/not-ready]
---

# PM-327 · Make VolumeAttributesClass configurable in hybrid cloud

> [!tldr] 🔴 NOT READY · Score 0 (XS, scoring incomplete) · **best-documented ticket in this batch** but Impact/Confidence are both unset, and it hard-depends on an open external PR that hasn't merged

**Type:** Objective · **Sprint:** 2026-Q3 (carried over — comment "Carry over to Q3" from Dani Terrín, 2026-06-12) · **Status:** Ready for planning · **Objective Class:** Standard · **Owner:** Bastian Hofmann · **Priority:** Medium
**Link:** [PM-327](https://qdrant.atlassian.net/browse/PM-327) · **Reporter:** Bastian Hofmann · **Domain:** Clusters · **Created/Updated:** 2026-03-03 / 2026-06-25
**Subtasks:** none
**Linked issues:** none (no `issuelinks`, no Jira remote links — dependency is expressed only as prose + a GitHub PR link)
**Related:** same domain as [[PM-313-force-deletion-hybrid-cloud-clusters|PM-313]] (both Hybrid Cloud cluster-lifecycle features in this scope)

---

## Audit summary

| Axis | Verdict | Short note |
|------|---------|------------|
| 1. Goal & scope | OK | Unusually thorough description with verified code citations; two open product questions already answered in comments |
| 2. UI / Design | Risk | No Figma; **deduced PARTIAL reuse** from existing storage-tier selector pattern |
| 3. Size (XS) | Risk | **XS looks optimistic — spans operator, CRD, DB/API, agent, UI, and Terraform, gated on an external open PR** |
| 4. Prioritization (Score 0) | Risk | **Impact and Confidence both unset → Score 0, invisible in ranking despite being past Idea Intake and well-documented** |

## Project & technical notes

**Project(s):** `operator` (Go) and `kubernetes-api` (Go) — CRD field + PVC application logic, already implemented; `qdrant-cloud-cluster-api` (Python) — DB column exists, `cr_service.py` needs to actually send the field to the operator (currently doesn't); `qdrant-cloud-agent` (Go) — must report available VAC classes per environment (blocked on open PR #646); `qdrant-cloud-ui` (React/TS) — needs a selection UI; `terraform-provider-qdrant-cloud` — optional extension mentioned as "may also want."
**How it'd be done (high level):** Land `qdrant-cloud-agent` PR #646 (reports available `VolumeAttributesClasses` per environment), wire the already-stored `volume_attributes_class` DB value into `cr_service.py`'s CR-building step (currently a no-op for this field), add environment-aware validation, and add a UI dropdown analogous to the existing disk-speed/storage-tier selector.
**Technical notes:** This is a genuine cross-repo, multi-team feature (six repos touch it, one is a hard external dependency). Hidden risk: the PR #646 dependency is outside this team's direct control and is still open — the ticket cannot start end-to-end work until it merges, even though most of the code-reading work here is already done.
**Identification confidence:** High for the repos and gaps (author's own code citations verified line-by-line against source); Medium for total effort, given the cross-repo span and the unmerged dependency's own scope is unknown to this audit.

## 1. Goal & scope clarity

This is the best-scoped ticket in the batch by a wide margin. The description states a clear goal ("Let Hybrid Cloud customers select and change a `VolumeAttributesClass` for their cluster volumes"), cites exactly what already exists with file:line references, and lists precisely what's still missing (report available VAC classes per environment — open PR; render the per-cluster VAC into the CR — currently omitted; validate against environment; expose in UI). **All three code citations were verified directly against source in this audit** (operator PVC logic, kubernetes-api CRD field + mutual-exclusivity validation, cluster-api DB column) and are accurate.

Both open questions listed in the description were already answered in a follow-up comment thread (Bastian Hofmann, 2026-06-24): VAC is per-cluster only (no environment default), and VAC and storage-tier IOPS/throughput are mutually exclusive by product design (VAC = Hybrid Cloud only, storage tiers = Managed Cloud only) — this matches the mutual-exclusivity check already found in `kubernetes-api`. **The requirements are effectively fully captured across the description + comments**, just not consolidated into the Acceptance Criteria field (empty).

The explicit hard dependency — "agent PR #646 must land first" — is named in the description, which is good practice; it's the ticket's biggest real risk, not a gap in understanding.

## 2. UI / Design needs

**Design reuse (code `qdrant-cloud-ui`):** PARTIAL — `src/components/Clusters/shared/ClusterSettings/Base/ClusterSettingsDiskSpeedForm.tsx` and `ClusterScaleSettingsDiskSpeed.tsx` are close analogues: an existing storage-configuration selector pattern in the same cluster-settings area. A VAC dropdown (as the description itself proposes: "a dropdown for QC to select VolumeAttributesClass" — quoting the related Story CRC-1960) is a small variation of this. **Deduced from these patterns, no Figma found** — flagged as a Deduction to verify.

**Design / Figma:** No — checked all five places: design fields empty, no attachments, no `figma.com` in description/AC/comments, no `issuelinks`, 0 remote links. One `github.com` link is present in a comment (see GitHub context below) but it points to source code, not a design artifact.

**Requires UI? Yes** — the description explicitly calls for "expose it in the UI (selection + modification status)."

Missing design-asset checklist:

- [ ] Dropdown/selector mockup for VAC choice (or explicit confirmation the disk-speed selector pattern is close enough to skip a new design)
- [ ] "Modification status" UI state (in progress / applied / failed) — no existing pattern identified for this specific piece

## 3. Size coherence (T-Shirt Size)

Size **XS** (factor 10).

> [!warning] Estimate alert (under/over-estimation risk)
> XS is hard to square with the scope described: six repos (`operator`, `kubernetes-api`, `qdrant-cloud-cluster-api`, `qdrant-cloud-agent`, `qdrant-cloud-ui`, optionally `terraform-provider-qdrant-cloud`), one of which is gated on an **open, unmerged, cross-team PR** this ticket doesn't control the timeline of. Even though most of the code-reading is done and several pieces already exist, "wire N already-existing pieces together across 6 repos, blocked on someone else's PR" is a classic **hidden-scope-under-a-small-estimate** pattern the audit method explicitly warns about. Realistic estimate **S**, and possibly not startable at all until PR #646 merges — review before committing to a sprint.

Re-scoring isn't meaningful yet since Impact/Confidence are both null (Score is already 0) — but once those are set, re-estimating from XS(10) to S(8) would cut whatever Score results by 20%.

## 4. Prioritization (Impact / Confidence / Score)

| Variable | Value | Numeric |
|----------|-------|---------|
| Impact (calc) | **not set** | null |
| Confidence (calc) | **not set** | null |
| Size factor (XS) | — | 10 |
| **Score (RICE)** | — | **0** |

Model check: incomplete — Impact and Confidence are both null; Size (XS/10) is the only factor present. Per the scope hand-off's verified model, this is **scoring incomplete**, not a formula defect (consistent with PM-505 and PM-524, the other two Score=0 issues in this scope).

Assessment: **This is the most surprising gap in the batch** — of the three Score=0 tickets flagged by the scope hand-off, PM-327 has by far the most complete description, verified code citations, and already-resolved open questions. It is also past Idea Intake (status "Ready for planning," same as PM-313) and has been carried over from a prior quarter. There's no principled reason visible in the ticket for Impact/Confidence to be missing — this reads as an oversight during refinement rather than a genuine unknown, and is cheap to fix relative to the ticket's actual readiness.

## Code reuse (`operator`, `kubernetes-api`, `qdrant-cloud-cluster-api`, `qdrant-cloud-ui`)

**Verdict: PARTIAL — most of the backend plumbing already exists; the gap is wiring + exposure, gated by one external dependency.**

**Already exists (reusable, all verified in this audit):**

- `operator/pkg/controller/qdrant_cluster_pvc.go:154-172` — applies `VolumeAttributesClassName` to PVCs when configured, including existence-check against the k8s cluster.
- `kubernetes-api/api/v1/qdrantcluster_types.go:861-863,931-935` — `Storage.VolumeAttributesClassName` field plus `Validate()` enforcing mutual exclusivity with IOPS/Throughput.
- `kubernetes-api/api/v1/region_types.go:116-118` — `VolumeAttributesClasses` field on the region capability list (the shape PR #646 will populate).
- `qdrant-cloud-cluster-api/cluster_api/cluster/models_db.py:611` — `volume_attributes_class` DB column already exists (migration `ef78f892e26e`), plus the field in the public API's `cluster.proto` (`ClusterStorageConfiguration.volume_attributes_class`).
- `src/components/Clusters/shared/ClusterSettings/Base/ClusterSettingsDiskSpeedForm.tsx` (qdrant-cloud-ui) — analogous storage-config selector UI pattern.

**New / to build:**

- `qdrant-cloud-agent` PR #646 — reports available `VolumeAttributesClasses` per environment (**open, unmerged** — confirmed via `gh`: state OPEN, title `[PE-66] Report VolumeAttributesClasses in hybrid cloud environment status`).
- `cluster_api/cr_service.py` — currently builds `spec.storage` but never reads `volume_attributes_class` into it (confirmed: zero references to the field in this file) — needs to be added.
- Environment-aware validation of the chosen VAC (does the environment actually support it).
- UI dropdown + modification-status UI in `qdrant-cloud-ui`.
- Optional: Terraform provider support, explicitly flagged as a "may also want," aligned with a separate ticket (CRC-2067).

**Suggested approach:** Track PR #646 as the critical-path blocker; once merged, the remaining work is largely wiring existing fields end-to-end plus a UI dropdown reusing the disk-speed selector pattern — genuinely close to the ticket's own XS/S estimate once unblocked.

## Linked-ticket context

No linked tickets via `issuelinks` or Jira remote links — `subtasks: []`, `linked_issues: []`, child_context: none. Two related items were surfaced from prose/code rather than Jira links and followed per the skill's external-link rules:

- **CRC-1960** ("Make VolumeAttributesClass configurable in hybrid cloud", Story, status To Do) — resolves from the description's "PE-66" reference. Not a formal Jira link on PM-327 (found via JQL lookup, not `issuelinks`/remote links), so not counted toward `linked_issues`; noted here for context only. Its description matches PM-327 almost verbatim (config in hybrid cloud, push available VAC classes, UI dropdown) — likely the CRC-project breakdown of this same Objective.
- **GitHub PR #646** (`qdrant/qdrant-cloud-agent`) — fetched via `gh`: title `[PE-66] Report VolumeAttributesClasses in hybrid cloud environment status`, state **OPEN**, empty body. Confirms the description's claim that this PR is real, open, and the named dependency. `github_context: read`.

## Notion context

No Notion links found — notion: none.

## Definition of Ready (DoR)

> [!danger] Verdict: 🔴 NOT READY — scoring incomplete (Score 0) and hard-blocked on an unmerged external PR; otherwise the best-documented ticket in this batch

| DoR criterion | Status |
|---|---|
| Objective / description clear | ✅ |
| Acceptance criteria defined | ⚠️ |
| Well scoped (realistic size, not an épic) | ⚠️ |
| Scoring complete (Impact·Confidence·Size) | ❌ |
| Design / UI available | 🔎 |
| Extrapolable from existing code/contract | ✅ |
| Context sufficient | ✅ |

**Deductions to verify:**
- UI pattern = disk-speed/storage-tier selector family (`ClusterSettingsDiskSpeedForm.tsx`) — basis: analogous existing storage-configuration selector in the same settings area; confidence: Medium (covers selection, not the "modification status" UI state the description also asks for); confirm by: designer/eng confirmation that the existing pattern extends cleanly to VAC, and a decision on how modification status is surfaced.

**To be ready it needs:** Incomplete scoring — set Impact and Confidence (this looks like a refinement oversight, not a genuine unknown, given how complete the rest of the ticket is) — **and** resolve the "not well scoped" risk from Axis 3: confirm the realistic size (XS vs. S) given the 6-repo span, and make the PR #646 dependency an explicit blocker/gate before this enters a sprint, since work can't complete end-to-end until it merges.

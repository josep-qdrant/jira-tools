---
ticket: PM-345
aliases: ["PM-345"]
title: "Allow Hybrid Cloud support bundle creation from admin and cloud ui"
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
impact: 9
confidence: 9
score: 648
scoring_complete: true
requires_ui: true
design_linked: false
design_source: none
design_reuse: PARTIAL
code_reuse: PARTIAL
repos: [qdrant-cloud-agent, qdrant-cloud-cluster-api, qdrant-cloud-ui, qdrant-cloud-admin-v2]
notion: none
slack_context: none
github_context: read
subtasks: []
linked_issues: []
child_context: none
dor: not-ready
jira: https://qdrant.atlassian.net/browse/PM-345
tags: [backlog-audit, ticket, PM, readiness/not-ready]
---

# PM-345 · Allow Hybrid Cloud support bundle creation from admin and cloud ui

> [!tldr] 🔴 NOT READY · Score 648 (S) · **no AC, no design, and the PM's own review comment lists four open decisions (bundle contents, phase-1 scope, security review) still unresolved**

**Type:** Objective · **Sprint:** 2026-Q3 (not carryover — created 2026-03-13) · **Status:** Backlog · **Objective Class:** Standard · **Owner:** unassigned · **Priority:** Medium
**Link:** [PM-345](https://qdrant.atlassian.net/browse/PM-345) · **Reporter:** Bastian Hofmann · **Domain:** Clusters · **Created/Updated:** 2026-03-13 / 2026-06-25
**Subtasks:** none
**Linked issues:** none
**Related:** same Hybrid Cloud admin-tooling theme as [[PM-430-multi-az-hybrid-cloud|PM-430]]; mentions [CRS-1790](https://qdrant.atlassian.net/browse/CRS-1790) (Agent job-claiming/trigger system, In Review) as a possible implementation vehicle, in a review-comment aside — not a formal link

---

## Audit summary

| Axis | Verdict | Short note |
|------|---------|------------|
| 1. Goal / scope | Risk | Objective is clear in one line, but PM's own review comment lists 4 unresolved scoping questions (bundle contents/security, phase-1 UI-vs-CLI split, prior-art check) |
| 2. UI / Design | Risk | **No Figma; a UI button + async-status pattern is only sketched in a comment, not the AC field** |
| 3. Size (S) | Risk | **S likely hides new agent/job-trigger plumbing, security review, and upload storage — the reporter's own comment defers the storage design to a "technical design document"** |
| 4. Prioritization (Score 648) | OK | Impact/Confidence justified by an explicit support pain-point quote; arithmetic holds |

## Project & technical notes

**Project(s):** `qdrant-cloud-agent` (leader — must trigger bundle creation in-cluster and use its permissions) and `qdrant-cloud-cluster-api` (job orchestration/API); secondary: `qdrant-cloud-ui` (customer-facing trigger button) and `qdrant-cloud-admin-v2` (admin-side trigger, if built first per the phase-1 comment).
**How it'd be done (high level):** Wrap the existing client-side `support-bundle.sh` collection logic (see below) into an in-cluster job the agent can trigger and run with its own kubeconfig, then upload the resulting archive to Qdrant-owned storage and surface it to admins/support; expose a UI trigger once the underlying job mechanism exists.
**Technical notes:** No job-triggering mechanism exists yet in `qdrant-cloud-agent` today (`rg -i job` found nothing) — this needs the same "agent claims and runs a job" pattern that [CRS-1790](https://qdrant.atlassian.net/browse/CRS-1790) is building for a different purpose (referenced by the reporter as a possible shared vehicle). Security/privacy of bundle contents is explicitly unresolved per the PM's own comment.
**Identification confidence:** Medium (repos are right, but the mechanism — how the agent gets a job to run and returns a result — doesn't exist yet in any repo checked, so "how" is still open).

## 1. Goal & scope clarity

The description is a clear, real objective (not a placeholder): let admins/users trigger support-bundle creation from the cloud UI or an admin interface, running as a job in the customer's Kubernetes cluster, auto-uploaded for support to pick up. That's a legitimate, well-motivated ask — the PM's own "Objective review" (customfield `Observation`) cites a concrete pain point: *"Support has asked for this. Customers reported it is really annoying to have to execute scripts locally... This has already failed multiple times before."*

But the same review comment is explicit that **four decisions remain open**, not yet folded into the ticket body:
1. Confirm whether a prior bundle generator exists in any repo (it does — a client-side bash script in `qdrant-cloud-support-tools`, see Code reuse — but this wasn't verified against the *server-side* automation path needed here).
2. Bundle contents and privacy/security constraints — explicitly unresolved ("what can/cannot be included").
3. AC and UI design for an "async action with status" pattern — not written anywhere.
4. Phase-1 scope: UI vs admin-CLI first — undecided (comment says "if Hybrid Cloud is not available yet, admin CLI is sufficient", implying the decision may already be forced by timing, but nothing confirms it).

There's no formal Acceptance Criteria (`customfield_10087` is null) and no Draft Requirements. This is a real objective with real substance behind it, but it's pre-refinement — closer to "well-motivated idea" than "ready to build."

## 2. UI / Design needs

**Design reuse (code `qdrant-cloud-ui`):** PARTIAL — deduced. The comment names the exact UI location ("Button on the hybrid cloud env page in the actions drop down") and an interaction pattern ("async action with status"), which strongly resembles an existing long-running-action pattern (e.g. snapshot/restore triggers elsewhere in the product). However, a targeted search of `qdrant-cloud-ui/src` for an existing actions-dropdown or backup/async-status component turned up no direct hits, so I cannot cite a specific component to reuse — **treat this as 🔎 deduced, not confirmed** (see design-link-hunt default-to-deducible rule).

**Design / Figma:** No — checked all five places: `Concept Design` (customfield_10095) null, `UX Designs` (customfield_10096) null, `Technical Documentation` (customfield_10097) null; 0 attachments; description and AC contain no `figma.com`/`notion.so` URL; 0 issuelinks; 0 remote links (`getJiraIssueRemoteIssueLinks` returned `[]`).

**Requires UI? Yes** — a trigger button in the Hybrid Cloud environment's actions dropdown (cloud UI) and/or an admin-side equivalent, plus a status indicator while the bundle job runs.

Missing design-asset checklist:

- [ ] Figma or wireframe for the trigger button + async status states (queued / running / done / failed)
- [ ] Decision: is the async-status pattern actually shared with an existing feature, or net-new?
- [ ] AC defining what "done" looks like for the user (bundle ready notification, link to support ticket, etc.)

## 3. Size coherence (T-Shirt Size)

Size **S** (factor 8).

> [!warning] Estimate alert (under/over-estimation risk)
> **S likely underestimates this.** The PM's own comment defers "storage of the bundle at our end and how to link it to the support ticket" to a not-yet-written technical design doc, and flags that the agent/job component needs new permissions to be configured. That's: (1) a new agent job-trigger mechanism (none exists today — verified by code search), (2) a data/privacy review of bundle contents, (3) new upload/storage wiring, and (4) a UI trigger with async status — four non-trivial workstreams under one "S". Realistic estimate **M**; review before committing.

Recomputing with **M** (factor 6): 9 × 9 × 6 = **486** (down from 648, a 25% drop) — this would move PM-345 several ranks down among the 2026-Q3 set (below PM-509's 432 territory but likely still above PM-529/PM-164's 288).

## 4. Prioritization (Impact / Confidence / Score)

| Variable | Value | Numeric |
|----------|-------|---------|
| Impact (calc) | Significant | 9 |
| Confidence (calc) | High | 9 |
| Size factor (S) | — | 8 |
| **Score (RICE)** | — | **648** |

Model check: 9 × 9 × 8 = **648 ✓**

Assessment: Impact=Significant is well-supported (explicit support quote about repeated script failures and turnaround time). **Confidence=High is questionable given the reporter's own four open questions** — High confidence usually implies the team knows how to build it, but the mechanism (agent job-triggering) doesn't exist yet and the storage/security design is explicitly deferred. This reads more like Medium confidence. If Confidence dropped to Medium (6): 9 × 6 × 8 = 432, a meaningful rank change.

## Code reuse (`qdrant-cloud-agent`, `qdrant-cloud-cluster-api`)

**Verdict: PARTIAL — the data-collection logic is proven and reusable client-side, but the server-side trigger/upload path is entirely new.**

**Already exists (reusable):**

- `qdrant-cloud-support-tools/support-bundle/support-bundle.sh` (GitHub, confirmed via `gh api`) — a working, documented bash script that already collects exactly the data this objective needs (CR statuses, pod logs, k8s version, Qdrant telemetry) via `kubectl`. It requires local `kubectl` + `jq` and is run manually today — this is the pain point the objective aims to remove, and its collection logic (resource list, kubectl describe commands) can likely be ported almost directly into an in-cluster job.

**New / to build:**

- An agent-side job-trigger/claim mechanism (none exists in `qdrant-cloud-agent` today — confirmed by code search for "job")
- Server-side orchestration to invoke the job and track status (`qdrant-cloud-cluster-api`)
- Upload path from the customer's cluster to Qdrant-owned storage, with a link-to-ticket flow
- UI trigger + async status component (cloud UI and/or admin v2)

**Suggested approach:** Port the existing shell script's collection logic into a Kubernetes Job template the agent can launch; reuse [CRS-1790](https://qdrant.atlassian.net/browse/CRS-1790)'s in-flight job-claiming RPC pattern (Platform API job system) rather than building a second, parallel mechanism — worth a direct conversation with that ticket's owner before scoping this further.

## Linked-ticket context

No linked tickets — child_context: none. (CRS-1790 is mentioned only inside a free-text review comment, not in `subtasks`, `issuelinks`, or remote links, so it isn't chased as a formal one-hop link; noted above for awareness only.)

## Notion context

No Notion links found — notion: none.

## Definition of Ready (DoR)

> [!danger] Verdict: 🔴 NOT READY — no AC, no design, and the reporter's own comment lists four unresolved scoping/security questions

| DoR criterion | Status |
|---|---|
| Objective / description clear | ✅ |
| Acceptance criteria defined | ❌ |
| Well scoped (realistic size, not an épic) | ⚠️ |
| Scoring complete (Impact·Confidence·Size) | ✅ |
| Design / UI available | 🔎 deduced (to verify) |
| Extrapolable from existing code/contract | 🔎 deduced (to verify) |
| Context sufficient | ⚠️ |

**Deductions to verify:**
- UI reuses an existing "actions dropdown + async status" pattern — basis: the reporter's own comment names the exact UI location and interaction shape, but no matching component was found in a targeted `qdrant-cloud-ui` source search; confidence: Low; confirm by: designer/frontend eng confirming which existing async-action component (if any) this should extend.
- The bundle-collection logic can be ported from the existing `support-bundle.sh` script into an in-cluster job — basis: analogous script already collects the exact data needed; confidence: Medium; confirm by: an engineer scoping the agent-side job mechanism against the script's resource list.

**To be ready it needs:** Missing definitions/AC (write AC and resolve the four open questions from the PM's own review comment — bundle content/security scope, phase-1 UI-vs-CLI decision) and missing UI/design (at least a wireframe of the trigger + status flow). Also revisit the estimate — see the size-coherence alert above (S likely hides an M-sized effort once the new agent job-trigger mechanism is counted).

---
ticket: PM-524
aliases: ["PM-524"]
title: "Hybrid Cloud integration tests - Real K8s clusters"
type: Objective
status: Technical Design
bucket: 2026-Q3
objective_class: Standard
owner: unassigned
priority: Medium
domain: Clusters
carryover: false
size: S
size_factor: 8
impact: null
confidence: null
score: 0
scoring_complete: false
requires_ui: false
design_linked: false
design_source: none
design_reuse: N/A
code_reuse: PARTIAL
repos: [qdrant-cloud, qdrant-cloud-platform-api]
notion: none
slack_context: none
github_context: none
subtasks: []
linked_issues: [CRS-1923]
child_context: full
dor: not-ready
jira: https://qdrant.atlassian.net/browse/PM-524
tags: [backlog-audit, ticket, PM, readiness/not-ready]
---

# PM-524 · Hybrid Cloud integration tests - Real K8s clusters

> [!tldr] 🔴 NOT READY · Score 0 (S) · Scoring incomplete (Impact/Confidence unset) and **blocked on an unscoped dependency** (CRS-1923, still in Backlog)

**Type:** Objective · **Sprint:** 2026-Q3 (label `2026-Q3`, no carryover) · **Status:** Technical Design · **Objective Class:** Standard · **Owner:** unassigned · **Priority:** Medium
**Link:** [PM-524](https://qdrant.atlassian.net/browse/PM-524) · **Reporter:** Bastian Hofmann · **Domain:** Clusters · **Created/Updated:** 2026-06-16 / 2026-06-25
**Subtasks:** none
**Linked issues:** CRS-1923 (depends on) — no card in this vault (different project, Cloud Resilience)
**Related:** none found in this batch

---

## Audit summary

| Axis | Verdict | Short note |
|------|---------|------------|
| 1. Goal / scope | Risk | One-liner description; no AC, no test-matrix definition |
| 2. UI / Design | N/A | Pure CI/test-infra ticket, no UI surface |
| 3. Size (S) | Risk | **S/8 likely underestimates a multi-cloud (EKS/AKS/GKE) test-infra build-out** |
| 4. Prioritization (Score 0) | Risk | **Already in "Technical Design" status with Impact/Confidence still unset** |

## Project & technical notes

**Project(s):** `qdrant-cloud` (leader — owns the current k3d-based acceptance-test CI workflow) and `qdrant-cloud-platform-api` (secondary — owns the CR-driven regional cluster provisioning the tests would call into, per its dependency CRS-1923).
**How it'd be done (high level):** Extend the existing k3d-based Hybrid Cloud acceptance-test workflow to also provision real EKS/AKS/GKE clusters (via the Platform API once CRS-1923 lands), run the same Hybrid Cloud installation/assertion suite against them, and tear the clusters down after.
**Technical notes:** Hard-blocked on **CRS-1923** ("Extend Platform API to create vanilla Kubernetes clusters to use for Hybrid Cloud testing"), which is itself in `Backlog` status in a different project (Cloud Resilience) — this PM ticket cannot start independently. CRS-1923 also references **PM-189** as its parent Product Objective, a ticket outside this batch/scope.
**Identification confidence:** Medium (the "leader" repo — where the new test code actually lives — is inferred from where the current k3d suite runs; not confirmed in the ticket text).

## 1. Goal & scope clarity

The description is a single line: *"We have them with K3d, goal is to add advanced ones with more features for EKS, AKS, GKE."* There is no Acceptance Criteria (`customfield_10087` is null), no Draft Requirements, and no test-plan or scope boundary (which clusters/versions, which Hybrid Cloud features must pass, is this one test suite for all three clouds or three separate suites). **The ticket is dependent on CRS-1923 for its actual mechanism (how real clusters get created) but doesn't say so in its own description** — the dependency is visible only via `issuelinks`, not the narrative.

## 2. UI / Design needs

**Design reuse (code):** N/A — backend/CI test-infrastructure work, no user-facing surface.

**Design / Figma:** No — design fields empty (Concept Design, UX Designs, Technical Documentation all null), no attachments, 0 remote links. Expected for this ticket type; not a gap.

**Requires UI? No.**

## 3. Size coherence (T-Shirt Size)

Size **S** (factor 8).

> [!warning] Estimate alert (under/over-estimation risk)
> An S estimate covers roughly one feature increment. This ticket implies wiring three separate cloud-provider integration paths (EKS, AKS, GKE) into CI, each with its own IAM/networking/quota setup, plus teardown and flake-handling — on top of a hard dependency (CRS-1923) that isn't even scoped yet. Realistic estimate is **at least M, plausibly L** once CRS-1923's shape is known; review before committing to S.

Recompute is not meaningful yet since Impact/Confidence are also unset (Score is 0 either way), but at Impact=6/Confidence=6 (typical for this domain) an M size (factor 6) would give 216, an L (factor 4) would give 144 — both far below where S/8 would rank it if scored today.

## 4. Prioritization (Impact / Confidence / Score)

| Variable | Value | Numeric |
|----------|-------|---------|
| Impact (calc) | not set | null |
| Confidence (calc) | not set | null |
| Size factor (S) | — | 8 |
| **Score (RICE)** | — | **0** |

Model check: incomplete — missing Impact/Confidence → Score 0 (confirmed against the verified scope-hand-off model).

Assessment: **this ticket has already progressed to "Technical Design" status while still scoring 0** — it is invisible in any Score-based ranking despite being actively worked. That's a process gap worth flagging to the PM independent of the audit: status and scoring are out of sync.

## Code reuse (`qdrant-cloud`, `qdrant-cloud-platform-api`)

**Verdict: PARTIAL — the CI harness pattern exists (k3d suite); the multi-cloud provisioning path does not yet exist anywhere.**

**Already exists (reusable):**

- `qdrant-cloud/.github/workflows/qdrant-db-acceptance-checks.yaml` — installs k3d (`nolar/setup-k3d-k3s`) and creates a `k3d cluster create test` for the current Hybrid Cloud acceptance suite. This is the harness to extend.
- `qdrant-cloud-platform-api/scripts/setup-local-k8s.sh` — already spins up a local `k3d` cluster for Platform API development, confirming k3d is the team's established local/CI cluster tool.

**New / to build:**

- The actual EKS/AKS/GKE cluster creation path — this doesn't exist in `qdrant-cloud-platform-api` yet; it is exactly the scope of the still-`Backlog` dependency **CRS-1923**.
- CI wiring to run the existing Hybrid Cloud test suite against a real cloud cluster instead of (or in addition to) k3d, plus teardown.

**Suggested approach:** Do not start PM-524 implementation before CRS-1923 is at least sized and scheduled; reuse the existing acceptance-checks workflow structure and swap in real-cluster provisioning once the Platform API extension exists.

## Linked-ticket context

| Key | Relationship | Title | Figma | Notion | Slack | GitHub | Notes |
|-----|-------------|-------|-------|--------|-------|--------|-------|
| CRS-1923 | depends on (outward) | "Extend Platform API to create vanilla Kubernetes clusters to use for Hybrid Cloud testing" | None | None | None | None | Status **Backlog** (Cloud Resilience project) — the actual multi-cloud provisioning work PM-524 needs; itself references Product Objective PM-189 (out of this batch's scope). No additional signals beyond the dependency. |

## Notion context

No Notion links found — notion: none.

## Definition of Ready (DoR)

> [!danger] Verdict: 🔴 NOT READY — one-line description, no AC, Score incomplete, and hard-blocked on an unscoped cross-project dependency

| DoR criterion | Status |
|---|---|
| Objective / description clear | ⚠️ |
| Acceptance criteria defined | ❌ |
| Well scoped (realistic size, not an épic) | ⚠️ |
| Scoring complete (Impact·Confidence·Size) | ❌ |
| Design / UI available | N/A |
| Extrapolable from existing code/contract | ⚠️ |
| Context sufficient | ❌ |

**Deductions to verify:** none — all gaps here are stated facts (missing fields), not extrapolations.

**To be ready it needs:** Incomplete scoring (set Impact/Confidence so it's rankable at all) + Missing context (the dependency on CRS-1923 needs to be explicit in the description, and CRS-1923 itself needs a size/timeline before PM-524 can be committed) + Missing definitions/AC (define which cloud providers, which Hybrid Cloud features, and pass/fail criteria for the new suite).

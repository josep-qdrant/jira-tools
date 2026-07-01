---
ticket: PM-453
aliases: ["PM-453"]
title: "Improve load balancing setup - Step 2: Migrate to envoy and route manager"
type: Objective
status: In Progress
bucket: 2026-Q3
objective_class: Standard
owner: Robert Stam
priority: Medium
domain: Platform
carryover: true
size: S
size_factor: 8
impact: 9
confidence: 9
score: 648
scoring_complete: true
requires_ui: false
design_linked: false
design_source: none
design_reuse: N/A
code_reuse: PARTIAL
repos: [qdrant-cloud-route-manager, qdrant-cloud-envoy, qdrant-cloud-cluster-api]
notion: none
slack_context: none
github_context: none
subtasks: []
linked_issues: [PM-312, CP-458, PM-184]
child_context: full
dor: almost-ready
jira: https://qdrant.atlassian.net/browse/PM-453
tags: [backlog-audit, ticket, PM, readiness/almost-ready]
---

# PM-453 · Improve load balancing setup - Step 2: Migrate to envoy and route manager

> [!tldr] 🟡 ALMOST READY · Score 648 (S) · already In Progress with its design/PoC dependencies Done — the one gap is a rollout/migration plan for the live Traefik→Envoy cutover, not missing from scratch

**Type:** Objective · **Sprint:** 2026-Q3 (carryover — created 2026-05-05, explicit "Carry over to Q3" comment on 2026-06-12) · **Status:** In Progress · **Objective Class:** Standard · **Owner:** Robert Stam · **Priority:** Medium
**Link:** [PM-453](https://qdrant.atlassian.net/browse/PM-453) · **Reporter:** Bastian Hofmann · **Domain:** Platform · **Created/Updated:** 2026-05-05 / 2026-06-25
**Subtasks:** none
**Linked issues:** [[PM-312-decide-on-solution|PM-312]] (depends on, Done), [[CP-458-poc-route-manager|CP-458]] (depends on, Done), [[PM-184-s3-collection-snapshots|PM-184]] (is required by — likely a stale/unrelated auto-link, see below)
**Related:** Step 1 of the same initiative; a PM-312 engineering comment separately references **PM-364** "Multi AZ - Topology aware LB routing" (In Progress) as also depending on PM-312 — a second, adjacent consumer of this migration not fetched here (outside PM-453's own one-hop links)

---

## Audit summary

| Axis | Verdict | Short note |
|------|---------|------------|
| 1. Goal / scope | Risk | Goal is a clear one-liner ("migrate from Traefik to Envoy/route-manager") but has zero AC and no written rollout/cutover plan |
| 2. UI / Design | N/A | Pure infrastructure migration, no user-facing UI |
| 3. Size (S) | Risk | **S is plausible for the code migration itself (route-manager/Envoy chart already built and PoC'd), but a live-traffic cutover for a load-balancing layer carries rollback/rollout risk that "S" doesn't visibly account for** |
| 4. Prioritization (Score 648) | OK | Impact/Confidence justified — this is a de-risked continuation of Step 1, not a fresh bet; the two Done dependencies back up High confidence |

## Project & technical notes

**Project(s):** `qdrant-cloud-route-manager` (leader — the gRPC service that drives Envoy via xDS, confirmed as a real, substantial Go codebase with a health/drain helper matching the described architecture) and `qdrant-cloud-envoy` (the Helm chart deploying Envoy + route-manager's health/drain sidecar, confirmed via its README); secondary: `qdrant-cloud-cluster-api` (wherever Traefik routes are currently provisioned, needs the cutover logic).
**How it'd be done (high level):** Deploy `qdrant-cloud-envoy` alongside the existing Traefik-based routing, point `qdrant-cloud-route-manager` at it via xDS, and migrate clusters/regions over — likely gradually, given this affects live customer traffic routing.
**Technical notes:** The PoC (CP-458) and the solution decision (PM-312) are both Done, so the *architecture* risk is retired. What's not visible in the ticket is the *rollout* plan: order of regions/environments, rollback path if Envoy misbehaves under load, and how long Traefik stays running in parallel. **This is the one open risk, not the underlying tech choice.**
**Identification confidence:** High — both target repos exist, are real Go services (not placeholders), and their READMEs/file layout match exactly what the objective describes (Envoy chart + route-manager gRPC/xDS driver with a health/drain helper).

## 1. Goal & scope clarity

The description is a real, if brief, objective: *"Envoy and route manager performs very well in benchmarks. We want to migrate from Traefik to it."* That's clear intent, and it's backed by real prior work — Step 1 (PM-312) already decided on the solution and CP-458 already built a working PoC of the route-manager/xDS approach, both Done. This is meaningfully further along than a fresh idea: the risky "will this even work" question is answered.

What's missing is the *execution* plan: no AC, no written migration/rollout sequence, no rollback criteria. For a change that touches live traffic routing, that gap matters more than it would for a low-risk feature — but it is a scoping/documentation gap on top of solid technical footing, not a fundamental unknown.

**One incoherence to flag:** the `issuelinks` show PM-453 "is required by" PM-184 ("Support S3 for collection snapshots") — an unrelated snapshot-storage objective. **This looks like a data artifact (a JQL/link mismatch) rather than a real dependency**; nothing in either ticket's description connects load-balancing migration to S3 snapshot support. Worth a quick confirmation with whoever created that link before trusting it in planning.

## 2. UI / Design needs

**Requires UI? No** — this is backend infrastructure (load-balancer migration); no customer-facing surface changes. `design_reuse: N/A` and no Figma hunt is meaningful here — confirmed empty across all five places (design fields null, 0 attachments, no `figma.com`/`notion.so` in description/comments, issuelinks are Jira-only, 0 remote links) for completeness, but this is expected for an infra ticket.

## 3. Size coherence (T-Shirt Size)

Size **S** (factor 8).

> [!warning] Estimate alert (under/over-estimation risk)
> **S is defensible for the code path (route-manager and the Envoy chart already exist and were PoC'd) but doesn't visibly price in migration risk** — a live cutover of the load-balancing layer for existing clusters typically needs a phased rollout, monitoring/rollback criteria, and possibly a period running both Traefik and Envoy in parallel. If that rollout work is in scope here (rather than in an unlisted follow-up), realistic estimate is **M**; if it's genuinely just "deploy the already-built pieces to remaining environments," S holds. The ticket doesn't say which.

Recomputing with **M** (factor 6), if the rollout risk is in scope: 9 × 9 × 6 = **486** (down from 648) — still a solidly high-priority item, so this wouldn't change planning much either way; flagging for estimate hygiene rather than urgent re-ranking.

## 4. Prioritization (Impact / Confidence / Score)

| Variable | Value | Numeric |
|----------|-------|---------|
| Impact (calc) | Significant | 9 |
| Confidence (calc) | High | 9 |
| Size factor (S) | — | 8 |
| **Score (RICE)** | — | **648** |

Model check: 9 × 9 × 8 = **648 ✓**

Assessment: Impact=Significant and Confidence=High both hold up well — unlike PM-345 (same Score, but Confidence questionable there), here High confidence is earned: the solution was decided (PM-312, Done) and PoC'd (CP-458, Done) before this ticket even started. No incoherence in the Impact/Confidence pairing; the only open question is the size estimate's treatment of rollout risk (Axis 3).

## Code reuse (`qdrant-cloud-route-manager`, `qdrant-cloud-envoy`)

**Verdict: PARTIAL — the core service and chart exist and are real, but the migration/cutover tooling is not yet visible.**

**Already exists (reusable):**

- `qdrant-cloud-route-manager` — a working Go gRPC service (92 source files) implementing the xDS-driven route manager described in the objective, including a `cmd/drain.go` / health-check helper matching the `qdrant-cloud-envoy` chart's described pod layout.
- `qdrant-cloud-envoy` — a Helm chart (confirmed via README) that already deploys Envoy plus the route-manager health/drain helper, with configurable auth-sidecar and body-validator-sidecar integration — this is a mature, multi-feature chart, not a stub.
- CP-458's PoC (Done) already validated the Envoy xDS protocol approach.

**New / to build:**

- The actual cutover/migration sequencing from Traefik to this stack for existing regions/clusters (not found as code — likely a deployment/runbook concern rather than application code)

**Suggested approach:** Treat this largely as a rollout exercise on top of already-built components; write down the region-by-region migration order and rollback trigger before calling it done, rather than re-scoping the underlying service.

## Linked-ticket context

| Key | Relationship | Title | Figma | Notion | Slack | GitHub | Notes |
|-----|-------------|-------|-------|--------|-------|--------|-------|
| [[PM-312-decide-on-solution\|PM-312]] | depends on | "Improve load balancing setup - Step 1: Decide on a solution" | None | None | None | None | Done. Description explicitly also covers PM-256 (not fetched, outside scope). Its own issuelinks show it's also depended-on by PM-364 ("Multi AZ - Topology aware LB routing", In Progress) — a second downstream consumer worth noting for sequencing. |
| [[CP-458-poc-route-manager\|CP-458]] | depends on | "Create PoC: route-manager (Envoy xDS protocol)" | None | None | None | None | Done, no description recorded. Confirms the xDS approach was validated before Step 2 started. |
| [[PM-184-s3-collection-snapshots\|PM-184]] | is required by | "Support S3 for collection snapshots" | None | None | None | None | **No topical connection to load-balancing migration found — likely a mislinked/stale issuelink; flagged above as an incoherence to verify, not trusted as a real dependency.** |

## Notion context

No Notion links found — notion: none.

## Definition of Ready (DoR)

> [!warning] Verdict: 🟡 ALMOST READY — solution and PoC are Done; the one blocker is a written migration/rollout plan (and AC to match)

| DoR criterion | Status |
|---|---|
| Objective / description clear | ✅ |
| Acceptance criteria defined | ❌ |
| Well scoped (realistic size, not an épic) | ⚠️ |
| Scoring complete (Impact·Confidence·Size) | ✅ |
| Design / UI available | N/A |
| Extrapolable from existing code/contract | ✅ |
| Context sufficient | 🔎 deduced (to verify) |

**Deductions to verify:**
- Context is "sufficient" on the assumption that the PM-184 "is required by" link is a stale/mislinked artifact rather than a real dependency — basis: no topical overlap between load-balancing migration and S3 snapshot support in either ticket's text; confidence: Medium-High; confirm by: whoever created the issuelink, or a quick check of the link's creation date/author.

**To be ready it needs:** Missing definitions/AC (write AC covering the migration's done-state: what regions/clusters are cut over, what "success" looks like) and a touch of missing context (confirm or remove the PM-184 link). Once those land this is 🟢 — the hard technical risk (solution + PoC) is already retired, so this is the closest of the three audited tickets to sprint-ready.

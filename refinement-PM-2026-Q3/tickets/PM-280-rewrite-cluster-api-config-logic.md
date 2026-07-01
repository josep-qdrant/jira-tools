---
ticket: PM-280
aliases: ["PM-280"]
title: "Rewrite cluster-api cluster/cluster configuration update logic"
type: Objective
status: In Progress
bucket: 2026-Q3 (carried over — comment confirms "Will continue on Q3 2026")
objective_class: Standard
owner: Bastian Hofmann
priority: Medium
domain: Clusters
carryover: true
size: XL
size_factor: 2
impact: 9
confidence: 9
score: 162
scoring_complete: true
requires_ui: false
design_linked: true
design_source: notion_doc
design_reuse: N/A
code_reuse: PARTIAL
repos: [qdrant-cloud-cluster-api]
notion: read
slack_context: none
github_context: none
subtasks: []
linked_issues: [PM-310, PM-281]
child_context: full
dor: almost-ready
jira: https://qdrant.atlassian.net/browse/PM-280
tags: [backlog-audit, ticket, PM, readiness/almost-ready]
---

# PM-280 · Rewrite cluster-api cluster/cluster configuration update logic

> [!tldr] 🟡 ALMOST READY · Score 162 (XL) · Notion doc read — and it reveals a scope mismatch: the Jira ticket's "v2 API" ask is literally the last/"Bonus" step of a much larger 4-phase plan to extract the entire cluster module into a separate Go service. PM/Eng need to name which phase(s) are actually in scope for 2026-Q3 before this can be sized or committed.

**Type:** Objective · **Sprint:** 2026-Q3 (carried over — comment: "Will continue on Q3 2026") · **Status:** In Progress · **Objective Class:** Standard · **Owner:** Bastian Hofmann · **Priority:** Medium
**Link:** [PM-280](https://qdrant.atlassian.net/browse/PM-280) · **Reporter:** Bastian Hofmann · **Domain:** Clusters · **Created/Updated:** 2026-01-19 / 2026-06-25
**Subtasks:** none
**Linked issues:** [[PM-310-migrate-cluster-jwt-secret|PM-310]] (relates to — Done), [[PM-281-typescript-protobuf-plugin|PM-281]] (blocks — Ready for planning)
**Related:** none beyond the two linked Objectives.

---

## Audit summary

| Axis | Verdict | Short note |
|------|---------|------------|
| 1. Goal / scope | Risk | Notion plan read — **it's a 4-phase migration to extract cluster into a separate Go service; the Jira ticket's "v2 API + 5 endpoints" ask is the plan's last/"Bonus" step**, not its near-term content |
| 2. UI / Design | N/A | Backend-only rewrite; no UI surface |
| 3. Size (XL) | Risk | XL is already the scale's largest bucket, but the Notion plan describes a 4-phase, 10-milestone service extraction whose own "Points to Discuss" leaves **timeline estimation** unanswered — the true scope may not fit in a single T-shirt size; reads closer to an épic needing a phase-scoped split |
| 4. Prioritization (Score 162) | OK | High/High is well justified (in-progress, urgent per description); XL structurally caps the Score — correct behavior, not an incoherence |

## Project & technical notes

**Project(s):** `qdrant-cloud-cluster-api` (sole repo — Python service; the entire cluster CRUD/configuration-update surface lives here).
**How it'd be done (high level):** rewrite the cluster and cluster-configuration update logic into a cleaner internal structure and expose it via a new v2 API (list/get/create/update/delete cluster endpoints named explicitly in the description), replacing legacy "private region" terminology with "hybrid cloud" throughout the new code and API per a reviewer comment.
**Technical notes:** verified via codegraph/`rg` — no `v2` cluster API surface exists yet in `cluster_api/cluster/`; this is a from-scratch parallel build, not an incremental patch. [[PM-310-migrate-cluster-jwt-secret|PM-310]] (Done) already removed a piece of cluster-api's direct Kubernetes-API coupling (JWT secret via Vault/agent instead), which reduces — but doesn't eliminate — the blast radius of this rewrite. [[PM-281-typescript-protobuf-plugin|PM-281]] is blocked by this ticket (typed protobuf plumbing in the UI likely depends on the new v2 API's contract stabilizing first) and is itself only "Ready for planning," so the dependency chain extends beyond this ticket's own scope.
**Identification confidence:** High for the repo (confirmed sole owner via CODEOWNERS-scope README and code inspection); Medium for the precise endpoint/contract boundary — the Notion plan was read, but it describes a broader, Go-service-extraction near-term scope than the Jira description's v2-API framing, so the exact PM-280 boundary is unresolved pending PM/Eng scoping.

## 1. Goal & scope clarity

The Jira description is more concrete than most tickets audited this batch: it names the code as "brittle and hard to maintain," states the intent to create a v2 API plus "proper internal APIs," and lists five CRUD endpoints in scope (list/get/create/update/delete cluster). A reviewer comment adds a real naming requirement: the new v2 code must use "hybrid cloud" terminology, not legacy "private region" references. A second comment ("Will continue on Q3 2026") confirms this is a carryover in-progress effort, not a fresh idea. **The Technical Documentation field is a Notion link** (`Cluster module refactor / rewrite plan`), read this pass. It is not an AC document — it's a detailed engineering analysis plus a phased migration plan for extracting the entire `cluster` module out of `cluster-api` into a **separate Go-based service** behind gRPC, because "the cluster domain is not just a self-contained module today... many modules still bypass APIs and import cluster internals directly" (booking, authentication, alerting, monitoring, and the internal agent/hybrid-cloud flows are all named as high-rework dependents). The plan sequences this as: **Phase 0** (extract shared constants/enums) → **Phase 1** (introduce internal service classes for dependent modules) → **Phase 2** (introduce internal gRPC APIs) → **Phase 3** (move cluster module to the new Go service) → **Phase 4** (cleanup) → **"Bonus: Introduce v2 APIs"** on the new Go-based ClusterService.

**This is a major discrepancy with the Jira ticket.** PM-280's description frames this quarter's work as *the* rewrite: a new v2 API exposing five CRUD endpoints, done in Python, in `cluster-api`. But in the linked plan, that ask is the **very last, explicitly labeled "Bonus" step**, arriving only after four phases of internal refactoring and a full migration to a separate Go service — phases 0–2 alone touch account, booking, authentication, quota, encryption, kubernetes, metrics and the platform API client, with no user-facing v2 API delivered before Phase 3. Either PM-280 is scoped to a much earlier phase than its own description suggests (in which case the "v2 API" framing is wrong), or the full plan is meant to land this quarter (in which case XL/Score 162 dramatically undersells it). The doc's own "Points to Discuss" section leaves **timeline estimation** blank and defers a related resilience-team dependency (Kubernetes/vault-interaction removal) with "not done anything yet" — the plan's own authors haven't sequenced this either.

## 2. UI / Design needs

**Requires UI? No** — this is a backend service rewrite (cluster-api internals + v2 API surface); no UI component or screen is implicated. `requires_ui: false`, `design_reuse: N/A`.

**Design / Figma:** N/A for this ticket type — correctly not hunted as a UI design gap. The Technical Documentation Notion link is a technical/architecture spec, not a UI design asset (see Notion context below for why it still matters to DoR).

## 3. Size coherence (T-Shirt Size)

Size **XL** (factor 2).

> [!warning] Estimate alert (revised after reading the Notion plan)
> XL is already the scale's largest/lowest-multiplier bucket, but the plan just read describes something bigger than one XL ticket: a 4-phase, 10-milestone extraction of the entire cluster module into a separate Go service, touching at least seven other modules (booking, authentication, quota, alerting, monitoring, account lifecycle, the internal agent). The plan itself doesn't estimate a timeline ("Timeline estimation" is listed as an open discussion point with no answer). **This looks less like one under-sized ticket and more like an épic that hasn't been split along the plan's own phase boundaries.** No re-estimate is safely computable without knowing which phase(s) PM-280 is meant to deliver this quarter — that's a PM/Eng scoping conversation, not something this audit should guess at.

## 4. Prioritization (Impact / Confidence / Score)

| Variable | Value | Numeric |
|----------|-------|---------|
| Impact (calc) | Significant | 9 |
| Confidence (calc) | High | 9 |
| Size factor (XL) | — | 2 |
| **Score (RICE)** | — | **162** |

Model check: 9 × 9 × 2 = **162 ✓**

Assessment: Impact=Significant and Confidence=High are both well supported — the ticket is already "In Progress" (real, ongoing engineering investment, not speculative), and the description frames the current code as urgently unmaintainable. No incoherence found on this axis; the low absolute Score next to smaller tickets is the correct, intended effect of a large, honest size estimate — not a ranking bug. That said, Impact/Confidence were assessed against the Jira description's stated scope (v2 API); if PM-280's actual Q3 deliverable is an early internal-refactor phase instead, both may need a fresh look once scope is clarified — flagged here, not changed (this audit has no Jira scoring authority).

## Code reuse (`qdrant-cloud-cluster-api`)

**Verdict: PARTIAL — the target endpoints and service module exist today (legacy); the v2 API and internal-API layer are net-new.**

**Already exists (reusable):**

- `cluster_api/cluster/` (`models.py`, `models_db.py`, `endpoints.py`, `service/`, `query/`) — the current (legacy) cluster CRUD implementation this rewrite replaces; the underlying `Cluster`/`ClusterConfiguration` DB models are a natural carryover target for the new internal API, not necessarily a full schema rewrite.
- [[PM-310-migrate-cluster-jwt-secret|PM-310]] (Done) — already migrated JWT-secret handling off direct Kubernetes-API calls, which is exactly the kind of internal-API cleanup this rewrite continues.

**New / to build:**

- A parallel v2 API surface for list/get/create/update/delete cluster (confirmed no `v2` module exists yet under `cluster_api/cluster/`).
- Consistent "hybrid cloud" naming throughout the new code, replacing legacy "private region" terms (explicit reviewer requirement).
- The plan's Phase 0–2 internal-API boundaries (service classes + internal gRPC for account, booking, authentication, quota, encryption, kubernetes, metrics, platform-API-client) — now named in the Notion doc, still unbuilt. Phase 3 (separate Go service) is net-new architecture, not a code-reuse candidate at all.

**Suggested approach:** treat the legacy `cluster_api/cluster/service/` and `query/` modules as the migration source, build the v2 endpoints alongside rather than in-place (matching "rewrite" framing), and gate [[PM-281-typescript-protobuf-plugin|PM-281]]'s UI typing work on the v2 contract stabilizing — but confirm with PM/Eng first whether "v2 endpoints" this quarter means the plan's final Bonus step or an earlier internal-refactor phase; this suggested approach assumes the latter is what's actually deliverable in Q3.

## Linked-ticket context

| Key | Relationship | Title | Figma | Notion | Slack | GitHub | Notes |
|-----|-------------|-------|-------|--------|-------|--------|-------|
| [[PM-310-migrate-cluster-jwt-secret|PM-310]] | relates to | "Migrate Qdrant Cluster JWT main secret from direct Cluster API to Kubernetes interaction" | None | None | None | None | Done — a precedent for exactly this kind of internal-API decoupling; reduces (doesn't eliminate) PM-280's blast radius |
| [[PM-281-typescript-protobuf-plugin|PM-281]] | blocks | "Add typescript protobuf plugging to UI to improve typing support" | None | None | None | None | Status "Ready for planning" — downstream UI-typing work likely depends on PM-280's v2 API contract; no additional design/spec found here |

## Notion context

> Re-audited 2026-07-01 — the Notion MCP tool was available this pass (it was not in the original session). Reading it changes the finding materially, not just the checkbox.

| Notion doc | Fetched? | Doc type | Last edited | Found in |
|---|---|---|---|---|
| [Cluster module refactor / rewrite plan](https://www.notion.so/qdrant/Cluster-module-refactor-rewrite-plan-348674779d3380aab1abd76922ee0d26) | ✅ read | Technical design + phased migration plan (6 child "Resources" pages not opened — see below) | 2026-06-30 (page snapshot; child pages dated 2026-06-10 through 2026-06-27) | Technical Documentation field |

**Key takeaways (from the doc):**

- **Requirements / AC:** None in AC form. The doc is an engineering analysis (a "god object" `cluster/service/__init__.py`, 2,512 lines/50+ functions; 7 circular-dependency sites; booking/cluster bidirectional coupling) plus a **4-phase plan**: Phase 0 (extract shared constants/enums) → Phase 1 (internal service classes per dependent module) → Phase 2 (internal gRPC APIs) → Phase 3 (move cluster to a separate **Go** service) → Phase 4 (cleanup) → **"Bonus: Introduce v2 APIs"** on the new Go ClusterService.
- **Decisions recorded:** DB-migration ownership stays with `cluster-api` for now; shared constants/enums extraction happens in Phase 0; CLI-command/CronJob migration is explicitly **out of scope** for this refactor.
- **Open questions (doc's own "Points to Discuss"):** Kubernetes-interaction removal (API-key secret) — "not done anything yet," pending the resilience team's vault-deployment progress; module-refactor traversal order (BFS/DFS) — undecided; **timeline estimation — blank, unresolved**.
- **Links inside the doc:** 6 child "Resources" pages (Cluster V2 API, Cluster Module Rewrite Re-alignment, Cluster Service Milestone Planning, Cluster Service Design Discussion, two Drafts on API-gateway routing and migration analytics) — not opened this pass; deeper phase-level detail likely lives there.
- **Scope boundaries:** Explicit and phased (Phase 0–4 above); CLI/CronJob migration explicitly excluded. No Figma or other design links found in the page text.

**Freshness:** Notion page snapshot 2026-06-30, child pages dated as recently as 2026-06-27 — fresher than the ticket (Jira `updated` 2026-06-25). The plan is being actively worked in Notion; Jira hasn't caught up to it.

**Discrepancies with the Jira ticket:** **Confirmed, significant.** PM-280's Jira description states this quarter's work as a v2 API rewrite (5 CRUD endpoints) done via a "cluster module refactor." The linked plan instead describes a full extraction of the cluster module into a **separate Go microservice**, sequenced across 4 phases plus 10 milestones, with the v2-API ask arriving only as a final "Bonus" after the Go migration is stable. The two do not describe the same near-term deliverable.

**Effect on DoR:** Criterion 2 is **⚠️ read, but doesn't supply AC for what the Jira ticket claims is in scope this quarter** — the doc has real content, but it's a phase-0-through-4 architecture plan, not acceptance criteria for a v2 API. Criterion 3 (well scoped) is likewise **⚠️** now, not ✅: the true scope may be an épic spanning multiple quarters that hasn't been split along the plan's own phase lines.

## Definition of Ready (DoR)

> [!warning] Verdict: 🟡 ALMOST READY — the blocker is no longer "unread Notion doc" but a scope mismatch it exposed: PM/Eng must name which phase(s) of the linked 4-phase plan PM-280 actually delivers in 2026-Q3 before size/AC can be confirmed

| DoR criterion | Status |
|---|---|
| Objective / description clear | ✅ description names the problem and a v2-API intent, though the linked Notion plan shows the *real* near-term work is broader internal refactoring, not just the v2 API |
| Acceptance criteria defined | ⚠️ Notion doc read, but it's a migration plan, not AC for the v2 endpoints the Jira ticket names — **scope mismatch**, see Notion context |
| Well scoped (realistic size, not an épic) | ⚠️ **downgraded** — the plan's actual scope (4 phases, 10 milestones, a Go-service extraction) reads as an épic; PM-280 as a single XL ticket doesn't map cleanly onto any one phase |
| Scoring complete (Impact·Confidence·Size) | ✅ all three populated, arithmetic reconciles (9×9×2=162) — but Impact/Confidence were assessed against the Jira description's scope, not the plan's |
| Design / UI available | N/A — backend-only rewrite, no UI surface |
| Extrapolable from existing code/contract | 🔎 deduced — the legacy `cluster_api/cluster/` module and PM-310's precedent internal-API migration are a reasonable analog for early-phase work, but the plan's Phase 3 (Go rewrite) is a genuinely new architecture, not extrapolable from today's Python code |
| Context sufficient | ✅ carryover status, in-progress state, and naming requirement (hybrid cloud vs. private region) are all captured in comments; now also the full phased plan |

**Deductions to verify:**
- Early-phase work (Phase 0–2: extracting shared constants, introducing internal service classes/gRPC APIs) can extend the existing `cluster_api/cluster/service/` and `query/` modules, following PM-310's precedent internal-API migration — basis: analogous, already-completed decoupling in the same module family; confidence: Medium; confirm by: assignee (Bastian Hofmann) naming which phase(s) are PM-280's actual Q3 scope.
- **Not deducible:** Phase 3 (rewriting the cluster module as a separate Go service) is a new architecture, not an extension of existing code — if PM-280 includes Phase 3 this quarter, treat "extrapolable from existing code" as ❌ for that portion.

**To be ready it needs:** Not well scoped (the linked plan describes an épic-sized, multi-phase migration; PM-280 needs to be pinned to specific phase(s) for 2026-Q3) and missing definitions / AC for that narrowed scope. Next step: PM/Eng name which phase(s) of the Notion plan constitute this ticket's Q3 deliverable, then re-derive AC and re-check the size against that narrower scope — the current XL/162 was set against the Jira description's (now-superseded) v2-API framing.

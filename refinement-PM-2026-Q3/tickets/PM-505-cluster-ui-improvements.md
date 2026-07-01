---
ticket: PM-505
aliases: ["PM-505"]
title: "Cluster UI Improvements"
type: Objective
status: Requirement Definition
bucket: 2026-Q3
objective_class: Standard
owner: unassigned
priority: Medium
domain: Clusters
carryover: true
size: M
size_factor: 6
impact: null
confidence: null
score: 0
scoring_complete: false
requires_ui: probable
design_linked: false
design_source: none
design_reuse: N/A
code_reuse: NONE
repos: [qdrant-cloud-ui]
notion: read
slack_context: none
github_context: none
subtasks: []
linked_issues: [PM-267, MKT-232, MKT-233, MKT-234, MKT-235, PM-355]
child_context: full
dor: not-ready
jira: https://qdrant.atlassian.net/browse/PM-505
tags: [backlog-audit, ticket, PM, readiness/not-ready]
---

# PM-505 · Cluster UI Improvements

> [!tldr] 🔴 NOT READY · Score 0 (M) — **Close, don't refine: every decided piece of PM-505's scope has already shipped (alerts → PM-355 Done, API-key modal → PM-267 Done); the only survivor (overview redesign) is explicitly deferred to a new design-gated Q3 objective.** (Opus escalation; the Notion doc was read this pass and confirmed to spec an already-shipped, different feature.)

**Type:** Objective · **Sprint:** 2026-Q3 (carried in labels from 2026-Q1 — this Objective has been open across at least three quarters) · **Status:** Requirement Definition · **Objective Class:** Standard · **Owner:** unassigned (Assignee/Reporter: Amogha Sathyanarayana) · **Priority:** Medium
**Link:** [PM-505](https://qdrant.atlassian.net/browse/PM-505) · **Reporter:** Amogha Sathyanarayana · **Domain:** Clusters · **Created/Updated:** 2026-06-12 / 2026-06-26
**Subtasks:** none
**Linked issues:** [[PM-267-improve-cluster-api-key-modal|PM-267]] (clones, Done), [[PM-355|PM-355]] "Display customer alerts on cluster detail page" (referenced in comments, Done — alerts scope moved here), MKT-232 "Cluster overview page updates" (relates-to, Backlog), MKT-233 "Improve API Key created modal" (relates-to, Done), MKT-234 "Create promo on metrics page..." (relates-to, Done), MKT-235 "Re-think cluster navigation..." (relates-to, Backlog)
**Related:** blocks [[PM-509-show-backup-size-in-ui|PM-509]] is unrelated to this ticket; no thematic overlap found with other 2026-Q3 PM tickets beyond the shared "Clusters" domain

---

## Audit summary

| Axis | Verdict | Short note |
|------|---------|------------|
| 1. Goal / scope | Gap | **Description ("Cluster overview" + "Hcloud cluster standardise behaviour") contradicts the comment thread, which narrows scope to just alerts (then moves alerts out to PM-355), leaving unclear residual scope** |
| 2. UI / Design | Risk | No Figma on the parent; one linked ticket (MKT-235) has a Figma, but it's explicitly labeled "draft as inspiration" for a *different*, unscoped nav rethink |
| 3. Size (M) | Risk | M can't be evaluated against a moving target — **the scope itself hasn't stabilized in 3 rounds of comments** |
| 4. Prioritization (Score 0) | Risk | **Impact and Confidence both unset → Score 0, invisible in ranking** — confirmed scoring-incomplete per the scope hand-off, not a formula defect |

## Project & technical notes

**Project(s):** `qdrant-cloud-ui` (React/TS) — the only repo in scope given the description talks about cluster overview UI; no backend/API terms appear in the ticket.
**How it'd be done (high level):** Cannot be scoped at high level yet — the comment thread shows the PM actively descoping this ticket ("Scope to be fixed to adding alerts..." then "Move alerts... to PM-355", then a proposal to close this objective entirely once "API changes which are already done" ship, deferring the overview redesign to a *new* Q3 objective "if Design is ready"). It is unclear whether PM-505 itself is the right vehicle for any remaining work, or whether it should be closed.
**Technical notes:** `ClusterOverview.tsx` (212 lines) exists in `qdrant-cloud-ui` and is the likely landing spot for any overview-page work; not deep-dived further because the ticket's actual remaining scope is undetermined.
**Identification confidence:** Low — not because the repo is unclear (it's `qdrant-cloud-ui`), but because **what to build is unclear**; scoping code before the ticket's own owner has settled the scope would be premature.

## 1. Goal & scope clarity

The **description** is two bullets: "Cluster overview" and "Hcloud cluster — standardise behaviour of all components with managed cloud cluster." That's the entire formal scope statement — no acceptance criteria, no bounded list of screens/components. The **Observation field** adds one more data point: "User doesn't have a clear hierarchy or a path towards next steps once inside a cluster."

The **5-comment thread tells a different, evolving story**:
1. Amogha: "update the roadmap ticket with the proposed improvements put in front of Juan" (references external roadmap context not captured here).
2. Amogha: "Scope to be fixed to adding alerts to the cluster overview page. UX redesign to be moved to a new objective in Q3."
3. Amogha: "Move alerts (new tab in cluster overview) to PM-355" — i.e., the one thing the previous comment just fixed scope *to* was then moved to a different ticket.
4. Dani Terrín: asks to "separate the overview part provided that the design is not ready and fix this to the API changes which are already done so that we can close this objective."
5. Dani Terrín: "Will move as a separate objective to Q3 2026 to cover the Cluster overview if Design is ready."

**Net effect: after three explicit scope changes, it's not clear what — if anything — is left in PM-505 itself**, versus what has moved to PM-355 or a not-yet-created "Q3 2026 Cluster overview" objective. **This is the single blocking gap**, not a missing design or a missing API. The ticket needs its scope re-stated in the description before anything else here is actionable.

## 2. UI / Design needs

**Design reuse (code `qdrant-cloud-ui`):** N/A pending scope — cannot classify Extrapolable/Partial/New design when the actual deliverable is undetermined (see axis 1). If the residual scope really is "close this ticket, the API changes are done," there may be **no UI work left at all** in PM-505.

**Design / Figma:** No design directly on PM-505 — checked all five places: design fields (`UX Designs`, `Concept Design`, `Design`, `Technical Documentation` all null on PM-505 itself), 0 attachments, description has no figma.com/notion.so URL, issue links checked (see below), 0 remote links.

One hop out, **MKT-235** ("Re-think cluster navigation...", a linked Design Request) does carry a Figma link (`https://www.figma.com/design/p1DJoJRLHtgh55E9aNQtSL/Playground?node-id=17-366`), but its own description calls it explicitly "Some draft as inspiration" — not a finished design, and for a navigation rethink that isn't what PM-505's description asks for. **Not counted as a found design for PM-505's actual scope.**

**Requires UI? Probable** — any surviving scope (alerts tab, or overview hierarchy) is UI-only, but which screens is exactly the open question.

Missing design-asset checklist:

- [ ] A restated, current scope for PM-505 (supersedes the missing-design question)
- [ ] If overview redesign is retained here: a real Figma (MKT-235's is explicitly a rough draft for navigation, not overview hierarchy)

## 3. Size coherence (T-Shirt Size)

Size **M** (factor 6).

> [!warning] Estimate alert (under/over-estimation risk)
> **M cannot be validated against a target that has changed three times in the comment thread** — from "cluster overview + Hcloud standardization" (description) to "alerts only" to "alerts moved elsewhere, maybe just close this" (latest comment). Any size estimate on the current description is guessing at scope the PM herself has since walked back. Re-estimate only after the scope is re-confirmed in writing.

Recomputing is not meaningful yet: Impact and Confidence are both null, so there is no baseline Score to compare a re-estimate against (see axis 4).

## 4. Prioritization (Impact / Confidence / Score)

| Variable | Value | Numeric |
|----------|-------|---------|
| Impact (calc) | *(unset)* | null |
| Confidence (calc) | *(unset)* | null |
| Size factor (M) | — | 6 |
| **Score (RICE)** | — | **0** |

Model check: incomplete — missing Impact/Confidence → **Score 0**, per the verified scope hand-off (PM-505 is one of the three 2026-Q3 issues with confirmed scoring-incomplete, not a formula error).

Assessment: **Score 0 makes this ticket invisible in any Score-ranked view of the backlog**, which is arguably correct given the scope is also unsettled — but it means PM-505 needs a PM decision (re-score or close) before it can be ranked at all. Given the comment thread's own trajectory (comment 4–5), closing this Objective and re-opening the overview work as a fresh, well-scoped Q3 ticket may be cleaner than trying to re-fit Impact/Confidence to a description that no longer matches the agreed plan.

## Code reuse (`qdrant-cloud-ui`)

**Verdict: NONE assessed — deferred, scope not stable enough to classify.**

**Already exists (reusable):**

- `qdrant-cloud-ui/src/components/Clusters/ClusterOverview.tsx` — the overview page component, confirmed present (212 lines); the natural landing spot if overview work survives in this ticket.
- `qdrant-cloud-ui/src/components/Clusters/ClusterInference/Banners/*` — an established Banner/Alert pattern already used on cluster-related pages (`EnableInferenceBanner`, `ScaleUpClusterForInferenceBanner`, etc.); relevant **if** the "alerts on cluster overview" scope (comment 2, before it moved to PM-355) is what actually survives here.

**New / to build:** Cannot be determined until scope is restated.

**Suggested approach:** Don't estimate code work yet. Get the PM to restate PM-505's residual scope in the description (post-PM-355 split, post whichever objective absorbs the overview redesign), then re-run this axis.

## Linked-ticket context

| Key | Relationship | Title | Figma | Notion | Slack | GitHub | Notes |
|-----|-------------|-------|-------|--------|-------|--------|-------|
| [[PM-267-improve-cluster-api-key-modal\|PM-267]] | clones | "Improve Cluster API Key modal" | [Figma (API-Key-Dialog)](https://www.figma.com/design/jKD48OnXUbSqWsAaVIPGU6/Qdrant-Cloud-Design?node-id=10301-59711) — via its Notion doc | [Cluster UI Improvements — Improve API Key created modal](https://www.notion.so/qdrant/Cluster-UI-Improvements-Improve-API-Key-created-modal-356674779d3380f78ee6da35bb30dc0c) — **read** | None | None | **Status Done (resolved 2026-06-12)**; carries the identical Notion link PM-505 inherited via the clone. Its scope (API key modal) has shipped — this is the source of PM-505's stale Technical Documentation link |
| [[PM-355\|PM-355]] | referenced in comments | "Display customer alerts on cluster detail page" | None | None | None | None | **Status Done (Score 432, S)**; this is where PM-505's "alerts" sub-scope was moved (comment 3) — and it has already shipped |
| MKT-232 | relates-to | "Cluster overview page updates" | None | None | None | None | Status Backlog; a Marketing-project Design Request, not yet actioned — no additional signals |
| MKT-233 | relates-to | "Improve API Key created modal" | None (1 attachment: `Elastic-API-Key.jpg`, verified as a reference screenshot, not a Figma) | None | None | None | Status Done |
| MKT-234 | relates-to | "Create promo on metrics page..." | None (2 attachments: screenshots, verified as reference/context images, not designs) | None | None | None | Status Done; description is empty |
| MKT-235 | relates-to | "Re-think cluster navigation..." | [Figma draft](https://www.figma.com/design/p1DJoJRLHtgh55E9aNQtSL/Playground?node-id=17-366&p=f&t=jNxlt8Tz1F0v8eC3-0) — labeled "draft as inspiration" by the ticket itself | None | None | None | Status Backlog; the one Figma found one hop away, but explicitly not a finished design and for navigation, not overview hierarchy |

> **Design credit rule:** Two Figmas surfaced one hop away, neither credited to PM-505's `design_linked` (stays `false`): (a) **MKT-235's** is an explicit rough draft "as inspiration" for a *navigation* rethink, not overview hierarchy; (b) the **Notion doc's API-Key-Dialog Figma** is a finished design, but it belongs to PM-267's *already-shipped* API-key-modal scope, not PM-505's stated "Cluster overview" / "Hcloud" ask. A design must match the ticket's actual scope to count — neither does.

## Notion context

> **Updated in the Opus escalation pass — the doc was successfully read this run** (a Notion MCP tool was available, unlike the Sonnet run). See `## Escalated review (Opus)` for how it changes the verdict's *reasoning*.

| Notion doc | Fetched? | Doc type | Last edited | Found in |
|---|---|---|---|---|
| [Cluster UI Improvements — Improve API Key created modal](https://www.notion.so/qdrant/Cluster-UI-Improvements-Improve-API-Key-created-modal-356674779d3380f78ee6da35bb30dc0c) | ✅ read | Spec (Overview / What's Changing / Out of Scope / Risks + child pages: Specifications, Implementation Plan, Design document) | snapshot "as of" 2026-05-07 (predates PM-505's 2026-06-12 creation) | Technical Documentation field (identical link also on linked ticket PM-267, now Done) |

**Key takeaways (from the doc):** The doc specifies the **API-key-created-modal redesign** — a two-step dialog for new-cluster users (step 2 shows three onboarding-goal-based next-step recommendations; SDK snippets moved to that second step) and a single-step focused view for existing-cluster users. Out of scope: custom-permission tokens, account/management key flows, mobile layouts, analytics. It is a **complete, well-formed spec — for the API key modal, not for PM-505's stated "Cluster overview" / "Hcloud standardisation" scope.**

**Decisions recorded:** The two-step vs. single-step split by user type is decided; SDK snippets relegated to step 2; recommendation set defaults to a generic set when onboarding data is missing.
**Open questions:** None flagged in the doc (`notion-get-comments` not needed — the doc is a settled spec, and the feature it describes has already shipped via PM-267).
**Links inside the doc:** **Figma design** — API-Key-Dialog section: `https://www.figma.com/design/jKD48OnXUbSqWsAaVIPGU6/Qdrant-Cloud-Design?node-id=10301-59711`. This is a real, finished design — **but for the API key dialog (PM-267's shipped scope), not for PM-505's overview/Hcloud scope.**
**Scope boundaries:** Explicit in/out lists present (see above) — all scoped to the API key modal.

**Freshness:** Doc snapshot **2026-05-07**, older than PM-505's creation (2026-06-12) and older than the linked ticket PM-267's resolution (Done 2026-06-12). The doc was authored for PM-267's effort and inherited by PM-505 through the clone.

**Discrepancies with the Jira ticket:** **Confirmed — the Technical Documentation link is a stale clone artifact.** The doc describes the API-key modal (PM-267 / MKT-233's subject, both Done), which is **not** PM-505's current stated scope ("Cluster overview" + "Hcloud standardise"). PM-267 — which PM-505 *clones* — carries the exact same Notion link and is **Done (resolved 2026-06-12)**. So this link points at already-shipped work, not at any residual PM-505 scope.

**Effect on DoR:** Criterion 2 (AC defined) is now judged on a **read** doc — but the doc's AC/spec are for a *different, already-shipped* feature, so they are **not valid acceptance criteria for PM-505's stated scope**. Criterion 2 is therefore **❌ for this ticket's actual scope** (the read doc doesn't cover it), not ⚠️-unverified. The design-credit rule is not triggered for PM-505 (`design_linked` stays `false`): the Figma in the doc is the API-key-dialog design belonging to PM-267's completed work, not a design for PM-505's overview/Hcloud ask.

## Definition of Ready (DoR)

> [!danger] Verdict: 🔴 NOT READY — and after the Opus escalation (Notion doc now read, linked tickets confirmed Done), the sharper call is that this Objective should be **closed, not refined**: every decided piece of its scope has already shipped elsewhere, and the only surviving ambition is explicitly deferred to a new, design-gated objective.

| DoR criterion | Status |
|---|---|
| Objective / description clear | ❌ |
| Acceptance criteria defined | ❌ |
| Well scoped (realistic size, not an épic) | ❌ |
| Scoring complete (Impact·Confidence·Size) | ❌ |
| Design / UI available | ❌ |
| Extrapolable from existing code/contract | ⚠️ |
| Context sufficient | ⚠️ |

**Deductions to verify:** none — nothing here was filled by extrapolation. The Notion doc was read (documented fact, not inference), the linked tickets' statuses were fetched directly, and the remaining gaps are stated outright (Score fields null; description vs. comments vs. Done-elsewhere mismatch).

**To be ready it needs: not well scoped (épic/split), incomplete scoring, missing context — but the escalation's verdict is that "ready" is the wrong goal for PM-505.** The right next step is **close this Objective** (its alerts scope shipped as [[PM-355|PM-355]], its API-key/API-changes scope shipped as [[PM-267-improve-cluster-api-key-modal|PM-267]], both Done) and **open a fresh, well-scoped Q3 "Cluster overview" Objective** — with Impact/Confidence set and a real overview Figma — once Design is ready, exactly as the PM's comments 4–5 propose. Note: criterion 2 dropped from ⚠️ to ❌ this pass — the externalized doc was read but specs an already-shipped, different feature, so it provides no AC for PM-505's stated scope.

## Escalated review (Opus)

> [!note] Contested call: should PM-505 be refined in place (and to what scope) or closed, per the PM's own trailing comments?

**Verdict: close it — do not refine.** The Sonnet pass flagged this as genuinely contested because it couldn't read the Notion doc and had to hedge between "re-scope in place" and "close." With Notion access restored this pass, the ambiguity collapses. Three fresh reads settle it:

1. **The Technical Documentation Notion doc was read** (it was a tooling gap, not an access denial). It is a complete, well-formed spec — but for the **API-key-created-modal** redesign (two-step new-cluster dialog, single-step existing-cluster view, onboarding-based recommendations), with its own finished Figma. That is PM-267's / MKT-233's subject, **not** PM-505's stated "Cluster overview" + "Hcloud standardise" scope. The doc snapshot is 2026-05-07, older than PM-505's 2026-06-12 creation — it is an artifact inherited through the PM-505→PM-267 *clone*, describing already-shipped work.
2. **PM-267 (which PM-505 clones) is Done** (resolved 2026-06-12) and carries the identical Notion link. The API-key/modal scope has shipped.
3. **PM-355 ("Display customer alerts on cluster detail page"), where comment 3 moved the alerts sub-scope, is Done** (Score 432, S). The alerts scope has shipped.

So every *decided* piece of PM-505's original ambition has already been delivered outside it: alerts → PM-355 (Done), API key modal + "the API changes which are already done" (comment 4) → PM-267 (Done). The **only** surviving ambition is the cluster-overview redesign, which the PM (comments 4–5) explicitly moves to a **new, separate Q3 objective, gated on Design being ready** — and Design is not ready (no overview Figma exists; MKT-235's is a rough nav draft, the Notion Figma is the shipped API dialog). There is therefore **no refinable residual scope inside PM-505**; refining it would mean inventing scope the owner has already relocated.

**Score arithmetic re-checked (unchanged):** Impact (`customfield_10004`/`_10108`) null × Confidence (`customfield_10098`/`_10109`) null × Size M (factor 6) = **Score 0** — confirmed *scoring-incomplete*, matching the scope hand-off exactly, not a formula defect. Re-scoring is moot: you don't complete Impact/Confidence on an objective whose work is done elsewhere.

**Scope boundary re-checked:** the description ("Cluster overview" + "Hcloud standardise") was never updated across the 5-comment thread, but that stale description is *not* the blocker — even taken at face value, its overview half is deferred-with-design-gate and its Hcloud/API half is done. The boundary is clean: nothing actionable remains in this key.

**Readiness verdict: 🔴 NOT READY — resolve by closing PM-505, not by refinement.** This is a firmer conclusion than the Sonnet card's "needs re-scoping / flagged for escalation," reached on the same rubric with the Notion doc and linked-ticket states now in hand. Recommended human action (read-only here — this is a note, not a Jira write): close PM-505 as superseded/done-elsewhere (cross-referencing PM-355 and PM-267), and, when Design lands, open a fresh well-scoped "Cluster overview" Q3 objective with Impact/Confidence set and a real overview Figma. **No further escalation needed.**

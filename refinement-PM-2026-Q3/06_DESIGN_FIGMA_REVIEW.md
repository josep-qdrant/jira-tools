---
title: "Design / Figma review — Cloud Unit Regions & Clusters (2026-Q3)"
doc: design-review
team: "Cloud Unit Regions & Clusters"
board: 267
project: PM
scope: "Sprint = 2026-Q3"
generated: 2026-07-01
readonly: true
tags: [backlog-audit, synthesis, PM]
---

# Design / Figma review — Cloud Unit Regions & Clusters (2026-Q3)

> [!tldr] 0/13 UI-relevant tickets have a confirmed, scope-matching Figma; 3/13 have some design signal with a caveat attached (wrong scope, or unconfirmed). But 10/13 are already classified PARTIAL or FULL code-reuse from existing components — most of the "missing design" gap is closeable by extrapolation, not a blank slate. Design-source counts are unchanged by this pass; Notion coverage improved (see External-context coverage below).

**Question:** do the 13 UI-relevant tickets in this scope (`requires_ui: true` or `probable`) have a linked design? **Short answer:** effectively no direct hit — 0/13 have a Figma link on the ticket itself that is both present and confirmed to match its stated scope. 3/13 have a design signal one hop away or in the Jira field, each with a named caveat.

## Where I looked

Every card hunted the same five places, per the audit method: (1) the Jira design custom fields (`Concept Design`, `UX Designs`, `Technical Documentation`), (2) ticket attachments, (3) `figma.com`/`notion.so` URLs inside the description/comments/AC text, (4) linked/issuelinked tickets (one hop), (5) remote issue links (`getJiraIssueRemoteIssueLinks`).

- **Jira design fields:** hit on 2/17 tickets — PM-165 (`UX Designs`, a genuine Figma) and PM-280 (`Technical Documentation`, a Notion doc — not a UI design, PM-280 is backend-only).
- **Attachments:** hits found only on linked tickets, never on the 17 scoped tickets directly (PM-165's linked MKT-317 has 3 reference screenshots of the *current* UI, not mockups; PM-505's linked MKT-233/MKT-234 have reference screenshots, not designs).
- **Description/comment URLs:** no `figma.com`/`notion.so` hits beyond what's already captured in the design fields above.
- **Linked tickets (one hop):** surfaced 3 more Figma links — PM-165's own MKT-317 (screenshots only), PM-59's Figma (credited to PM-529, with a caveat), and two on PM-505 (MKT-235's nav draft, and the API-key-dialog Figma inside PM-267's Notion doc) — neither counted for PM-505 because neither matches its stated scope.
- **Remote issue links:** 0 hits across all 17 tickets.

This is unchanged from the prior pass. The re-audit of PM-102/PM-280/PM-529 added Notion *reads*, not new design-hunt locations or hits — none of the three UI-relevant tickets among them (PM-529 is; PM-102 and PM-280 are `requires_ui: false`) gained a design signal from the newly-read docs.

## Design-source breakdown

Aggregated `design_source` across all 17 tickets (covering every enum value) — identical counts to the prior synthesis:

| Source | Count | Tickets |
|---|---|---|
| `jira_design_field` | 1 | PM-165 |
| `jira_remote_link` | 0 | — |
| `description` | 0 | — |
| `notion_doc` | 1 | PM-280 (technical doc, non-UI) |
| `linked_ticket` | 1 | PM-529 (unconfirmed — see callout) |
| `slack` | 0 | — |
| `github` | 0 | — |
| `none` | 14 | PM-102, PM-164, PM-187, PM-230, PM-284, PM-313, PM-327, PM-345, PM-430, PM-486, PM-505, PM-509, PM-524 |

The Jira design field is the only source that produced a clean, direct hit this run — worth checking first in future audits, but it's a small sample (1 hit across 17 tickets).

## "One hop away" callout

**PM-529** is the only ticket credited with `design_source: linked_ticket` — its Figma comes from PM-59 (a "relates to" link), where PM-529 itself carries no direct design field. PM-59's own description **strikes through** the exact paragraph describing this feature, annotating it as superseded by the split into PM-272 and PM-529 — so whether the linked Figma node still contains a relevant mockup remained unconfirmed after the original audit (no Figma tool was available to check the node itself). **This pass adds a partial resolution**: PM-59's own linked Notion doc ("Hybrid Cloud Environment Redesign") was read for the first time, and its Milestone 4 / Requirement 4.1 ("snapshot not finished reason" scenario) is a direct textual match for PM-529's scope — confirming the *acceptance criteria* side of this one-hop find. The *Figma* side remains unconfirmed (a separate, still-open Figma-tool gap) — the doc's text doesn't embed or corroborate the specific Figma node cited on PM-59. Still a real "one hop away" find worth verifying and then linking directly on PM-529.

Two further one-hop finds were explicitly **not** credited because the design doesn't match the ticket's stated scope: PM-165's Figma appears via PM-230's link but only covers PM-165's own redesign, not PM-230's cross-region feature; and PM-505 has two one-hop Figmas (MKT-235's rough nav draft, and PM-267's finished-but-different API-key-dialog design), neither matching PM-505's stated "Cluster overview" scope.

## Per UI ticket

| Issue                                                   | Score | `design_linked` | `design_source`   | `design_reuse` | Deduced 🔎 or confirmed ✅                                                                                                                     |
| ------------------------------------------------------- | ----- | --------------- | ----------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [[PM-165-improve-backup-ux\|PM-165]]                    | 360   | true            | jira_design_field | PARTIAL        | ✅ confirmed (field present) for the redesign target; 🔎 deduced for the naming/gRPC contract claim                                            |
| [[PM-509-show-backup-size-in-ui\|PM-509]]               | 432   | false           | none              | FULL           | 🔎 deduced — `Duration` column in `BackupsTable.tsx` is a direct structural template                                                          |
| [[PM-529-backup-failure-reason-hybrid-cloud\|PM-529]]   | 288   | true            | linked_ticket     | FULL           | 🔎 deduced for the tooltip pattern; the linked-ticket Figma credit itself is unconfirmed (AC side now ✅ confirmed via Notion, read this pass) |
| [[PM-313-force-deletion-hybrid-cloud-clusters\|PM-313]] | 810   | false           | none              | PARTIAL        | 🔎 deduced — `DeletionDialog`/`ButtonDangerAction` family, contingent on a still-open product decision                                        |
| [[PM-327-volumeattributesclass-hybrid-cloud\|PM-327]]   | 0     | false           | none              | PARTIAL        | 🔎 deduced — disk-speed/storage-tier selector family                                                                                          |
| [[PM-345-hybrid-cloud-support-bundle\|PM-345]]          | 648   | false           | none              | PARTIAL        | 🔎 deduced, **low confidence** — no matching async-action component actually found in a targeted search                                       |
| [[PM-164-improve-cluster-metrics-ui\|PM-164]]           | 288   | false           | none              | PARTIAL        | 🔎 deduced for chart-reuse only; ❌ for the node picker (no analogous pattern found)                                                           |
| [[PM-187-multi-channel-alert-notifications\|PM-187]]    | 432   | false           | none              | PARTIAL        | 🔎 deduced for email-config only; ❌ for webhook UI (no analogous contract anywhere)                                                           |
| [[PM-230-cross-region-backups\|PM-230]]                 | 324   | false           | none              | PARTIAL        | 🔎 deduced for the region-selector control only; ❌ for the new region-column pattern                                                          |
| [[PM-284-unify-ui-modal-dialogs\|PM-284]]               | 180   | false           | none              | PARTIAL        | 🔎 deduced — `BaseDialog`/`ModalDialog`, contingent on scope (which modals) being confirmed                                                   |
| [[PM-486-allow-disk-downscaling\|PM-486]]               | 648   | false           | none              | NONE           | ❌ confirmed absence — the closest existing pattern explicitly blocks the shrink path                                                          |
| [[PM-430-multi-az-hybrid-cloud\|PM-430]]                | 72    | false           | none              | N/A            | N/A pending scope — even whether a UI toggle exists is undecided                                                                              |
| [[PM-505-cluster-ui-improvements\|PM-505]]              | 0     | false           | none              | N/A            | N/A pending scope — cannot classify when the deliverable itself is undetermined                                                               |

Unchanged by this pass — none of the three re-audited tickets (PM-102, PM-280, PM-529) needed a `design_reuse` reclassification. PM-102 and PM-280 are `requires_ui: false` (not in this table); PM-529's row is identical except its AC-confidence note.

## Non-UI tickets (`requires_ui: false`)

4/17 tickets are confirmed backend/infra-only, N/A for design: [[PM-102-dynamic-cpu-memory-reservation-buffers|PM-102]] (reservation formula, cluster-api — Notion doc now read, confirms Milestone-1 AC, no design implication), [[PM-280-rewrite-cluster-api-config-logic|PM-280]] (cluster-api rewrite — its Notion link is a technical/phased-migration spec, not a UI design, and reading it this pass surfaced a scope mismatch, not a design gap — see [[03_CROSS_CUTTING_FINDINGS|03, H1a]]), [[PM-453-load-balancing-envoy-step2|PM-453]] (Traefik→Envoy infra migration), [[PM-524-hybrid-cloud-integration-tests-real-k8s|PM-524]] (CI/test infrastructure).

## External-context coverage

- **Notion:** 4/17 read (PM-102, PM-280, PM-505, PM-529 — up from 1/17 in the prior synthesis) · 0/17 unreadable (down from 3/17 — the tooling gap that affected PM-102/PM-280/PM-529 is now closed) · 13/17 none.
- **Slack:** 1/17 found (PM-165, a fresh thread on the still-open schedule-frequency question) · 0/17 read. Unchanged — no Slack tool was used in this resync.
- **GitHub:** 2/17 read via `gh` (PM-327 confirmed an open, unmerged PR; PM-345 confirmed a real, working shell script to port) · 1/17 found-not-read (PM-430) · 14/17 none. Unchanged.
- **Linked tickets:** 11/17 hunted for signals one hop away (`child_context: full` on 10/17, plus PM-524's one out-of-vault link also fully hunted). Signals found via linked tickets only: PM-529's Figma credit (see callout above), now paired with a confirmed AC match from PM-59's own linked Notion doc; PM-165's overlap discoveries (PM-213 Done, MKT-317 in-progress design); PM-505's discovery that 3/6 linked tickets are already Done, which is what drove its close verdict (re-confirmed, unchanged, this pass).
- **Notion↔Jira discrepancies:** two now, one carried forward and one new this pass.
  - Carried forward, confirmed on **PM-505**: its Technical Documentation Notion link specs the API-key-modal redesign, a *different, already-shipped* feature (via PM-267, Done), not PM-505's own stated "Cluster overview"/"Hcloud standardise" scope. The doc is a stale artifact inherited through a ticket clone, not a live spec for PM-505.
  - **New this pass, on PM-280**: its Technical Documentation Notion link (now read) specs a 4-phase, 10-milestone extraction of the cluster module into a separate Go service — the Jira ticket's "v2 API" framing is that plan's final "Bonus" step, not its near-term content. Not a stale artifact like PM-505's case; the doc is fresher than the ticket (2026-06-30 snapshot vs. 2026-06-25 Jira update) and actively being worked in Notion — Jira just hasn't caught up. See [[03_CROSS_CUTTING_FINDINGS|03, H1a]].

## Design-effort summary

Across the 13 UI-relevant tickets: **2 FULL** (PM-509, PM-529), **8 PARTIAL** (PM-164, PM-165, PM-187, PM-230, PM-284, PM-313, PM-327, PM-345), **1 NONE** (PM-486), **2 N/A pending scope** (PM-430, PM-505). Unchanged by this pass.

Within FULL+PARTIAL (10 tickets), the deduced-vs-confirmed split leans heavily deduced: only PM-165 has anything close to a field-confirmed design (and even that has an unverified contract claim attached); the other 9 are 🔎 deductions of varying confidence. Three deductions are flagged **low/contingent confidence** and most need a human pass before being trusted: **PM-345** (no matching component was actually found in a targeted search — the deduction is the weakest in the batch), **PM-313** (contingent on an unresolved product decision, not just a design confirmation), and **PM-529** (the linked-ticket Figma credit itself, separate from the tooltip-pattern deduction, is unconfirmed — though its AC counterpart is now confirmed via Notion).

This is lower-risk than a quarter full of genuine new-design gaps would be — most of this UI work has *something* to extrapolate from — but it's an open list, not a closed one. "Mostly deducible" should not be rounded up to "design is basically done."

## Recommendation

Don't block the 8 PARTIAL/2 FULL tickets on a formal Figma — their code-reuse basis is real. Reserve actual design effort for **PM-486** (confirmed NONE — a genuinely new UI concept for a long-running migration status, on top of a backend mechanism that doesn't exist either) and for whichever UI survives PM-430/PM-505's still-open scope decisions. Prioritize a human confirmation pass on the three low-confidence deductions above (PM-345, PM-313, PM-529) before treating them as reliably Extrapolable — for PM-529 specifically, the remaining open item is narrower now (confirm the Figma node only; the AC question is closed). Apply the UI Definition-of-Ready rule from [[04_PLAN_RECOMMENDATION|04]]: criterion 5 stays 🔎, never ✅, until a designer or engineer confirms the cited pattern actually covers the ticket's specific ask.

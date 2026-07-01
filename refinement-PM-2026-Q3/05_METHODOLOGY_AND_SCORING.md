---
title: "Methodology & scoring — Cloud Unit Regions & Clusters (2026-Q3)"
doc: methodology
team: "Cloud Unit Regions & Clusters"
board: 267
project: PM
scope: "Sprint = 2026-Q3"
generated: 2026-07-01
readonly: true
tags: [backlog-audit, synthesis, PM]
---

# Methodology & scoring — Cloud Unit Regions & Clusters (2026-Q3)

> [!tldr] Scope resolved to a clean 17-issue set via literal JQL, no ambiguity. Score = Impact × Confidence × Size, verified arithmetically on all 17 (14 reconcile, 3 are confirmed scoring-incomplete). The Notion/Slack/Figma tool-prefix bug flagged in the prior synthesis is now closed for 3 of the 5 tickets it affected (PM-102, PM-280, PM-529 re-audited with the Notion tool available); PM-165's Slack thread and PM-430's GitHub link remain found-but-unread.

**Team:** Cloud Unit Regions & Clusters · **Board:** 267 · **Project:** PM (id `10102`) · **Date:** 2026-07-01 · **Scope:** `project = PM AND "Team[Team]" in (a58b9345-d5c4-46bd-857f-24747fe27038) AND Sprint = "2026-Q3" ORDER BY Rank ASC`

## How the scope was obtained

"2026-Q3" is not a status or a saved filter — it's a literal **Sprint** object on board 267 (`id 3830`, `state: future`, `startDate 2026-06-30`, `endDate 2026-09-29`), used as a quarterly priority bucket rather than a time-boxed sprint in the usual sense. This was confirmed by reading the Sprint custom field (`customfield_10020`) on a broad, unscoped sample of the team's backlog *before* finalizing the JQL — other bucket-like values exist in the wider backlog (`2026-Q2`, `2026-Q4`, `Backlog Prio 1/2/3`) and are explicitly **not** part of this scope. The team UUID (`a58b9345-…`) was independently verified to resolve to "Cloud Unit Regions & Clusters" by reading `customfield_10001` on sampled issues, not assumed from the UUID alone.

The final JQL returned **17 issues, single page** (`hasNextPage: false`), all type `Objective`. No ambiguity requiring escalation arose — no competing definition of the quarter's backlog boundary was found. Full detail and the verification method: `_scope-handoff.md`.

This is the **third-phase resynthesis** of that same 17-issue scope: no new JQL was run and no issue was re-fetched from Jira. All figures below were re-derived by reading all 17 per-ticket cards in `tickets/` fresh and re-counting with `rg` against their frontmatter.

## Field map

| Concept | Field | Notes |
|---|---|---|
| Score (RICE) | `customfield_10090` | system-computed final number |
| Impact (select) | `customfield_10004` | Minimal / Measurable / Significant |
| Impact (calculated) | `customfield_10108` | numeric used in the Score |
| Confidence (select) | `customfield_10098` | High / Medium / Low |
| Confidence (calculated) | `customfield_10109` | numeric used in the Score |
| T-Shirt Size (select) | `customfield_10099` | XS / S / M / L / XL |
| T-Shirt Size (calculated) | `customfield_10110` | numeric factor, inverse to effort |
| Score (Additional info) | `customfield_10091` | free text; null on all 17 scoped issues |
| Acceptance Criteria | `customfield_10087` | usually a Notion link or empty; populated on PM-102 only among the 17 |
| Draft Requirements | `customfield_10086` | null on all 17 |
| Concept Design | `customfield_10095` | null on all 17 (except one hop away, via linked tickets) |
| UX Designs | `customfield_10096` | null on all but PM-165 (Figma link) |
| Technical Documentation | `customfield_10097` | null on all but PM-280, PM-505 (Notion links) |
| Objective Class | `customfield_10829` | "Standard" on all 17 (no "Big Rock" observed) |
| Sprint | `customfield_10020` | array of sprint objects; holds the quarter/priority buckets |
| Rank | `customfield_10019` | LexoRank string; search results return in Rank order already |

## Scoring model (verified)

```
Score = Impact(calc) × Confidence(calc) × Size factor(calc)
```

| Variable | Qualitative | Numeric |
|---|---|---|
| Impact | Minimal | 2 |
| Impact | Measurable | 6 |
| Impact | Significant | 9 |
| Confidence | Low | 2 |
| Confidence | Medium | 6 |
| Confidence | High | 9 |
| Size | XS | 10 |
| Size | S | 8 |
| Size | M | 6 |
| Size | L | 4 *(not observed in this scope — no scoped issue uses L; inferred from the reference model)* |
| Size | XL | 2 |

**Arithmetic verification, re-run against all 17 audit cards for this resynthesis:**

14/14 issues with complete Impact+Confidence reconcile exactly: PM-102 (9×6×10=540), PM-164 (6×6×8=288), PM-165 (6×6×10=360), PM-187 (6×9×8=432), PM-230 (9×6×6=324), PM-280 (9×9×2=162), PM-284 (2×9×10=180), PM-313 (9×9×10=810), PM-345 (9×9×8=648), PM-430 (6×2×6=72), PM-453 (9×9×8=648), PM-486 (9×9×8=648), PM-509 (6×9×8=432), PM-529 (6×6×8=288). Identical to the prior synthesis pass — the Notion re-read on PM-102/PM-280/PM-529 changed narrative and AC-verification status, not any Impact/Confidence/Size value.

3/17 score 0 because Impact and Confidence are both null (Size is present in all three): PM-327 (Size XS/10), PM-505 (Size M/6), PM-524 (Size S/8). This is confirmed **scoring incomplete**, not a formula defect — consistent with the scope hand-off's original finding, independently re-confirmed here by reading every card's frontmatter.

**The inverse-size effect** (Size scores inversely to effort: XS=10 highest, XL=2 lowest) is doing real, visible work in this batch. [[PM-280-rewrite-cluster-api-config-logic|PM-280]]'s honest XL correctly caps a 9×9 Impact/Confidence pair at Score 162 — no code partially exists that would shrink the remaining rewrite, so this is the model working as intended, not a flaw. **What this pass adds:** reading PM-280's linked Notion plan for the first time shows that 9×9 Impact/Confidence pair was itself assessed against the Jira description's "v2 API" framing — a scope the plan's own phasing treats as its final "Bonus" step, not the near-term deliverable. The Score's arithmetic still checks out; whether it's scoring the right thing is now an open question (see [[03_CROSS_CUTTING_FINDINGS|03, H1a]]). The flip side is [[PM-313-force-deletion-hybrid-cloud-clusters|PM-313]]'s XS driving the top Score in the batch (810) — flagged for extra scrutiny by the original scope hand-off, and the audit confirmed the backend logic is genuinely already built, so the XS mostly holds; the ticket's actual blocker is a product decision, not the size. See [[03_CROSS_CUTTING_FINDINGS|03, H1]] for the six tickets where the inverse-size effect instead masks a genuine under-estimate.

## The audit axes

Every card was scored across four axes: **(1) Goal & scope clarity** — is the objective real and bounded, or a placeholder/wish-list; **(2) UI/Design** — does the ticket need a UI, and if so is a design available, deducible, or missing; **(3) Size coherence** — does the T-shirt size match the scope once code and comments are checked; **(4) Prioritization** — do Impact/Confidence hold up against the ticket's own evidence, and does the Score arithmetic reconcile.

## Limitations

- **Size/L is inferred, not observed.** No 2026-Q3 issue uses Size L; its factor (4) is carried from the reference scoring model, not confirmed live. Flagged wherever a re-estimate proposes L (PM-230, PM-486).
- **The Notion/Slack/Figma MCP tool-prefix bug flagged in the prior synthesis is now closed for 3 of the 5 tickets it affected.** The bug affected 14 of the 17 tickets' original audit sessions (dispatched before the fix landed); on those, a *found* Notion or Slack link was recorded as `unreadable` (Notion) or `found` (Slack), not `read`. This resynthesis is built on a set of cards where **PM-102, PM-280, and PM-529 were re-audited** with the Notion MCP tool available, specifically to close this gap — all three now show `notion: read`, and reading them changed the DoR narrative on all three (materially on PM-280, confirmatively on PM-102 and PM-529 — see [[03_CROSS_CUTTING_FINDINGS|03, H3]]). **PM-505** was already re-read with Notion access in an earlier Opus-escalation pass and is unchanged here. **Two gaps remain**: [[PM-165-improve-backup-ux|PM-165]]'s Slack thread (carrying the freshest signal on its open scheduling question) is still `found`, not `read` — no Slack MCP tool was used in this resync, since re-verifying non-Jira connector content wasn't in scope for a resynthesis of already-gathered cards. [[PM-430-multi-az-hybrid-cloud|PM-430]]'s GitHub reference is similarly still `found`, not `read`. Re-running the hunt on these two remains a same-day, cheap follow-up — see [[02_MASTER_TABLE|02]] and [[06_DESIGN_FIGMA_REVIEW|06]] for where they show up.
- **Repo/code-path identification confidence varies per ticket** — High where source was read line-by-line (e.g. PM-313's `delete_cluster(force=True)`, PM-327's operator/CRD citations), Medium where it's a repo-map association without a ticket-specific code read (e.g. PM-230's `qdrant-cloud` Terraform involvement). Each card states its own confidence level; not repeated here.
- **Design classifications marked 🔎 (deduced) are extrapolations, not confirmations** — see [[06_DESIGN_FIGMA_REVIEW|06]] for the full deduced-vs-confirmed split and which deductions most need a human pass.
- **This resynthesis itself made zero Jira or Notion calls.** Every figure and finding in this document set was transcribed from the 17 on-disk cards (re-read in full) and re-verified with `rg`/`grep` against their frontmatter — see [[ACTIONS_AUDIT|ACTIONS_AUDIT]].

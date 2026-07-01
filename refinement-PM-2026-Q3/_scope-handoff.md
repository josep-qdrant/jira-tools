---
title: PM 2026-Q3 backlog scope hand-off
tags: [backlog-audit, PM]
status: scoped
date: 2026-07-01
aliases: ["PM 2026-Q3 scope"]
---

> [!info] Read-only on Jira
> This run only used `getAccessibleAtlassianResources`, `searchJiraIssuesUsingJql`,
> `getJiraIssue`, and `getJiraProjectIssueTypesMetadata`. No create/edit/transition/
> comment call was made. The only writes were this markdown file.

> [!tldr] Scope is a clean, unambiguous 17-issue set
> `project = PM AND "Team[Team]" in (a58b9345-d5c4-46bd-857f-24747fe27038) AND Sprint = "2026-Q3" ORDER BY Rank ASC`
> → **17 issues**, all type `Objective`, all pre-Done. The RICE-style Score
> formula (`Impact × Confidence × Size`) reconciled on **14/14** issues with
> complete data; 3 issues have Score = 0 from missing Impact/Confidence
> ("scoring incomplete"), not a formula error.

## Scope parameters (confirmed)

- **Site:** `qdrant.atlassian.net` (cloudId `5c21e22a-2454-4b97-8f37-ff67283420c6`)
- **Project:** `PM` (Product Management, id `10102`)
- **Board:** `267`
- **Team:** `"Team[Team]" in (a58b9345-d5c4-46bd-857f-24747fe27038)` — verified live: this UUID resolves to team **"Cloud Unit Regions & Clusters"** (seen on `customfield_10001` of sampled issues).
- **Backlog bucket "2026-Q3":** resolved to the literal **Sprint** value `2026-Q3` — a real Sprint object on board 267 (`id: 3830`, `state: future`, `startDate: 2026-06-30`, `endDate: 2026-09-29`). This is a future sprint used as a quarterly priority bucket, not a status. Confirmed by reading the Sprint field (`customfield_10020`) on live sample issues before finalizing the JQL — other bucket-like values seen in the wider team backlog (`2026-Q2`, `2026-Q4`, `Backlog Prio 1/2/3`) are NOT part of this scope.
- **Issue types in project:** `Objective` (hierarchy level 2, groups milestones) and `Product Request` (hierarchy level 0). All 17 scoped issues are type `Objective`.
- **Output folder:** `/Users/josep/projects/jira/refinement-PM-2026-Q3/` (with `tickets/` subfolder) — both exist.

No ambiguity requiring escalation: "2026-Q3" mapped cleanly to a single, real Sprint name found on live issues; no second plausible reading of the backlog boundary emerged (e.g. no separate saved filter or status-based definition competed with the Sprint bucket).

## Scope JQL (read-only, executed)

```
project = PM
AND "Team[Team]" in (a58b9345-d5c4-46bd-857f-24747fe27038)
AND Sprint = "2026-Q3"
ORDER BY Rank ASC
```

Result: **17 issues**, single page (`hasNextPage: false`) — no pagination needed.

> Discovery path: an unscoped `project = PM AND "Team[Team]" in (<uuid>) ORDER BY Rank ASC`
> pull (statusCategory-filtered sample) surfaced the real Sprint field values
> across the team's whole backlog, which is how `2026-Q3` was confirmed as a
> literal Sprint name rather than guessed. The board's `267` is not referenced
> via any `customFilter` — it only enters as `boardId` metadata on the Sprint
> objects themselves.

## Key list (ordered by Rank, ascending — top of backlog first)

| # | Key | Summary | Status |
|---|-----|---------|--------|
| 1 | [[PM-102-dynamic-cpu-memory-reservation-buffers\|PM-102]] | Dynamic CPU and Memory reservation buffers in managed cloud | Ready for planning |
| 2 | [[PM-164-improve-cluster-metrics-ui\|PM-164]] | Improve Cluster Metrics UI | Requirement Definition |
| 3 | [[PM-165-improve-backup-ux\|PM-165]] | Improve Backup UX | Requirement Definition |
| 4 | [[PM-187-multi-channel-alert-notifications\|PM-187]] | Multi-channel alert notifications | Idea Intake |
| 5 | [[PM-230-cross-region-backups\|PM-230]] | Cross-region backups | Backlog |
| 6 | [[PM-280-rewrite-cluster-api-config-logic\|PM-280]] | Rewrite cluster-api cluster/cluster configuration update logic | In Progress |
| 7 | [[PM-284-unify-ui-modal-dialogs\|PM-284]] | Unify UI modal dialogs | UI/UX Design |
| 8 | [[PM-313-force-deletion-hybrid-cloud-clusters\|PM-313]] | Allow force deletion of Hybrid Cloud clusters | Ready for planning |
| 9 | [[PM-327-volumeattributesclass-hybrid-cloud\|PM-327]] | Make VolumeAttributesClass configurable in hybrid cloud | Ready for planning |
| 10 | [[PM-345-hybrid-cloud-support-bundle\|PM-345]] | Allow Hybrid Cloud support bundle creation from admin and cloud ui | Backlog |
| 11 | [[PM-430-multi-az-hybrid-cloud\|PM-430]] | Multi AZ Support in Hybrid Cloud | Backlog |
| 12 | [[PM-453-load-balancing-envoy-step2\|PM-453]] | Improve load balancing setup - Step 2: Migrate to envoy and route manager | In Progress |
| 13 | [[PM-486-allow-disk-downscaling\|PM-486]] | Allow disk downscaling | Idea Intake |
| 14 | [[PM-505-cluster-ui-improvements\|PM-505]] | Cluster UI Improvements | Requirement Definition |
| 15 | [[PM-509-show-backup-size-in-ui\|PM-509]] | Show backup size in UI | Backlog |
| 16 | [[PM-524-hybrid-cloud-integration-tests-real-k8s\|PM-524]] | Hybrid Cloud integration tests - Real K8s clusters | Technical Design |
| 17 | [[PM-529-backup-failure-reason-hybrid-cloud\|PM-529]] | Show backup failure reason in Hybrid Cloud | In Progress |

**Total: 17 issues.**

## Field map (customfield → label)

Built from `getJiraIssue(fields: ["*all"], expand: "names")` on PM-92 (a representative team issue) and cross-checked live on all 17 scoped issues in default (ADF) format.

| Concept | Field | Notes |
|---------|-------|-------|
| **Score (RICE)** ⭐ | `customfield_10090` | system-computed final number |
| **Impact (select)** ⭐ | `customfield_10004` | Minimal / Measurable / Significant |
| **Impact (calculated)** ⭐ | `customfield_10108` | numeric used in the Score |
| **Confidence (select)** ⭐ | `customfield_10098` | High / Medium / Low |
| **Confidence (calculated)** ⭐ | `customfield_10109` | numeric used in the Score |
| **T-Shirt Size (select)** ⭐ | `customfield_10099` | XS / S / M / L / XL |
| **T-Shirt Size (calculated)** ⭐ | `customfield_10110` | numeric factor, inverse to effort |
| Score (Additional info) | `customfield_10091` | free text; null on all 17 scoped issues |
| Team | `customfield_10001` | object `{id, name}` — this is the "Team[Team]" field; value `a58b9345-…` = "Cloud Unit Regions & Clusters" |
| Sprint | `customfield_10020` | array of sprint objects; holds the quarter/priority buckets |
| Rank | `customfield_10019` | LexoRank string; search results already return in Rank order |
| Acceptance Criteria | `customfield_10087` | usually a link (Notion) or empty; populated on PM-102 only among the 17 |
| Draft Requirements | `customfield_10086` | null on all 17 scoped issues |
| Concept Design | `customfield_10095` | null on all 17 scoped issues |
| UX Designs | `customfield_10096` | null on all but PM-165 (Figma link) |
| Technical Documentation | `customfield_10097` | null on all but PM-280, PM-505 (Notion links) |
| Objective Class | `customfield_10829` | value "Standard" on all 17 scoped issues (no "Big Rock" observed in this set) |
| Design (general) | `customfield_10034` | not populated on any sampled issue this run |
| Target Impact | `customfield_10085` | not populated on any sampled issue this run |
| Complexity | `customfield_10089` | not populated on any sampled issue this run |

⭐ = the four score-factor pairs the scoring model below depends on.

## Scoring model — deduced and VERIFIED against all 17 scoped issues

```
Score = Impact(calc) × Confidence(calc) × Size factor(calc)
```

### Value mappings observed this run

| Variable | Qualitative | Numeric | Observed on |
|----------|-------------|---------|-------------|
| Impact | Minimal | 2 | PM-284 |
| Impact | Measurable | 6 | PM-164, PM-165, PM-187, PM-430, PM-509, PM-529 |
| Impact | Significant | 9 | PM-102, PM-230, PM-280, PM-313, PM-345, PM-453, PM-486 |
| Confidence | Low | 2 | PM-430 |
| Confidence | Medium | 6 | PM-102, PM-164, PM-165, PM-230, PM-529 |
| Confidence | High | 9 | PM-187, PM-280, PM-284, PM-313, PM-345, PM-453, PM-486, PM-509 |
| Size | XS | 10 | PM-102, PM-165, PM-284, PM-313, PM-327 |
| Size | S | 8 | PM-164, PM-187, PM-345, PM-453, PM-486, PM-509, PM-524, PM-529 |
| Size | M | 6 | PM-230, PM-430, PM-505 |
| Size | L | *(not observed in this scope — no scoped issue uses L)* | — |
| Size | XL | 2 | PM-280 |

L=4 is the standard pattern from the reference model but was **not confirmed** against any 2026-Q3 issue — flag as inferred if it matters downstream.

### Arithmetic verification (all 17 issues checked)

| Key | Score | Impact×Conf×Size | Result |
|-----|-------|-------------------|--------|
| PM-102 | 540 | 9 × 6 × 10 = 540 | ✓ |
| PM-164 | 288 | 6 × 6 × 8 = 288 | ✓ |
| PM-165 | 360 | 6 × 6 × 10 = 360 | ✓ |
| PM-187 | 432 | 6 × 9 × 8 = 432 | ✓ |
| PM-230 | 324 | 9 × 6 × 6 = 324 | ✓ |
| PM-280 | 162 | 9 × 9 × 2 = 162 | ✓ |
| PM-284 | 180 | 2 × 9 × 10 = 180 | ✓ |
| PM-313 | 810 | 9 × 9 × 10 = 810 | ✓ |
| PM-327 | 0 | Impact & Confidence both null (Size=XS/10 present) | **scoring incomplete** |
| PM-345 | 648 | 9 × 9 × 8 = 648 | ✓ |
| PM-430 | 72 | 6 × 2 × 6 = 72 | ✓ |
| PM-453 | 648 | 9 × 9 × 8 = 648 | ✓ |
| PM-486 | 648 | 9 × 9 × 8 = 648 | ✓ |
| PM-505 | 0 | Impact & Confidence both null (Size=M/6 present) | **scoring incomplete** |
| PM-509 | 432 | 6 × 9 × 8 = 432 | ✓ |
| PM-524 | 0 | Impact & Confidence both null (Size=S/8 present) | **scoring incomplete** |
| PM-529 | 288 | 6 × 6 × 8 = 288 | ✓ |

**14/14 issues with complete Impact+Confidence data reconcile exactly.** The 3
Score=0 issues (PM-327, PM-505, PM-524) all have a Size set but both Impact and
Confidence unset — confirmed as **scoring incomplete**, not a formula defect.
Notably, two of the three (PM-327, PM-524) are already past "Idea Intake"
(statuses "Ready for planning" and "Technical Design" respectively) yet still
carry no Impact/Confidence — worth flagging to the auditor phase.

### The inverse-size effect, observed live in this scope

Size enters inverse to effort (XS=10 highest → XL=2 lowest). In this set:
PM-313 (XS, Score 810) currently ranks below only nothing on Score, driven
by an XS estimate on a Hybrid Cloud force-deletion feature — worth the
auditor re-checking whether XS is realistic before trusting its rank.
PM-280 (XL, Score 162) is a cluster-api rewrite whose large, honest size
estimate structurally caps its Score regardless of High/High impact/confidence
— this is the mechanism, not a flaw, per `scoring-model.md`.

## Verification method (for the record)

1. `getAccessibleAtlassianResources` → cloudId.
2. Broad sample (`project = PM AND "Team[Team]" in (<uuid>) AND status not in (Done, Discarded) ORDER BY Rank ASC`, `customfield_10020` requested) to read real Sprint values across the team's backlog and confirm `2026-Q3` is a literal Sprint name (not guessed).
3. `getJiraIssue(PM-92, fields: ["*all"], expand: "names")` for the full field-name map.
4. Final scope JQL executed, single page, 17 issues, `hasNextPage: false`.
5. `getJiraIssue` on all 17 keys (default/ADF format, explicit field list including both select and calculated variants) to pull Score, Impact, Confidence, Size, and design/AC fields.
6. Recomputed `Impact × Confidence × Size` per issue in Python and diffed against stored Score (table above).

All calls were read-only (`searchJiraIssuesUsingJql`, `getJiraIssue`,
`getJiraProjectIssueTypesMetadata`, `getAccessibleAtlassianResources`). No
Jira write of any kind was made.

## Next step

Hand off to `jira-ticket-audit` (part 2) for the per-ticket audit of these 17
keys, in Rank order, into `refinement-PM-2026-Q3/tickets/`. Carry forward two
things worth extra scrutiny per the skill's inverse-size guidance: PM-313's XS
size (Score 810, ranks near the top) and the three scoring-incomplete issues
(PM-327, PM-505, PM-524) which need Impact/Confidence before they can be
ranked at all.

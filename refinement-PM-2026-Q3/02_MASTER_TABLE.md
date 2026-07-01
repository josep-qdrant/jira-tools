---
title: "Master table — Cloud Unit Regions & Clusters (2026-Q3)"
doc: master-table
team: "Cloud Unit Regions & Clusters"
board: 267
project: PM
scope: "Sprint = 2026-Q3"
generated: 2026-07-01
readonly: true
tags: [backlog-audit, synthesis, PM]
---

# Master table — Cloud Unit Regions & Clusters (2026-Q3)

> [!tldr] 17 issues, ordered by Score. 14/14 issues with complete Impact/Confidence reconcile exactly against `Impact × Confidence × Size`; 3 score 0 (incomplete data). Six ⚠ rows have a top rank propped up by a size the ticket's own evidence contradicts. Notion coverage improved this pass (PM-102/280/529 now `read`), but no Score, Size, or DoR-verdict cell changed.

**Ordering:** Score descending · **Formula:** `Score = Impact × Confidence × Size factor` (Significant/High = 9, Measurable/Medium = 6, Minimal/Low = 2; XS = 10, S = 8, M = 6, L = 4 *(unobserved)*, XL = 2) · **Date:** 2026-07-01

> [!info] Read-only. All values below are transcribed from the 17 per-ticket cards (re-read in full for this resynthesis) and re-verified with `rg` against the cards' frontmatter — see [[ACTIONS_AUDIT|ACTIONS_AUDIT]].

## Table

| # | Issue | Bucket | Status | Size | Imp | Conf | **Score** | I×C×T ✓ | UI | Design | Notion | Linked | DoR |
|---|-------|--------|--------|------|-----|------|-----------|---------|----|----|--------|--------|-----|
| 1 | [[PM-313-force-deletion-hybrid-cloud-clusters\|PM-313]] | 2026-Q3 | Ready for planning | XS | 9 | 9 | **810** | 9×9×10=810 ✓ | probable | ✗ | — | full (1) | 🟡 |
| 2 | [[PM-486-allow-disk-downscaling\|PM-486]] | 2026-Q3 | Idea Intake | S | 9 | 9 | **648** ⚠ | 9×9×8=648 ✓ | probable | ✗ | — | — | 🔴 |
| 3 | [[PM-453-load-balancing-envoy-step2\|PM-453]] | 2026-Q3 | In Progress | S | 9 | 9 | **648** | 9×9×8=648 ✓ | N/A | N/A | — | full (3) | 🟡 |
| 4 | [[PM-345-hybrid-cloud-support-bundle\|PM-345]] | 2026-Q3 | Backlog | S | 9 | 9 | **648** ⚠ | 9×9×8=648 ✓ | true | ✗ | — | — | 🔴 |
| 5 | [[PM-102-dynamic-cpu-memory-reservation-buffers\|PM-102]] | 2026-Q3 | Ready for planning | XS | 9 | 6 | **540** ⚠ | 9×6×10=540 ✓ | N/A | N/A | read | — | 🟡 |
| 6 | [[PM-509-show-backup-size-in-ui\|PM-509]] | 2026-Q3 | Backlog | S | 6 | 9 | **432** | 6×9×8=432 ✓ | true | ✗ | — | full (2) | 🟡 |
| 7 | [[PM-187-multi-channel-alert-notifications\|PM-187]] | 2026-Q3 | Idea Intake | S | 6 | 9 | **432** ⚠ | 6×9×8=432 ✓ | true | ✗ | — | full (6) | 🔴 |
| 8 | [[PM-165-improve-backup-ux\|PM-165]] | 2026-Q3 | Requirement Definition | XS | 6 | 6 | **360** ⚠ | 6×6×10=360 ✓ | true | ✓ field | — | full (4) | 🔴 |
| 9 | [[PM-230-cross-region-backups\|PM-230]] | 2026-Q3 | Backlog | M | 9 | 6 | **324** ⚠ | 9×6×6=324 ✓ | true | ✗ | — | full (2) | 🔴 |
| 10 | [[PM-529-backup-failure-reason-hybrid-cloud\|PM-529]] | 2026-Q3 | In Progress | S | 6 | 6 | **288** | 6×6×8=288 ✓ | true | ✓ linked | read | full (1) | 🟡 |
| 11 | [[PM-164-improve-cluster-metrics-ui\|PM-164]] | 2026-Q3 | Requirement Definition | S | 6 | 6 | **288** ⚠ | 6×6×8=288 ✓ | true | ✗ | — | full (1) | 🔴 |
| 12 | [[PM-284-unify-ui-modal-dialogs\|PM-284]] | 2026-Q3 | UI/UX Design | XS | 2 | 9 | **180** ⚠ | 2×9×10=180 ✓ | true | ✗ | — | — | 🔴 |
| 13 | [[PM-280-rewrite-cluster-api-config-logic\|PM-280]] | 2026-Q3 | In Progress | XL | 9 | 9 | **162** | 9×9×2=162 ✓ | N/A | ✓ notion | read | full (2) | 🟡 |
| 14 | [[PM-430-multi-az-hybrid-cloud\|PM-430]] | 2026-Q3 | Backlog | M | 6 | 2 | **72** | 6×2×6=72 ✓ | probable | N/A | — | — | 🔴 |
| 15 | [[PM-327-volumeattributesclass-hybrid-cloud\|PM-327]] | 2026-Q3 | Ready for planning | XS | — | — | **0** | incomplete (Impact/Conf null) | true | ✗ | — | — | 🔴 |
| 16 | [[PM-505-cluster-ui-improvements\|PM-505]] | 2026-Q3 | Requirement Definition | M | — | — | **0** | incomplete (Impact/Conf null) | probable | ✗ | read | full (6) | 🔴 |
| 17 | [[PM-524-hybrid-cloud-integration-tests-real-k8s\|PM-524]] | 2026-Q3 | Technical Design | S | — | — | **0** | incomplete (Impact/Conf null) | N/A | N/A | — | full (1) | 🔴 |

**Legend — Design column:** "✓ field" = `jira_design_field`, "✓ remote" = `jira_remote_link`, "✓ desc" = `description`, "✓ notion" = `notion_doc`, "✓ linked" = `linked_ticket`, "✓ slack" = `slack`, "✓ gh" = `github`, "✗" = `none`, "N/A" = `requires_ui: false`. **Notion column:** `read` / "—" (no link found). **Linked column:** `full (n)` = n linked/child issues, all hunted; "—" = none. **DoR:** 🟢 ready / 🟡 almost ready / 🔴 not ready (0 / 6 / 11).

## What changed this pass

Rows 5 ([[PM-102-dynamic-cpu-memory-reservation-buffers|PM-102]]), 10 ([[PM-529-backup-failure-reason-hybrid-cloud|PM-529]]), and 13 ([[PM-280-rewrite-cluster-api-config-logic|PM-280]]) moved from **Notion: unread.** to **Notion: read** — the only cell changes in this table versus the prior synthesis. Score, Size, Imp, Conf, Design, Linked, and DoR are unchanged on all 17 rows; rank order is identical. See [[03_CROSS_CUTTING_FINDINGS|03]] and [[01_EXECUTIVE_SUMMARY|01]] for what the newly-read content changed in the *narrative* (notably PM-280's scope-mismatch discovery).

## ⚠ Rank-risk notes (optimistic size)

Six rows carry a ⚠: their rank depends on a size the ticket's own comments or verified code contradict. See [[03_CROSS_CUTTING_FINDINGS|03 · Cross-cutting findings, H1]] for the full re-scored table. Two of the top four scores by Score (#2 PM-486, #4 PM-345) are in this set — the very top of the ranking is not fully trustworthy as-is.

## Quick stats

**By bucket:** all 17 issues in Sprint `2026-Q3` (a single future-sprint bucket; no sub-bucket split in this scope).

**By status:**

| Status | Count | Issues |
|---|---|---|
| Backlog | 4 | PM-230, PM-345, PM-430, PM-509 |
| Ready for planning | 3 | PM-102, PM-313, PM-327 |
| Requirement Definition | 3 | PM-164, PM-165, PM-505 |
| In Progress | 3 | PM-280, PM-453, PM-529 |
| Idea Intake | 2 | PM-187, PM-486 |
| UI/UX Design | 1 | PM-284 |
| Technical Design | 1 | PM-524 |

**By size:** XS = 5 (PM-102, PM-165, PM-284, PM-313, PM-327) · S = 8 (PM-164, PM-187, PM-345, PM-453, PM-486, PM-509, PM-524, PM-529) · M = 3 (PM-230, PM-430, PM-505) · L = 0 · XL = 1 (PM-280).

**Scoring completeness:** 14/17 complete and arithmetic-verified · 3/17 at Score 0 (PM-327, PM-505, PM-524) — Impact and Confidence both null in all three, confirmed scoring-incomplete, not a formula defect.

**Documentation / design coverage:**
- `requires_ui`: true = 9, probable = 4, false = 4 (13/17 have some UI surface).
- Figma/design linked directly or via a hop (`design_linked: true`): 3/13 UI-relevant tickets (PM-165 direct field, PM-280 a Notion technical doc on a non-UI ticket, PM-529 one hop via a linked ticket, unconfirmed). 0/13 have a *confirmed, scope-matching* Figma with no caveats.
- `design_source` breakdown across all 17: `jira_design_field` 1 · `notion_doc` 1 · `linked_ticket` 1 · `none` 14. (Zero hits for `jira_remote_link`, `description`, `slack`, `github`.) Unchanged this pass — the Notion re-pass affected the `notion:` field, not `design_source`.
- Acceptance Criteria field populated: only PM-102 (points to a Notion doc, now read). All other 16 have it empty; several (PM-230, PM-313, PM-327, PM-345, PM-486, PM-509, PM-529) have AC-equivalent detail captured in comments/custom fields instead, per each card's DoR section.

**Assignment:** unassigned = 10/17 (PM-187, PM-230, PM-313, PM-345, PM-430, PM-486, PM-505, PM-509, PM-524, PM-529) · assigned = 7/17 (Bastian Hofmann ×3: PM-102, PM-280, PM-327; Amogha Sathyanarayana ×3: PM-164, PM-165, PM-284; Robert Stam ×1: PM-453).

**Cross-quarter carryover:** 6/17 carried over from an earlier quarter (PM-102, PM-164, PM-165, PM-280, PM-327, PM-453); PM-505 is labeled as open across at least three quarters per its own card. 11/17 are new to 2026-Q3.

## External-context coverage block

- **Notion:** 4/17 read (PM-102, PM-280, PM-505, PM-529 — up from 1/17) · 0/17 unreadable (down from 3/17: the tooling gap flagged in the prior synthesis is now closed) · 13/17 none (no link found).
- **Slack:** 1/17 found (PM-165) · 0/17 read.
- **GitHub:** 2/17 read (PM-327, PM-345 — via `gh`) · 1/17 found-not-read (PM-430) · 14/17 none.
- **Linked tickets:** 11/17 have subtasks or linked issues (`child_context: full` on 10/17; PM-524's one linked issue, CRS-1923, is outside this vault but was hunted, also `full`) · 0/17 partial (no cap/access-error cases this run) · 6/17 none (PM-102, PM-284, PM-327, PM-345, PM-430, PM-486). Zero tickets carry `subtasks` — all hierarchy signal in this batch comes from `linked_issues`, not subtasks.
- **Designs found via linked tickets only** (`design_source: linked_ticket`, parent has no direct link): **PM-529** only — credited from PM-59's Figma, still flagged unconfirmed since PM-59's own text strikes through the relevant section as superseded (the Notion re-pass confirmed AC for PM-529 but a Figma-tool gap remains — see [[06_DESIGN_FIGMA_REVIEW|06]]).

> [!success] Coverage gap closed for the three tickets it affected. The prior synthesis flagged 14/17 tickets as audited before a Notion/Slack/Figma MCP tool-prefix bug was fixed mid-run. This resync re-read PM-102, PM-280, and PM-529 (the tickets with a real, found-but-then-unread Notion link) with the tool now available, plus PM-505 (already read in an earlier Opus pass) — all four now show `notion: read`. **No other ticket's Notion/Slack/GitHub coverage changed**: PM-165's Slack thread is still `found`, not `read` (Slack tool gap, unaffected by this pass), and PM-430's GitHub link is still `found`, not `read`. Re-running those two remains the next cheapest follow-up. Detail in [[05_METHODOLOGY_AND_SCORING|05 · Methodology & scoring, Limitations]].

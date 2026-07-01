---
objective: <KEY>
aliases: ["<KEY>"]
title: "<Objective title>"
status: <status>
domain: <domain or "—">
target_customer: <target customer or "—">
bucket: <sprint / quarter bucket>
milestones: [<KEY>, <KEY>]
milestone_count: <n>
sprint_fit: {ready: <n>, almost: <n>, not_ready: <n>}
jira: https://<site>/browse/<KEY>
tags: [backlog-audit, objective, <PROJECT>]
---

# <KEY> · <Objective title>

> [!tldr] <n> milestone(s) · <n> 🟢 fit next sprint · <n> 🟡 almost · <n> 🔴 not ready

**Status:** <status> · **Domain:** <domain> · **Target customer:** <target> · **Bucket:** <sprint/quarter>
**Link:** [<KEY>](https://<site>/browse/<KEY>)

<!-- One line: what this Objective is actually about — only if the ticket's own
     description says something the title doesn't already. Omit entirely if the
     title is self-explanatory and the description is empty; don't pad. -->

## Milestones

<!-- One block per Milestone, discovered via `parent = <KEY>` (Step 3d) — not
     issuelinks/subtasks. No four-axis audit, no code-reuse hunt, no Notion/
     Figma drill-down at this level: just the sprint-fit call. Skeleton for
     each block: definition-of-ready/assets/milestone-sprint-fit-line-template.md -->

- 🟡 **[[ABC-118-slug|ABC-118]]** <Milestone title> — In Progress · size not set · 2 children (1 Done, 1 In Progress) · window 2026-04-14→2026-07-06
  **Sprint fit:** remaining scope is one Story already in progress. **Needs:** confirm that Story doesn't hide more scope than it shows; set a T-Shirt Size once confirmed.

<!-- Repeat per Milestone. If `parent = <KEY>` returns ZERO Milestones, say so as
     its own finding instead of leaving the section empty:
     "No Milestones found under this Objective (parent = <KEY> returned 0) — no
     plannable unit exists yet." That absence is itself 🔴, not silence. -->

## Objective-level notes

<!-- Only if there's a real cross-milestone note: a shared blocker, a sequencing
     dependency between two of this Objective's Milestones, or a scope overlap
     with another Objective. Omit this section entirely when there's nothing
     beyond what each Milestone line already states — don't pad to fill a slot. -->

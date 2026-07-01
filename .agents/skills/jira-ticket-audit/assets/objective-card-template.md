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

> [!tldr] <n> milestone(s) · <n> 🟢 · <n> 🟡 · <n> 🔴

**Status:** <status> · **Domain:** <domain> · **Target customer:** <target> · **Bucket:** <sprint/quarter>
**Link:** [<KEY>](https://<site>/browse/<KEY>)

<!-- One line: what this Objective is actually about — only if the ticket's own
     description says something the title doesn't already. Omit entirely if the
     title is self-explanatory and the description is empty; don't pad. -->

## Milestones

<!-- Index only — verdict emoji + wikilink + title. The full sprint-fit
     reasoning lives in each Milestone's own file (milestones/<KEY>-slug.md,
     see assets/milestone-card-template.md) — don't repeat it here. -->

- 🟡 [[ABC-118-slug|ABC-118]] <Milestone title>

<!-- Repeat per Milestone. If `parent = <KEY>` returns ZERO Milestones, say so
     as its own line instead of leaving the section empty:
     "No Milestones found under this Objective (parent = <KEY> returned 0) —
     no plannable unit exists yet." That absence is itself 🔴, not silence. -->

## Objective-level notes

<!-- Only if there's a real cross-milestone note: a shared blocker, a sequencing
     dependency between two of this Objective's Milestones, or a scope overlap
     with another Objective. Omit this section entirely when there's nothing
     beyond what each Milestone's own card already states — don't pad to fill
     a slot. -->

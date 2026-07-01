---
milestone: <KEY>
aliases: ["<KEY>"]
title: "<Milestone title>"
objective: <parent Objective KEY, or "—" if this Milestone was audited directly (Milestone-scoped run, no Objective in scope)>
status: <status>
size: <T-Shirt Size or "not set">
domain: <domain or "—">
children: {total: <n>, done: <n>, in_progress: <n>, todo: <n>}
subtasks: {total: <n>, done: <n>}
start: <date or "—">
target: <date or "—">
sprint_fit: <ready | almost | not-ready>
jira: https://<site>/browse/<KEY>
tags: [backlog-audit, milestone, <PROJECT>, sprint-fit/<ready|almost|not-ready>]
---

# <KEY> · <Milestone title>

**Objective:** [[<objective-slug>|<Objective-KEY>]] (or "— not audited as part of an Objective" for a Milestone-scoped run) · **Status:** <status> · **Size:** <T-Shirt Size or "not set">
**Children:** <n> Stories/Bugs/Tasks (<status breakdown, e.g. "2 Done, 1 In Progress">) · <n> subtasks across them (<status breakdown>) · **Window:** <start>→<target>
**Link:** [<KEY>](https://<site>/browse/<KEY>)

<!-- One line: what "done" means for this Milestone. If the Milestone's own
     description is empty, check the parent Objective's (already fetched, no
     extra call) before calling this a gap — per the parent-context rule in
     definition-of-ready. Write one of:
     - the Milestone's own statement of intent, if it has one
     - "Description inherited from parent Objective: <one-line summary>" (🔎 deduced)
     - "No description in Milestone or Objective" (a genuine gap) -->

<!-- Paste the condensed sprint-fit block here:
     definition-of-ready/assets/milestone-sprint-fit-block-template.md -->

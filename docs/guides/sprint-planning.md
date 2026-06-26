# Sprint planning

> Part of the [jira-tools workflow guide](../../WORKFLOW.md). Runs best on an already-audited backlog — see [backlog-audit](./backlog-audit.md).

Plans a sprint from a scoped or audited backlog. Accounts for team capacity, PTO, and carryover, and applies the Definition of Ready gate — only 🟢 Ready tickets get committed.

**When to use it:** at the start of every sprint, especially right after a backlog audit.

---

## Prompt

```
Plan the next sprint for Cloud Regions & Clusters.
Team: [list of engineers], 2-week sprint starting [date].
[Name] is out [N] days. We have the audited backlog from refinement-PM-2026-Q3.
Use sprint-planning.
```

## What to tell the agent

- **Team members and availability** — PTO, recurring meetings, anyone part-time.
- **Sprint length and start date.**
- **Carryover** from the previous sprint, if any.
- **Goals or themes** (optional — the agent suggests if you don't).
- **Where the audited backlog lives** — the agent reads the DoR verdicts from the cards.

## Output

A sprint plan document with:

- **P0 commits** — the 🟢 Ready tickets that fit capacity.
- **Stretch items** — what to pull in if there's room.
- **Capacity breakdown** — per-engineer, adjusted for PTO.
- **Sprint goals** — the theme the commits ladder up to.

> [!tip] The DoR gate is the point
> Sprint planning won't commit a 🟡 Almost-ready or 🔴 Not-ready ticket. If too little is Ready, that's the signal to run a refinement pass first — see the readiness plan (`04`) from the backlog audit.

See also: [quick-checks](./quick-checks.md) for a one-off DoR verdict · [prompts cookbook](./prompts.md)

# Quick checks — Definition of Ready & triage

> Part of the [jira-tools workflow guide](../../WORKFLOW.md). For a full per-ticket dossier, use [ticket-research](./ticket-research.md) instead.

Three fast, standalone checks that don't need a full audit.

---

## Setup check (`doctor`)

Verifies the tools a run actually depends on are reachable and authorized —
live calls, not a static checklist. Both `backlog-audit` and `ticket-research`
already run this automatically before spending tokens; use it standalone when
you just want to know "is everything connected right now" without kicking off
a full run.

**When to use it:** before a big/expensive audit, right after connecting a
new MCP server, or when a run failed partway through on a connector error and
you want to confirm the fix before re-running.

**Prompt:**

```
Run the doctor check — verify Jira/MCP/config access before I start.
```

**Checks:** Atlassian MCP (required); `gh` CLI, Notion/Slack/Figma MCP, engram,
`QDRANT_REPOS_ROOT` (all optional — a gap degrades gracefully, same as
mid-run, just surfaced now).

**Verdicts:** ✅ READY · ⚠️ READY WITH GAPS (optional connector missing,
proceed) · ❌ BLOCKED (a required check failed — fix before proceeding).

---

## Definition of Ready check (`definition-of-ready`)

A quick readiness verdict on one or more tickets.

**When to use it:** mid-sprint when someone asks "is this ticket ready to pick up?", or during ad-hoc refinement.

**Prompts:**

```
Is PM-207 ready to start? Use the definition-of-ready rubric.
```

```
Check these tickets for readiness: PM-102, PM-184, PM-207.
Give me a verdict and what's missing for each one.
```

**The DoR checklist (7 points):**

1. Goal and scope clearly stated
2. Acceptance criteria defined
3. UI/design linked (if needed)
4. Size estimate present and coherent
5. Score is complete (no zero factors)
6. Not an epic in disguise (well-scoped, implementable)
7. Dependencies identified

**Verdicts:** 🟢 Ready to start · 🟡 Almost ready (one named blocker) · 🔴 Not ready

> [!info] Deduced items aren't ✅
> If the agent infers a checklist item rather than confirming it, it's marked `🔎 deduced (to verify)`, not checked off. The rubric never invents readiness.

---

## Ticket triage (`ticket-triage`)

For inbound **support tickets** — not product backlog items. Assigns P1–P4 and routes to the right team.

**When to use it:** a customer issue comes in and you need to categorize and route it quickly.

**Prompt:**

```
Triage this support ticket:
[paste ticket title and description]

Assign a P1–P4 priority and suggest which team should handle it.
Check if it's a duplicate or known issue.
```

**Priority levels:**

| Level | Meaning |
|---|---|
| P1 | Production down / data loss — respond immediately |
| P2 | Major feature broken, workaround exists — respond within hours |
| P3 | Minor issue or degraded experience — respond within days |
| P4 | Cosmetic / low impact — schedule for backlog |

> [!warning] Backlog tickets ≠ support tickets
> Triage is for inbound customer/support issues. For product backlog readiness use the [DoR check](#definition-of-ready-check-definition-of-ready) above or a full [backlog audit](./backlog-audit.md).

See also: [prompts cookbook](./prompts.md)

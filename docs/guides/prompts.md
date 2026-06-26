# Prompts cookbook

> Part of the [jira-tools workflow guide](../../WORKFLOW.md). Copy a block, swap the values, paste.

Every task this repo does, as a ready prompt. Each task has a **real** example (project `PM`, board `267`, team `Cloud Regions & Clusters`) and a **generic** template with `[placeholders]`. Conventions: output folder `refinement-[project]-[YYYY-QN]/`, board ID and team name come straight from Jira.

---

## Full backlog audit — one command (recommended)

The deterministic [backlog-audit workflow](./backlog-audit.md#a--one-command-workflow-recommended). `outputFolder` is the only required arg.

**Real:**

```
Run the backlog-audit workflow with args:
{
  "outputFolder": "refinement-PM-2026-Q3",
  "project": "PM",
  "board": "267",
  "team": "Cloud Regions & Clusters",
  "buckets": "2026-Q3",
  "reposRoot": "/Users/me/repos",
  "batchSize": 3
}
```

**Generic:**

```
Run the backlog-audit workflow with args:
{
  "outputFolder": "refinement-[PROJECT]-[YYYY-QN]",
  "project": "[PROJECT KEY]",
  "board": "[BOARD ID]",
  "team": "[TEAM NAME]",
  "buckets": "[bucket1, bucket2, ...]"
}
```

---

## Full backlog audit — one-shot conversational

Lets the main agent chain all three skills.

**Real:**

```
Do a full backlog audit for board 267, team "Cloud Regions & Clusters".
Use the jira-backlog-scoping → jira-ticket-audit → jira-backlog-synthesis pipeline.
Save all output as Obsidian markdown in a new folder called refinement-PM-2026-Q3.
```

**Generic:**

```
Do a full backlog audit for board [BOARD ID], team "[TEAM NAME]".
Use the jira-backlog-scoping → jira-ticket-audit → jira-backlog-synthesis pipeline.
Save all output as Obsidian markdown in a new folder called refinement-[PROJECT]-[YYYY-QN].
```

---

## Backlog audit — one phase at a time

Run a single phase against the main agent. See [backlog-audit → mode D](./backlog-audit.md#d--step-by-step-with-the-main-agent).

**Step 1 — scope:**

```
Audit the backlog for the [TEAM NAME] team on board [BOARD ID].
Start with jira-backlog-scoping. Confirm the JQL query, map the custom fields,
and verify the scoring formula. Save the working note to [OUTPUT FOLDER].
```

**Step 2 — audit:**

```
Now run jira-ticket-audit on all tickets from the scope we just built.
Produce one markdown card per ticket. Save them to [OUTPUT FOLDER]/tickets/.
```

**Step 3 — synthesize:**

```
Run jira-backlog-synthesis on the audit cards in [OUTPUT FOLDER]/tickets/.
Produce the full synthesis package.
```

---

## Backlog audit — autonomous subagents

One subagent per phase, each hands off via files. See [backlog-audit → mode C](./backlog-audit.md#c--phase-by-phase-with-subagents-autonomous).

```
/agent jira-backlog-scoper
Scope the backlog for board [BOARD ID], team "[TEAM NAME]". Save to [OUTPUT FOLDER].

/agent jira-ticket-auditor
Audit all tickets from the scope in [OUTPUT FOLDER]. Save cards to [OUTPUT FOLDER]/tickets/.

/agent jira-backlog-synthesizer
Synthesize the audit cards in [OUTPUT FOLDER]/tickets/ into the full planning package.
```

VS Code Copilot variant: `@jira-backlog-scoper Scope board [BOARD ID] for team "[TEAM NAME]"`

---

## Research specific tickets

Deep dossier per key — the [ticket-research workflow](./ticket-research.md). Use this, not the backlog pipeline, for 1–N tickets.

**Real:**

```
Run the ticket-research workflow with args:
{
  "keys": ["PM-207", "PM-210"],
  "outputFolder": "research-PM-2026-Q3",
  "reposRoot": "/Users/me/repos",
  "escalate": true
}
```

**Generic:**

```
Run the ticket-research workflow with args:
{
  "keys": ["[KEY-1]", "[KEY-2]"],
  "outputFolder": "research-[PROJECT]-[YYYY-QN]"
}
```

---

## Sprint planning

From an audited backlog. See [sprint-planning](./sprint-planning.md).

**Generic:**

```
Plan the next sprint for [TEAM NAME].
Team: [engineer A, engineer B, ...], [N]-week sprint starting [DATE].
[Name] is out [N] days. We have the audited backlog from [OUTPUT FOLDER].
Use sprint-planning.
```

---

## Definition of Ready check

A quick readiness verdict, no full audit. See [quick-checks](./quick-checks.md).

**One ticket:**

```
Is [KEY] ready to start? Use the definition-of-ready rubric.
```

**Several:**

```
Check these tickets for readiness: [KEY-1], [KEY-2], [KEY-3].
Give me a verdict and what's missing for each one.
```

---

## Triage a support ticket

For inbound customer issues, not backlog items. See [quick-checks](./quick-checks.md#ticket-triage-ticket-triage).

```
Triage this support ticket:
[paste ticket title and description]

Assign a P1–P4 priority and suggest which team should handle it.
Check if it's a duplicate or known issue.
```

---

## Enable code association

Add a gitignored `AGENTS.local.md` at the repo root, then any audit/research run maps tickets to code:

```
QDRANT_REPOS_ROOT=/absolute/path/to/your/repos
```

Or pass `"reposRoot": "/absolute/path/to/your/repos"` in a workflow's `args`. Without it, cards record code association as "not available" rather than guessing.

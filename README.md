# jira-tools

AI toolkit to audit, refine, and plan a Jira backlog. You point it at a board; it scopes the backlog, audits every ticket for readiness, and writes a planning-ready package — one markdown card per ticket plus cross-cutting synthesis docs, as an Obsidian vault.

> **Strictly read-only on Jira.** No agent ever creates, edits, transitions, or comments on an issue. The only writes are markdown files on disk. Every backlog audit ships an actions-audit doc that proves it.

## What it does

- **Scopes** a backlog into explicit JQL, maps the cryptic `customfield_XXXXX` IDs, and verifies the `Score = Impact × Confidence × Size factor` formula against real issues.
- **Audits** each ticket on four axes (goal clarity · design needs · size coherence · prioritization), hunts the linked design/Notion/Slack/GitHub, maps it to code, and ends with a Definition-of-Ready verdict.
- **Synthesizes** the cards into an executive summary, a master table, a readiness plan, and design/code reviews.

It also does deep single-ticket research, sprint planning, and quick readiness/triage checks — see the guides below.

## Quickstart

1. **Connect the MCP servers** your tickets need (Atlassian is required; Figma/Notion/Slack optional) in your AI client, and authenticate `gh`. Full steps: **[docs/SETUP.md](docs/SETUP.md)**.
2. **Open this repo as your workspace.** `AGENTS.md` is picked up automatically and activates the pipeline — nothing to paste.
3. **Run your first audit.** Ask the assistant:
   ```
   Run the backlog-audit workflow with args:
   { "outputFolder": "refinement-PM-2026-Q3", "project": "PM",
     "board": "267", "team": "Cloud Regions & Clusters", "buckets": "2026-Q3" }
   ```
   `outputFolder` is the only required arg. Watch progress with `/workflows`.

New here? Walk through one full run, start to finish, in **[docs/guides/getting-started.md](docs/guides/getting-started.md)**.

## What's inside

```
AGENTS.md            ← always-loaded instructions (golden rules + map); auto-picked-up by the assistant
USAGE.md             ← what you can ask this repo to do
WORKFLOW.md          ← how the pipeline is wired → links every task guide
docs/                ← SETUP, MODEL_POLICY, WORKFLOW_OVERVIEW, and guides/
.agents/agents/      ← the three subagent definitions (scoper · auditor · synthesizer)
.agents/skills/      ← skill instruction sets the agents load at runtime
.agents/workflows/   ← backlog-audit.js (whole backlog) · ticket-research.js (specific tickets)
skills-lock.json     ← pinned skill versions
```

All three agents default to **Sonnet**; Opus is escalation-only. Why and when: [docs/MODEL_POLICY.md](docs/MODEL_POLICY.md).

## Documentation

| Read this | When you want to |
|---|---|
| [docs/SETUP.md](docs/SETUP.md) | Set up MCP connectors, `gh`, engram memory, and code association |
| [docs/guides/getting-started.md](docs/guides/getting-started.md) | Go from clone to first audit, with a worked example |
| [USAGE.md](USAGE.md) | See every possibility — what you can ask this repo to do |
| [WORKFLOW.md](WORKFLOW.md) | Understand how the pipeline is wired (agents, skills, models) |
| [docs/guides/prompts.md](docs/guides/prompts.md) | Copy-paste a ready prompt for any task |
| [docs/WORKFLOW_OVERVIEW.md](docs/WORKFLOW_OVERVIEW.md) | Understand the pipeline conceptually — what it reads, the rules it follows |
| [docs/MODEL_POLICY.md](docs/MODEL_POLICY.md) | Know which model runs which task |
| [AGENTS.md](AGENTS.md) | See the always-loaded rules the assistant reads on open |

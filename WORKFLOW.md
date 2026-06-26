# Workflow guide

This is the map. It explains how `jira-tools` is wired and points you to the right guide for your task. The detail lives in the per-workflow guides under [docs/guides/](docs/guides/) — this page stays short on purpose.

> **First time here?** Start with [Getting started](docs/guides/getting-started.md) — setup plus one fully worked example.

## Quick links

- [Getting started](docs/guides/getting-started.md) — prerequisites, setup, a worked end-to-end run
- [Prompts cookbook](docs/guides/prompts.md) — copy-paste a prompt for any task
- [docs/SETUP.md](docs/SETUP.md) — MCP connectors, `gh`, engram, code association
- [AGENTS.md](AGENTS.md) — master instructions (golden rules, output format, map)
- [README.md](README.md) — repo summary, quickstart, repo map
- [docs/WORKFLOW_OVERVIEW.md](docs/WORKFLOW_OVERVIEW.md) — the pipeline explained conceptually
- [docs/MODEL_POLICY.md](docs/MODEL_POLICY.md) — which model runs which task

---

## How it works

Three layers:

| Layer | Location | Purpose |
|---|---|---|
| **Master instructions** | `AGENTS.md` | Golden rules, output format, and workflow map — picked up automatically when you open the repo |
| **Agents** | `.agents/agents/` | Autonomous subagents, each with a fixed model, tool set, and scope boundary |
| **Skills** | `.agents/skills/` | Detailed instruction sets agents load at runtime for each phase |

Open the repo as a workspace and `AGENTS.md` activates the pipeline. From there you either **talk to the main agent** (conversational, good for iterating or running one phase) or **invoke a workflow / subagent** (autonomous, one deterministic run). Everything is **read-only on Jira** — the only writes are markdown files on disk.

---

## Which workflow do I want?

| Situation | Workflow | Guide |
|---|---|---|
| Audit a whole team backlog before planning | **backlog-audit** | [backlog-audit](docs/guides/backlog-audit.md) |
| Deep-dive a few specific tickets | **ticket-research** | [ticket-research](docs/guides/ticket-research.md) |
| Plan a sprint from an audited backlog | **sprint-planning** | [sprint-planning](docs/guides/sprint-planning.md) |
| "Is this ticket ready to start?" | **definition-of-ready** | [quick-checks](docs/guides/quick-checks.md) |
| Triage an inbound support ticket | **ticket-triage** | [quick-checks](docs/guides/quick-checks.md) |

Two of these are saved, non-interactive workflows in [.agents/workflows/](.agents/workflows/) (`backlog-audit.js`, `ticket-research.js`); the rest run conversationally against the main agent.

---

## Reference

### Agents

| Agent | Model | Pipeline step | Writes to Jira? |
|---|---|---|---|
| `jira-backlog-scoper` | Sonnet | Step 1 of 3 | Never |
| `jira-ticket-auditor` | Sonnet (Opus on escalation) | Step 2 of 3 | Never |
| `jira-backlog-synthesizer` | Sonnet | Step 3 of 3 | Never |

Model tiering (Haiku retrieval · Sonnet reasoning · Opus escalation-only) is defined in [docs/MODEL_POLICY.md](docs/MODEL_POLICY.md).

### Skills

| Skill | Used by | Writes to Jira? |
|---|---|---|
| `jira-backlog-scoping` | `jira-backlog-scoper` | Never |
| `jira-ticket-audit` | `jira-ticket-auditor` | Never |
| `jira-backlog-synthesis` | `jira-backlog-synthesizer` | Never |
| `definition-of-ready` | `jira-ticket-auditor`, `sprint-planning`, main agent | Never |
| `jira-notion-context` | `jira-ticket-auditor`, `jira-backlog-synthesizer` | Never |
| `slack-mcp` | `jira-ticket-auditor` (design hunt) | Never |
| `gh-cli` | `jira-ticket-auditor` (design hunt) | Never |
| `sprint-planning` | Main agent (standalone) | Never |
| `ticket-triage` | Main agent (standalone) | Never |
| `atlassian-mcp` | `jira-backlog-scoper` (read-only plumbing) | Never |

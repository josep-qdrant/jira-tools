# Workflow guide

This is the map. It explains how `jira-tools` is wired and points you to the right guide for your task. The detail lives in the per-workflow guides under [docs/guides/](docs/guides/) — this page stays short on purpose.

> **First time here?** Start with [Getting started](docs/guides/getting-started.md) — setup plus one fully worked example.

## Quick links

- [USAGE.md](USAGE.md) — what you can ask this repo to do
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

See **[USAGE.md](USAGE.md)** — the full list of what you can ask this repo to do, with a guide link for each.

---

## Reference

### Agents

| Agent | Model | Pipeline step | Writes to Jira? |
|---|---|---|---|
| `jira-backlog-scoper` | Sonnet (Opus on escalation) | Step 1 of 3 | Never |
| `jira-context-gatherer` | Haiku | Retrieval ahead of Step 2 (both workflows) | Never |
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
| `obsidian-vault` | all output-writing skills (format) | Never |
| `writing-style` | all output-writing skills (voice / TL;DR) | Never |
| `slack-mcp` | `jira-ticket-auditor`, `jira-context-gatherer` (design hunt) | Never |
| `gh-cli` | `jira-ticket-auditor`, `jira-context-gatherer` (design hunt) | Never |
| `figma-mcp` | `jira-ticket-auditor`, `jira-context-gatherer` (design hunt) | Never |
| `sprint-planning` | Main agent (standalone, draft-only) | Never |
| `ticket-triage` | Main agent (standalone, draft-only) | Never |
| `atlassian-mcp` | `jira-backlog-scoper` (read-only plumbing) | Never |

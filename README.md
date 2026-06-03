# jira-tools

AI-powered toolkit for Jira backlog auditing, refinement, and sprint planning. Contains the agents, skills, and configuration to run a structured audit pipeline against any Jira board — scoping, per-ticket audit, and synthesis. All work against Jira is **strictly read-only**.

## Skills

| Skill | What it does |
|---|---|
| `jira-backlog-scoping` | Confirms board scope, builds the JQL query, maps custom fields, and verifies the scoring formula |
| `jira-ticket-audit` | Audits each ticket across four axes, hunts for Figma/design links, identifies implicated repos, and issues a Definition of Ready verdict |
| `jira-backlog-synthesis` | Rolls up audit cards into an executive summary, master table, cross-cutting findings, and sprint readiness plan |
| `definition-of-ready` | Shared DoR rubric: 7-point checklist, readiness verdicts, and reason taxonomy |
| `sprint-planning` | Scopes a sprint against team capacity, sets goals, and handles carryover |
| `ticket-triage` | Triages inbound support tickets (P1–P4 priority, routing) |
| `atlassian-mcp` | Reference for Jira/Confluence MCP tool usage and authentication |

## Repository layout

```
AGENTS.md           ← master instructions (golden rules, workflow, output format)
mcp.json            ← MCP server configuration (Atlassian, Codegraph, etc.)
skills-lock.json    ← pinned skill versions
.agents/skills/     ← skill definitions loaded by the agent
```

## How to use

Open this repo as your workspace in an AI coding assistant (VS Code + GitHub Copilot agent mode, Claude Code, Cursor…). The `AGENTS.md` file is picked up automatically and activates the full pipeline.

See **[WORKFLOW.md](WORKFLOW.md)** for the full guide: available workflows, step-by-step prompts, tips for talking to the agent, and a skill reference.

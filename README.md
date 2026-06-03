# jira-tools

AI-powered toolkit for Jira backlog auditing, refinement, and sprint planning. Contains the agents, skills, and configuration to run a structured audit pipeline against any Jira board — scoping, per-ticket audit, and synthesis. All work against Jira is **strictly read-only**.

## Agents

The pipeline ships three **autonomous subagents** — each one runs independently with its own model and tool set. They are chained in order:

| Agent | Model | Role |
|---|---|---|
| `jira-backlog-scoper` | Sonnet | Scopes the backlog, maps custom fields, verifies the scoring formula |
| `jira-ticket-auditor` | Opus | Audits every ticket and writes one card per issue |
| `jira-backlog-synthesizer` | Sonnet | Rolls up cards into the full planning package |

## Skills

Skills are instruction sets loaded by agents. Each agent loads the relevant skill(s) at runtime.

| Skill | What it does |
|---|---|
| `jira-backlog-scoping` | Step-by-step method for scoping a backlog (used by `jira-backlog-scoper`) |
| `jira-ticket-audit` | Per-ticket audit method and card format (used by `jira-ticket-auditor`) |
| `jira-backlog-synthesis` | Synthesis documents spec (used by `jira-backlog-synthesizer`) |
| `definition-of-ready` | Shared DoR rubric: 7-point checklist, verdicts, reason taxonomy |
| `sprint-planning` | Scopes a sprint against team capacity, sets goals, handles carryover |
| `ticket-triage` | Triages inbound support tickets (P1–P4 priority, routing) |
| `atlassian-mcp` | Reference for Jira/Confluence MCP tool usage and authentication |

## Persistent memory (engram)

The toolkit uses **[engram](https://github.com/Gentleman-Programming/engram)** for persistent memory that survives session resets and context compaction. A backlog audit can span days; engram lets the agent recall what was already established instead of re-deriving it.

What gets remembered across sessions:

- Verified **scope** and JQL (team/board, project, backlog definition, key list + counts)
- The custom-field map (`customfield_XXXXX` → readable label) and the verified **scoring formula**
- Decisions, per-ticket gotchas, design-link locations, and DoR verdict rationale

> **Local memory only.** engram writes to a local SQLite DB (`~/.engram/engram.db`) — it **never** writes to Jira. The strictly-read-only rule for Jira is unaffected.

engram is wired into the repo through the `engram` server in `.mcp.json`, so any MCP-capable agent that opens this repo picks it up. Install the binary first:

```bash
brew install gentleman-programming/tap/engram
```

In Claude Code you can alternatively install it as a plugin (`claude plugin marketplace add Gentleman-Programming/engram && claude plugin install engram`); for other agents see engram's [AGENT-SETUP](https://github.com/Gentleman-Programming/engram) docs.

## Repository layout

```
AGENTS.md             ← master instructions (golden rules, workflow, output format)
.mcp.json             ← MCP server configuration (Atlassian, Figma, Notion, engram memory)
skills-lock.json      ← pinned skill versions
.agents/agents/       ← autonomous subagent definitions (model, tools, boundaries)
.agents/skills/       ← skill instruction sets loaded by agents at runtime
```

## How to use

Open this repo as your workspace in an AI coding assistant (VS Code + GitHub Copilot agent mode, Claude Code, Cursor…). The `AGENTS.md` file is picked up automatically and activates the full pipeline.

See **[WORKFLOW.md](WORKFLOW.md)** for the full guide: available workflows, step-by-step prompts, tips for talking to the agent, and a skill reference.

# Usage

What you can ask this repo to do. Everything below is read-only on Jira — see [README](README.md) for the guarantee.

| Situation | Ask for... | Guide |
|---|---|---|
| Audit a whole team backlog before planning | the **backlog-audit** workflow | [backlog-audit](docs/guides/backlog-audit.md) |
| Deep-dive a few specific tickets | the **ticket-research** workflow | [ticket-research](docs/guides/ticket-research.md) |
| Plan a sprint from an audited backlog | **sprint-planning** | [sprint-planning](docs/guides/sprint-planning.md) |
| "Is this ticket ready to start?" | **definition-of-ready** | [quick-checks](docs/guides/quick-checks.md) |
| Triage an inbound support ticket | **ticket-triage** | [quick-checks](docs/guides/quick-checks.md) |

`backlog-audit` and `ticket-research` are saved workflows in [.agents/workflows/](.agents/workflows/); the rest run conversationally against the main agent.

Every one of these has a ready-to-paste prompt in [docs/guides/prompts.md](docs/guides/prompts.md). First time here? Start with [getting-started](docs/guides/getting-started.md).

For how the pipeline is wired internally (agents, skills, models), see [WORKFLOW.md](WORKFLOW.md).

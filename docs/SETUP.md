# Setup

Everything you need to configure before running a workflow. Once this is done, open the repo as a workspace and follow [getting-started](guides/getting-started.md).

> [!info] Read-only on Jira
> Every connector below is used **read-only**. The toolkit never writes to Jira, Notion, Slack, or Figma — the only writes are markdown files on disk.

## Prerequisites

| Requirement | Why | Required? |
|---|---|---|
| An AI assistant with agent + MCP support | Runs the agents, skills, and workflows | **Yes** — Claude Code, VS Code + Copilot agent mode, or Cursor |
| Atlassian MCP (Jira) | Read issues, fields, remote links, Confluence | **Yes** |
| `gh` CLI, authenticated | Read GitHub PRs/issues linked from tickets | Recommended |
| Figma / Notion / Slack MCP | Design hunt + linked-doc extraction | Only if your tickets link to them |
| engram | Persistent memory across sessions | Recommended |
| `QDRANT_REPOS_ROOT` (code association) | Map tickets to the repos that implement them | Optional |

## MCP servers

This repo does **not** ship an MCP config file — you connect the servers in your AI client (e.g. claude.ai / Claude Code connectors, Cursor's MCP settings). Each is the official hosted server and each is used read-only.

| Server | Provides | Endpoint | Token / auth |
|---|---|---|---|
| **Atlassian** | Jira search, issue fetch, remote links, Confluence pages | `https://mcp.atlassian.com/v1/mcp` | OAuth or a [Jira API token](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/) |
| **Figma** | Design metadata, screenshots, variable defs | `https://mcp.figma.com/mcp` | Figma account / PAT |
| **Notion** | Page + database fetch, comments | `https://mcp.notion.com/mcp` | Notion integration with read access to the linked pages |
| **Slack** | Thread + channel reads, search | `https://mcp.slack.com/mcp` | Slack OAuth in your workspace |

Only **Atlassian** is required. Connect the others only if your tickets actually link to Figma designs, Notion docs, or Slack threads — the design hunt skips a connector that isn't present rather than failing.

## `gh` CLI

Used to read GitHub PRs/issues referenced from tickets during the audit.

```
brew install gh
gh auth login
```

## Persistent memory (engram)

A backlog audit can span days. [engram](https://github.com/Gentleman-Programming/engram) gives the agent memory that survives session resets and context compaction, so it recalls the established scope, field map, and decisions instead of re-deriving them.

What it remembers across sessions:

- Verified **scope** and JQL (team/board, project, backlog definition, key list + counts)
- The custom-field map (`customfield_XXXXX` → label) and the verified **scoring formula**
- Decisions, per-ticket gotchas, design-link locations, and DoR verdict rationale

Install it as a Claude Code plugin:

```
claude plugin marketplace add Gentleman-Programming/engram
claude plugin install engram
```

Or as a standalone binary (`brew install gentleman-programming/tap/engram`); for other agents see engram's [AGENT-SETUP](https://github.com/Gentleman-Programming/engram) docs.

> [!info] Local memory only
> engram writes to a local SQLite DB (`~/.engram/engram.db`) — it **never** writes to Jira. The strictly-read-only rule is unaffected.

## Code association (optional)

To map tickets to the code that would implement them, add a gitignored `AGENTS.local.md` at the repo root:

```
QDRANT_REPOS_ROOT=/absolute/path/to/your/repos
```

Or pass `"reposRoot": "/absolute/path/to/your/repos"` in a workflow's `args`. Without it, audit cards record code association as "not available" rather than guessing. The real repo map and proven search terms live in the gitignored `QDRANT-ENV.local.md`.

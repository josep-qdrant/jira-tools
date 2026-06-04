---
name: atlassian-mcp
description: >-
  Read-only mechanics for the official Atlassian MCP server (Jira + Confluence)
  used by the backlog audit. Use when you need the plumbing — which read tools
  exist, how to write JQL/CQL for an audit, how to fetch an issue's custom
  fields and remote links, how to map customfield_XXXXX IDs, or how the server
  is configured in `.mcp.json`. This skill owns the *tool plumbing*;
  jira-backlog-scoping owns the *scoping task* (what to query and why).
  Strictly read-only: only search/get/metadata calls — never create, edit,
  transition, or comment on Jira/Confluence.
---

# Atlassian MCP — read-only audit usage

The backlog audit talks to Jira (and occasionally Confluence) through the
**official Atlassian MCP server**, registered as `atlassian` in `.mcp.json`
(`https://mcp.atlassian.com/v1/mcp/authv2`, via `mcp-remote`). Its tools appear
as `mcp__atlassian__<tool>` in the agent context. This file is the reference for
*how* to call them; for *what* to query and why, see **jira-backlog-scoping**.

## Read-only ground rule

The whole workflow is read-only on Jira and Confluence (see `AGENTS.md`). Use
only the read tools below. Never call `createJiraIssue`, `editJiraIssue`,
`transitionJiraIssue`, `addCommentToJiraIssue`, `createConfluencePage`,
`updateConfluencePage`, or any other write — the only writes the session makes
are markdown files on disk.

## The read tools you actually use

**Jira:**

| Tool | Use for |
|------|---------|
| `mcp__atlassian__searchJiraIssuesUsingJql` | Build the scope; pull a key+summary list. |
| `mcp__atlassian__getJiraIssue` | Full field values for one issue (custom fields, ADF). |
| `mcp__atlassian__getJiraIssueRemoteIssueLinks` | Remote/web links — **where Figma usually hides**. |
| `mcp__atlassian__getJiraProjectIssueTypesMetadata` | Issue types in a project. |
| `mcp__atlassian__getVisibleJiraProjects` | Confirm project key/access. |
| `mcp__atlassian__lookupJiraAccountId` | Resolve a display name to an account ID. |

**Confluence (rarely needed):** `getConfluencePage`, `searchConfluenceUsingCql`,
`getPagesInConfluenceSpace`, `getConfluencePageFooterComments`.

## JQL for an audit (read)

```
# Scope: project + team (UUID, not display name) + sprint, ranked
project = PM
AND "Team[Team]" in (a58b9345-d5c4-46bd-857f-24747fe27038)
AND Sprint in ("Backlog Prio 1", "Backlog Prio 2")
ORDER BY Rank ASC

# Validate a new query cheaply before pulling the full set
project = PM AND statusCategory != Done ORDER BY Rank ASC   # fetch with maxResults small
```

Fetch the **key list** with `fields: ["summary"]` and a small `maxResults`;
paginate by Rank. Full extraction happens per-ticket in `jira-ticket-audit`,
in small batches.

## Fetching one issue's fields + the field map

```
# Map customfield_XXXXX → label and read values in one call
getJiraIssue(issueIdOrKey, fields: ["*all"], expand: "names")
```

`names` gives id → label; `fields` gives the values. Build the field map once
from a representative issue (Score, Impact, Confidence, Size, Acceptance
Criteria, the design fields, Objective Class, Sprint…).

## CQL for Confluence (read)

```
space = "ENG" AND type = page AND text ~ "deployment runbook" ORDER BY lastModified DESC
```

## Gotchas

- **`markdown` rendering truncates custom fields** → use the **default (ADF)
  format** when you need custom-field values.
- **Search responses are large** (forced metadata per issue) → keep scope
  queries to key+summary, and extract issues in small batches with an explicit
  field list.
- **A board quick-filter is not a saved filter.** `?customFilter=NNN` in a board
  URL is not `filter = NNN` in JQL (that returns 0). Rebuild scope from explicit
  fields — project + team + sprint/status.
- **The Team field uses a UUID**, not the display name: `"Team[Team]" in (<uuid>)`.
- **"Backlog Prio 1/2" buckets are usually future sprints** (the Sprint field),
  not a status or a separate field. Read the Sprint field of a few issues to
  confirm the real names before filtering.

## Division of labour

- **jira-backlog-scoping** — owns the scoping *task*: confirming scope
  parameters, reconstructing JQL, and the scoring model. Start there for an audit.
- **This skill** — owns the *plumbing*: tool names, query syntax, the
  custom-field fetch, read-only boundaries.

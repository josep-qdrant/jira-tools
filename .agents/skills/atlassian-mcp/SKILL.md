---
name: atlassian-mcp
description: >-
  Read-only mechanics for the official Atlassian MCP server (Jira + Confluence)
  used by the backlog audit. Use when you need the plumbing — which read tools
  exist, how to write JQL/CQL for an audit, how to fetch an issue's custom
  fields and remote links, how to map customfield_XXXXX IDs, or what its read
  tools are named. This skill owns the *tool plumbing*;
  jira-backlog-scoping owns the *scoping task* (what to query and why).
  Strictly read-only: only search/get/metadata calls — never create, edit,
  transition, or comment on Jira/Confluence.
---

# Atlassian MCP — read-only audit usage

The backlog audit talks to Jira (and occasionally Confluence) through the
**official Atlassian MCP server**, connected in your AI client (see
[docs/SETUP.md](../../../docs/SETUP.md#mcp-servers)). Depending on how it's
connected, its tools appear either as `mcp__atlassian__<tool>` or as
`mcp__claude_ai_Atlassian__<tool>` (the claude.ai account-connector naming) —
use whichever prefix is actually present on your tool list; the operations
below are identical either way. This file is the reference for *how* to call
them; for *what* to query and why, see **jira-backlog-scoping**.

## Read-only ground rule

The whole workflow is read-only on Jira and Confluence (see `AGENTS.md`). Use
only the read tools below. Never call `createJiraIssue`, `editJiraIssue`,
`transitionJiraIssue`, `addCommentToJiraIssue`, `createConfluencePage`,
`updateConfluencePage`, or any other write — the only writes the session makes
are markdown files on disk.

## cloudId first

Every other call below requires a `cloudId`. Call
`getAccessibleAtlassianResources` once at the start of a session/run, grab the
Jira site's cloud ID from the result, and pass it to every subsequent call.

## The read tools you actually use

**Jira:**

| Tool | Use for |
|------|---------|
| `getAccessibleAtlassianResources` | Resolve the `cloudId` — call first, once. |
| `searchJiraIssuesUsingJql` | Build the scope; pull a key+summary list. |
| `getJiraIssue` | Full field values for one issue (custom fields, ADF). |
| `getJiraIssueRemoteIssueLinks` | Remote/web links — **where Figma usually hides**. |
| `getJiraProjectIssueTypesMetadata` | Issue types in a project. |
| `getVisibleJiraProjects` | Confirm project key/access. |
| `lookupJiraAccountId` | Resolve a display name to an account ID. |

**Confluence (rarely needed):** `getConfluencePage`, `searchConfluenceUsingCql`,
`getPagesInConfluenceSpace`, `getConfluencePageFooterComments`.

## JQL for an audit (read)

```
# Scope: project + team (UUID, not display name) + backlog definition, ranked
project = <KEY>
AND "Team[Team]" in (<team-uuid>)
AND Sprint in ("<bucket A>", "<bucket B>")   # or statusCategory, a saved filter — whatever defines the backlog
ORDER BY Rank ASC

# Validate a new query cheaply before pulling the full set
project = <KEY> AND statusCategory != Done ORDER BY Rank ASC   # fetch with maxResults small
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
- **Priority "buckets" are usually future sprints** (the Sprint field), not a
  status or a separate field. Read the Sprint field of a few issues to confirm
  the real names before filtering.

## Division of labour

- **jira-backlog-scoping** — owns the scoping *task*: confirming scope
  parameters, reconstructing JQL, and the scoring model. Start there for an audit.
- **This skill** — owns the *plumbing*: tool names, query syntax, the
  custom-field fetch, read-only boundaries.

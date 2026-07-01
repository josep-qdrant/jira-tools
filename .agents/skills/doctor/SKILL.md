---
name: doctor
description: >-
  Live preflight check for the tools a Jira run actually depends on — not a
  static "what to install" reference (that's docs/SETUP.md), this makes the
  real calls and reports what's actually reachable right now. Use at the very
  start of any backlog-audit or ticket-research run (both workflows run it
  automatically as a Preflight phase), or standalone whenever someone asks
  "check my setup", "is everything configured", "run the doctor", or a run
  just failed partway through on a connector error. Tests Atlassian MCP
  access live (required — a failure here aborts before touching Jira);
  probes gh/Notion/Slack/Figma/engram/QDRANT_REPOS_ROOT (optional — a gap
  degrades gracefully, same as the rest of the pipeline, but gets surfaced
  now instead of discovered 20 tickets into an expensive run). Strictly
  read-only: every probe is a read/search/whoami/status call, never a write.
---

# Doctor — preflight tool check

A backlog audit or ticket-research run can burn a lot of tokens (Scope →
Gather → Analyze → Synthesize, batch after batch) before it hits a connector
that was never authorized. This skill exists to catch that in one cheap pass,
**before** any of that spend happens.

This is not the same job as `docs/SETUP.md`. SETUP.md tells a human what to
install and connect. This skill actually calls the tools, right now, and
reports what's really reachable — install instructions can be stale or only
half-followed; a live call doesn't lie.

## Non-negotiable rules

1. **Read-only, always.** Every check below is a read/search/whoami/status
   call. Never create, edit, transition, or comment on anything, on any
   connector.
2. **Don't scope the backlog here.** This skill proves the plumbing is
   reachable — it does not build JQL, map custom fields, or verify the
   scoring formula. That is `jira-backlog-scoping`'s job, and it runs after
   this check passes.
3. **Required vs optional, and don't blur them.** Only the Atlassian check is
   required — the rest of the pipeline already treats gh/Notion/Slack/Figma/
   engram/QDRANT as optional and degrades gracefully when they're missing.
   Reflect that here: a missing optional connector is a warning, not a
   blocker. Don't invent a new hard requirement the rest of the toolkit
   doesn't have.
4. **A missing tool is not an error.** If a Notion/Slack/Figma/engram tool
   simply isn't on your tool list (connector never added), that's an absent
   check, not a failed one — report it as "not connected", distinct from
   "connected but the call failed" (auth/permission problem).

## Checks

### Required — blocks the run if it fails

**Atlassian MCP (Jira access).**

1. Call `getAccessibleAtlassianResources`. No result, empty list, or an error
   → ❌ **FAIL**: "Atlassian MCP not connected or not authorized." Fix:
   `docs/SETUP.md#mcp-servers`.
2. Take the Jira site's `cloudId` from the result, call
   `getVisibleJiraProjects`. Empty or error → ❌ **FAIL**: "Connected, but no
   visible Jira projects — check the auth scope/API token."
3. If a `project` key was supplied for this run, confirm it appears in the
   visible-projects list. Not found → ❌ **FAIL**: "Project `<KEY>` is not
   visible with this auth — check for a typo or a missing grant." (Catches a
   wrong project key before the Scope phase spends a call rediscovering it.)

Any ❌ here means: **stop, report, do not proceed to Scope/Gather.**

### Optional — warn, never block

Each of these already degrades gracefully elsewhere in the toolkit (a design
hunt "skips a connector that isn't present rather than failing" — see
`figma-mcp`/`jira-notion-context`/`slack-mcp`). Doctor's job is only to
surface the gap up front instead of letting it appear silently mid-run.

| Connector | Probe | Absent | Present but failing |
|---|---|---|---|
| `gh` CLI | Bash `gh auth status` | ⚠️ "not installed/authenticated — GitHub links will be recorded as unreadable" | ⚠️ same wording, note the error |
| Notion MCP | `notion-search` with a trivial query (any short generic term) | ⚠️ "Notion not connected — Notion links will be skipped" | ⚠️ "Notion connected but the call failed: `<error>`" |
| Slack MCP | `slack_search_channels` with a trivial query | ⚠️ "Slack not connected — Slack links will be skipped" | ⚠️ "Slack connected but the call failed: `<error>`" |
| Figma MCP | `whoami` (no file/page ID needed) | ⚠️ "Figma not connected — design links will be skipped" | ⚠️ "Figma connected but the call failed: `<error>`" |
| engram | `mem_current_project` (if the tool is present) | ⚠️ "no persistent memory this session — scope/decisions won't survive a reset" | ⚠️ same wording, note the error |
| `QDRANT_REPOS_ROOT` | Read `AGENTS.local.md` at repo root for `QDRANT_REPOS_ROOT=`; if set, Bash `test -d "<path>"` | not set: no warning — this is genuinely optional and undocumented tickets already say "not available" | ⚠️ "QDRANT_REPOS_ROOT is set to `<path>` but that directory doesn't exist" |

Use whichever tool-name prefix is actually present (`mcp__claude_ai_<Server>__`
or the shorter `mcp__<server>__`) — see `atlassian-mcp`/`figma-mcp`/
`slack-mcp` for the same note.

## Report format

A short checklist, required checks first, grouped, each line one of ✅ / ⚠️ /
❌ plus a one-line reason:

```
## Preflight check

Required:
- ✅ Atlassian MCP — connected, project PM visible

Optional:
- ✅ gh CLI — authenticated as <user>
- ⚠️ Notion MCP — not connected, Notion links will be skipped
- ⚠️ Slack MCP — not connected, Slack links will be skipped
- ✅ Figma MCP — connected
- ✅ engram — session active
- ⚠️ QDRANT_REPOS_ROOT — not set, code association disabled

Verdict: READY WITH GAPS — safe to proceed; Notion/Slack links will show as "unreadable" in cards.
```

Verdict is one of:
- **READY** — every check, required and optional, passed.
- **READY WITH GAPS** — required checks passed, one or more optional checks
  didn't; proceed, the gaps just mean some fields read "not recorded"/
  "unreadable" downstream.
- **BLOCKED** — a required check failed; state exactly which one and the fix,
  and do not proceed.

## Standalone use

Outside a workflow, anyone can ask for this directly ("check my setup", "run
the doctor", "is Jira actually connected right now") — run the checks above
and give the report. No output folder or scope needed; this never touches
disk except to read `AGENTS.local.md`.

## Inside a workflow

Both `backlog-audit` and `ticket-research` run this as an automatic
**Preflight** phase, on Haiku (pure mechanical checks, no judgment — see
`docs/MODEL_POLICY.md`), before Scope/Gather. A required failure aborts the
run there, before any Jira scoping call. An optional gap is logged as a
warning and the run continues — same behaviour as running mid-pipeline, just
surfaced first instead of last.

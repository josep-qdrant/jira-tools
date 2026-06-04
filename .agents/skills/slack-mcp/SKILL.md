---
name: slack-mcp
description: >-
  Use the Slack MCP server to read threads, channels, and search messages when
  a slack.com URL appears during a Jira ticket audit (five-place design hunt,
  linked-ticket context, or Notion doc extraction). Use whenever a ticket,
  Notion doc, or linked issue carries a Slack thread or channel link, or when
  searching for discussion about a Jira key or feature across Slack. Read-only:
  never sends messages, creates canvases, or schedules anything.
---

# Slack MCP — read-only audit usage

When the design hunt or linked-ticket context step surfaces a `slack.com` URL,
use the **Slack MCP server** to read the thread or channel and extract relevant
context (design decisions, spec links, open questions). Read-only: you only
consume messages — you never post, schedule, or edit.

## MCP server key

The server is registered under the key `slack` in `.mcp.json`, so tools appear
as `mcp__slack__<tool_name>` in the agent context.

## Parsing Slack URLs

Slack thread URLs follow this pattern:

```
https://<workspace>.slack.com/archives/<channel_id>/p<timestamp>
```

- **`channel_id`** — the `C…` or `G…` or `D…` segment after `/archives/`
- **`thread_ts`** — the `p<digits>` part, converted by inserting a `.` after
  the 10th digit: `p1712345678901234` → `1712345678.901234`

## Reading a thread

```
mcp__slack__slack_read_thread(
  channel_id = "C08ABCD1234",
  thread_ts  = "1712345678.901234"
)
```

Returns all replies in the thread. Extract:
- Decisions made (agreed-upon design approach, scope cuts)
- Figma or Notion links shared in the thread
- Open questions still unresolved
- Date of last reply (freshness signal)

## Reading a channel (recent messages)

```
mcp__slack__slack_read_channel(
  channel_id = "C08ABCD1234",
  limit = 20
)
```

Use when you have a channel link but no specific thread. Scan for relevant
messages about the Jira ticket key or feature.

## Searching across Slack

```
mcp__slack__slack_search_public_and_private(
  query = "ABC-207 suspension",
  count = 10
)
```

Use when no direct link exists but you want to find discussion about a ticket.
Keep queries specific (Jira key + a keyword). For public-only search use
`mcp__slack__slack_search_public`.

## What to extract for the audit card

Record in the design-hunt section or `## Linked-ticket context`:

| Field | What to record |
|-------|---------------|
| Channel | `#channel-name` (if known) or channel ID |
| Thread date | date of the thread / last reply |
| Key decision | one-line summary |
| Figma / Notion links | any URLs found — follow with Figma metadata or Step 3b |
| Open questions | unresolved items → flag as refinement alert |

If the thread contains a Figma link → that counts as a **found design**;
credit it to the parent Jira ticket's card and set `design_linked: true`.
If it contains a Notion link → follow with the `jira-notion-context` skill
(Step 3b).

## Gotchas

- **Access depends on the bot's membership.** The Slack MCP bot must be a
  member of the channel to read it. If `slack_read_channel` returns an error,
  note "Slack link found but channel not accessible" in the card.
- **Thread ts format is exact.** A wrong timestamp returns no messages —
  double-check the conversion (10-digit Unix seconds + `.` + remaining digits).
- **Private channels vs. DMs.** The bot may not have access to DMs or private
  channels it hasn't been invited to.
- **Don't post.** Your tool scope excludes `slack_send_message`,
  `slack_schedule_message`, `slack_create_canvas`, and `slack_update_canvas`.
  Read-only only.
- **Don't search broadly.** One query, one targeted topic. Broad queries return
  noise and consume context budget.

## Related skills

- **`jira-ticket-audit`** — Step 3 and Step 3c trigger this skill whenever a
  `slack.com` URL appears.
- **`jira-notion-context`** — if a Slack thread contains a Notion link, hand
  off to that skill to extract the doc.
- **`atlassian-mcp`** — the equivalent reference for Jira/Confluence MCP usage.

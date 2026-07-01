---
name: figma-mcp
description: >-
  Use the Figma MCP server to check for and verify a linked design when a
  figma.com URL appears during a Jira ticket audit (five-place design hunt,
  linked-ticket context, or a Notion/Slack/GitHub doc). Use whenever a ticket
  or its one-hop context carries a Figma link, or when a found design needs
  verifying (is it actually a UI mockup, and how much of it is new vs. an
  existing pattern). Read-only: never creates, edits, or comments on Figma
  files.
---

# Figma MCP — read-only audit usage

When the design hunt surfaces a `figma.com` URL, use the **Figma MCP server**
to confirm it's a real design and, when it matters for the audit, look at
what it actually shows. Read-only: you only fetch metadata, screenshots, and
design data — you never create or edit a file, frame, or comment.

## MCP server key

The Figma MCP server is connected in your AI client (see
[docs/SETUP.md](../../../docs/SETUP.md#mcp-servers)); its tools appear as
`mcp__figma__<tool_name>` in the agent context.

## Step 1 — Existence check (every figma.com link)

```
mcp__figma__get_metadata(node_id_or_url = "<the figma.com URL>")
```

This is the retrieval step — it confirms the link resolves and returns the
file/frame name, last-modified date, and node structure. Use this for every
`figma.com` URL found anywhere in the five-place hunt or linked-ticket
recursion (the `jira-context-gatherer` agent does this). It's enough to set
`design_linked: true` and credit the source.

## Step 2 — Verify and classify (only when judgment is needed)

A link existing isn't the same as a usable design. When the audit (the
`jira-ticket-auditor` agent, not the gatherer) needs to confirm what the
design actually covers — to feed the Extrapolable / Partial / New-design
classification in `references/design-link-hunt.md` — pull the content
itself instead of guessing from the ticket text alone:

```
mcp__figma__get_screenshot(node_id_or_url = "<url>")       # what it looks like
mcp__figma__get_design_context(node_id_or_url = "<url>")   # structured layer/spec data
```

Use `get_screenshot` to sanity-check that the link is actually a UI mockup
(not a diagram, a roadmap, or an unrelated file someone pasted). Use
`get_design_context` when you need the structural detail — components used,
spacing, variants — to judge whether the ticket's scope matches what's
designed, or whether only part of the screen has a design and the rest is
unspecified.

`get_variable_defs` (design tokens) and `get_code_connect_map` (Figma↔code
component mapping) exist on the auditor's tool list but are rarely needed for
a readiness audit — reach for them only if a ticket's coherence genuinely
hinges on a specific token/variant or an existing Code Connect mapping, not
as a default step.

## What to extract for the audit card

| Field | What to record |
|-------|---------------|
| File / frame name | from `get_metadata` |
| Last modified | freshness signal — a design untouched since before the ticket was written may be stale |
| Covers full scope? | from `get_screenshot` / `get_design_context` — does it show the whole flow described, or just part of it |
| Classification | Extrapolable / Partial / New-design (see `design-link-hunt.md`) |

## Gotchas

- **A `figma.com` link in the description can be stale or wrong.** Check
  `get_metadata`'s last-modified date against the ticket's age — a design
  predating a since-changed requirement is a finding, not a pass.
- **Don't over-fetch.** `get_screenshot`/`get_design_context` are for when the
  classification or scope match genuinely needs verifying — not a default
  step for every Figma link found. The existence check alone is enough for
  most cards.
- **Don't write.** Your tool scope (via `jira-ticket-auditor`) excludes any
  Figma write/comment tool. Read-only only.
- **Access depends on the file's sharing settings.** If `get_metadata` fails,
  note "Figma link found but file not accessible" in the card rather than
  guessing what it might contain.

## Related skills

- **`jira-ticket-audit`** — Step 3 and Step 3c trigger this skill whenever a
  `figma.com` URL appears.
- **`jira-context-gatherer`** (agent) — does Step 1 (existence check) during
  retrieval; Step 2 is the auditor's call, made during judgment.
- **`slack-mcp` / `gh-cli`** — the equivalent reference for the other two
  external systems the design hunt follows.

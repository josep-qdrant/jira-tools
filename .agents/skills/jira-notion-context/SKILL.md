---
name: jira-notion-context
description: >-
  Detect, register, open and extract the Notion documents linked from Jira
  backlog tickets, and feed that context back into the ticket's audit card and
  Definition of Ready. Use whenever a ticket carries a notion.so link (the
  Acceptance Criteria field is frequently JUST a Notion link), whenever someone
  asks to "read the Notion of this ticket", to enrich or better define a ticket
  from its externalized spec, to know which tickets have Notion docs attached
  (Notion coverage), or to pull requirements/decisions/open questions out of a
  linked Notion page. Uses the configured `notion` MCP server in READ-ONLY mode
  (search/fetch/comments — never creates, updates or moves pages). Companion to
  jira-ticket-audit (Step 3b of every per-ticket audit) and definition-of-ready
  (externalized AC only counts when the doc was actually read). Read-only on
  Jira and on Notion.
---

# Jira ↔ Notion Context

Backlog tickets externalize their real definition to **Notion** more often than
they carry it in Jira: the *Acceptance Criteria* field is frequently just a
`notion.so` URL. An audit that doesn't open those docs judges the ticket on a
fraction of its truth. This skill makes the Notion side first-class: **detect →
register → read → extract → feed the card and the DoR**.

## Ground rules

1. **Read-only on Notion (and Jira).** Use only read tools from the configured
   `notion` MCP server: `notion-fetch` (page/database by URL or ID),
   `notion-search` (when you only have a title), `notion-get-comments` (open
   questions / discussion). **Never** call create/update/move/duplicate tools.
2. **Don't invent.** If a page can't be fetched (no access, not found), record
   it as *"linked but not readable"* — never guess its content.
3. **Cite the source.** Everything extracted from Notion goes into the card
   with its URL, so a human can verify it.

## Step 1 — Detect the Notion links (per ticket)

Notion links hide in the same places as designs (see jira-ticket-audit Step 3):

1. **Acceptance Criteria** field — very often the AC *is* a bare Notion link
   (an `inlineCard` in ADF; in markdown rendering it may get truncated — use the
   default ADF format).
2. **Draft Requirements / Business Context / design fields.**
3. **Description** — search for `notion.so` / `notion.site` URLs.
4. **Comments** on the issue.
5. **Remote / web links** (`getJiraIssueRemoteIssueLinks`).

## Step 2 — Register them (Notion coverage)

Maintain one **Notion registry** per audit run — a table the synthesis can roll
up later:

| Ticket | Notion URL | Fetched? | Doc type | Notion last-edited | Takeaway |
|---|---|---|---|---|---|
| PM-XXX | https://notion.so/… | ✅ read / ❌ no access / ❌ not found | AC / spec / RFC / notes | date | one line |

Every ticket gets a row per link (or one row stating "no Notion links found" —
absence is also a result). This registry is the source for the **Notion
coverage** fraction in the synthesis (e.g. "5/35 tickets have a Notion doc;
4/5 were readable").

## Step 3 — Read and extract (per document)

Fetch the page with `notion-fetch`. Extract, in this order of importance:

1. **Requirements & acceptance criteria** — the actual list, not just "it
   exists". These are what the DoR's criterion 2 is judged on.
2. **Decisions already made** — architecture/product choices recorded in the
   doc that the Jira ticket doesn't mention.
3. **Open questions** — unresolved items (also check `notion-get-comments`);
   these become refinement alerts.
4. **Referenced links** — especially **Figma** links living inside the Notion
   doc (a design "missing" in Jira may be one hop away in Notion).
5. **Scope boundaries** — explicit in/out lists, phases, constraints.
6. **Freshness signals** — last-edited date and owner; compare against the
   ticket's `updated` date.

## Step 4 — Feed the card and the DoR

Add a **`## Notion context`** section to the ticket's audit card (copy the
skeleton from `assets/notion-context-block.md`) with the registry rows, the
extracted takeaways, and any discrepancies. Then adjust the audit:

- **DoR criterion 2 (AC defined):** a Notion link **only counts as ✅ if the doc
  was opened and actually contains AC/requirements** — note it as *"externalized
  in Notion — read"*. A link that couldn't be read is **⚠️ externalized,
  unverified**. No link and no AC is ❌.
- **Status semantics:** content read from Notion is **documented fact** (✅ with
  source) — *not* 🔎 deduced. Reserve 🔎 for what you infer **beyond** what the
  doc states (then log it under *Deductions to verify*).
- **DoR criterion 7 (context):** decisions/scope read from Notion can raise it;
  cite the doc.
- **Design hunt:** Figma links found inside Notion docs count as found designs —
  record where they were found.
- **Discrepancy alert:** if the Notion doc contradicts the Jira ticket (scope,
  AC, status) or is much newer/older, flag it in **bold** as a refinement alert —
  deciding which source wins is the PM's call, not yours.

## Gotchas

- **The AC field being "filled" means nothing by itself** — when it's just a
  link, the real AC live in Notion and must be read before judging readiness.
- **Access can fail** (private page, revoked share). Record *"linked but not
  readable"* and treat criterion 2 as ⚠️ — don't downgrade to ❌ (the doc exists)
  and don't upgrade to ✅ (you couldn't verify it).
- **Notion pages drift from tickets.** Always capture last-edited vs ticket
  updated; a stale doc is a finding, not background noise.
- **Tool namespacing:** under Claude Code the server key is `notion`, so tools
  appear as `mcp__notion__notion-fetch`, `mcp__notion__notion-search`,
  `mcp__notion__notion-get-comments`.
- **Don't paste whole pages into the card.** Extract the six items from Step 3;
  link the rest.

## How the other skills/agents use it

- **jira-ticket-audit** — runs this as **Step 3b** for every ticket whose hunt
  surfaced a `notion.so` URL; the card gains the `## Notion context` section.
- **definition-of-ready** — consumes the ✅ *read* / ⚠️ *unverified* semantics for
  externalized AC (criterion 2) and context (criterion 7).
- **jira-backlog-synthesis** — rolls the registry up into a **Notion coverage**
  fraction and lists what lives in Notion and wasn't opened (methodology
  limitations + design review).
- **jira-ticket-auditor agent** — carries the read-only Notion tools in its
  tool scope.

## Reference files

- `assets/notion-context-block.md` — the `## Notion context` card section to
  copy and fill.

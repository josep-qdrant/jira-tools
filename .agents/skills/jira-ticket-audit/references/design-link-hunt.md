# Design / Figma link hunt + UI design-effort classification

## Why this is its own step

For a UI ticket, "is the design linked?" can't be answered by checking the
design field alone. Teams paste Figma into descriptions, attach screenshots that
aren't designs, or — most often — add the design as a **remote/web link** that
never shows up in the obvious field. If you only check the design field you'll
wrongly conclude "no design" (or worse, miss one that exists).

## The five places to check (per ticket)

> **Also check linked/child tickets (Step 3c).** Run the same five-place hunt
> on every subtask, blocked-by, and related Jira issue (one hop). A design or
> spec "missing" on the parent is frequently attached to a linked ticket.
> See `jira-ticket-audit` Step 3c for the full procedure.

1. **Design fields** — the project's design-related custom fields (names vary;
   e.g. UX/Concept/Design/Technical-Documentation fields from the field map).
   Often empty even when a design exists elsewhere.
2. **Attachments** — list them and **verify what each actually is**. A PNG can be
   product information or a reference photo, not a UI mockup. Only count it as a
   design asset if it really is one.
3. **Description & Acceptance Criteria** — grep the text for `figma.com`,
   `notion.so`, or other design/spec URLs. (AC is frequently just a Notion link —
   when it is, **open and extract it** with the `jira-notion-context` skill,
   Step 3b of the audit; a Figma may be hiding one hop away inside the doc.)
4. **Issue links** (`issuelinks`) — usually Jira↔Jira dependencies, occasionally
   a design ticket.
5. **Remote / web links** (`getJiraIssueRemoteIssueLinks`) — **the most common
   home for Figma.** Always query this for UI tickets. A ticket can show 0 here,
   which is itself a finding ("0 remote links → no Figma").

Record where you looked and what you found, so the synthesis design-review doc
can state coverage precisely (e.g. "0 / 11 UI tickets have a Figma link").

## Following external links found during the hunt

When the five-place hunt surfaces a URL that is not Figma or Notion, don't stop
at "link exists" — follow it:

| URL type | Action | Tool / method |
|----------|--------|---------------|
| `slack.com/archives/…` | Read the thread; extract decisions, design links, open questions. Note channel and date. | `slack_read_thread` (`mcp__slack__` or `mcp__claude_ai_Slack__` prefix) — see `slack-mcp` skill for URL parsing |
| `github.com/…/pull/N` | Fetch PR title, state, body; look for Figma/Notion links inside the body. | `gh pr view N --repo owner/repo --json title,state,body,url` via Bash — see `gh-cli` skill |
| `github.com/…/issues/N` | Fetch issue title, state, body. | `gh issue view N --repo owner/repo --json title,state,body,url` via Bash — see `gh-cli` skill |
| `figma.com/…` found inside a Slack thread, PR body, or Notion doc | Confirm it resolves and credit it as a found design — same as a Figma link found directly on the ticket. | `get_metadata` (`mcp__figma__` or `mcp__claude_ai_Figma__` prefix) — see `figma-mcp` skill |
| Any Jira key (`ABC-NNN`) | Collect for Step 3c recursion — don't follow inline. | — |

## A missing Figma is not automatically a blocker

The important nuance: even with no Figma, many UI tickets don't need *new*
design because the codebase already implements the pattern. Classify each UI
ticket into one of three levels by inspecting the UI repo:

| Level | Meaning | Action |
|-------|---------|--------|
| **Extrapolable** | The pattern/component already exists; reuse or extend it. | No new Figma. Link the component/pattern to reuse in the ticket. |
| **Partial** | Reuses most existing patterns; only one new sub-part needs a design decision. | Light, targeted design for just the new sub-part. |
| **New design** | No analogous pattern exists, **confidently** (see below for the unsure case). | Reserve real design/Figma effort here. |

This turns "0/11 have Figma" (alarming) into "only 3/11 actually need new
design" (actionable). Do the classification in Step 4 of the skill (code
identification) and carry it into both the card and the synthesis design review.

### When you're not sure which level applies — default to deducible

The classification is itself a judgment call, and the call matters: labeling
something "New design" when it's actually a small variation of an existing
pattern overstates the gap and makes a ready-ish ticket look blocked on
design when it isn't. The default runs toward "has design", not toward
"missing":

- **Confidently deducible** — a clear analogous pattern exists → **Extrapolable**
  (or **Partial** if only part of it matches).
- **Genuinely unsure** — something similar exists but you can't tell if it's
  close enough to actually cover the ask → **still Extrapolable/Partial, not
  New design.** Doubt resolves toward "deducible", never toward "missing".
- **Confidently NOT deducible** — you checked the UI repo and no analogous
  pattern exists anywhere → **New design.** This is the only case that counts
  as a real design gap.

Either way it's a **deduction**, never a confirmed ✅ — see the
`definition-of-ready` skill's Deduction rules (🔎, never ✅; log it; keep the
verdict conditional). Its "confirm by" must name what would actually close
the deduction, and for a design deduction that's always one of these two:

- **More implementation detail** on what the ticket is really asking for —
  the real scope might turn out bigger than the pattern covers.
- **An explicit confirmation that it's "similar to" `<the cited existing
  pattern or ticket>`** — someone (PM, designer, eng) saying so, not you
  inferring it from the code alone.

This changes the failure mode from "a small ask gets flagged as a big design
gap" to "a real gap gets marked provisionally fine, but visibly unconfirmed
and cited" — the second is cheaper to be wrong about, because the card still
says so and names exactly what would confirm or overturn it.

When a Figma link **was** found but the classification is genuinely close
(does it cover the whole flow, or just part of it?), don't guess from the
ticket text alone — pull the design itself via the `figma-mcp` skill's
verification step (`get_screenshot` / `get_design_context`) and check it
against the code-side reuse assessment. Reserve this for close calls; the
existence check alone is enough for most tickets.

## Definition-of-Ready implication

Instead of "every UI ticket must have a Figma", propose: **Figma for new-design
and partial tickets; a reference to the component/pattern to reuse for
extrapolable ones.** That's the rule the synthesis docs should recommend.

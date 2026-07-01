---
name: jira-ticket-audit
description: >-
  Audit Jira backlog tickets one by one and produce a markdown audit card per
  issue. Use this after scoping a backlog (see jira-backlog-scoping) whenever you
  need to assess whether tickets are ready to plan. First detects the audit unit
  by issue-type hierarchy: a leaf ticket (Story/Task/Bug) gets the full four-axis
  audit — goal/scope clarity, UI/design needs, size-estimate coherence
  (recomputing the Score with a realistic size), and prioritization soundness —
  then a five-place design hunt and code/repo identification (written to
  `stories/`). A grouping ticket (`hierarchyLevel >= 1` — Objective/Milestone
  in this instance, "to group milestones"/"to group stories") instead skips
  the four-axis/code-reuse treatment and drills ONE LEVEL DOWN via the native
  `parent` field, whatever that level actually is: a backlog of Objectives
  gets an index card per Objective (`objectives/`) linking to one detail card
  per Milestone (`milestones/`); a backlog of Milestones (no Objective in
  scope) drills straight into each one's Stories/Bugs/Tasks/subtasks for the
  same detail card — the two card types stay in separate folders so overview
  and detail never mix. Trigger whenever someone wants to
  audit, refine, or review backlog tickets, check ticket "readiness" or
  "definition of ready" (applying the shared definition-of-ready rubric), judge
  whether estimates and scores hold up, find whether a UI ticket has a design
  linked, map a ticket to the code/projects it touches, or work out which
  Milestone is small/clear/unblocked enough to plan into the next sprint. This is
  for product/backlog tickets — for triaging inbound support/customer issues
  (P1–P4, routing) use ticket-triage. Read-only on Jira — never writes. Part 2 of
  a 3-skill workflow (follows jira-backlog-scoping, feeds jira-backlog-synthesis).
---

# Jira Ticket Audit

Turn a scoped backlog into **one audit card per ticket**. Each card judges the
ticket on four axes, records its design/Figma status, maps it to the code that
would implement it, and ends with a **Definition of Ready (DoR)** verdict (see the
`definition-of-ready` skill for the shared rubric).

This is **part 2 of 3**. It assumes `jira-backlog-scoping` (part 1) has produced
the scope, field map, and verified scoring model. Its cards feed
`jira-backlog-synthesis` (part 3). If part 1 hasn't run, do that first — or at
minimum establish the field map and scoring model before extracting.

## Ground rules (apply throughout)

1. **Read-only on Jira.** Only `searchJiraIssuesUsingJql`, `getJiraIssue`,
   `getJiraIssueRemoteIssueLinks`, metadata. Never write. The only writes are
   the markdown cards on disk.
2. **Don't invent.** If scope, design, or estimate isn't there, mark it
   explicitly as uncertain. "Not stated" beats a fabricated value.
3. **Verify.** Re-confirm `Score = Impact × Confidence × Size` on each ticket;
   recount with `grep`/`rg` when you make claims about totals.
4. **Surgical and traceable.** Each card answers what's asked. No speculative
   analysis, no restructuring of what already works.
5. **Work in batches, write before moving on.** Process ~3 issues, write their
   cards, then fetch the next batch. This keeps context from ballooning.

## Step 0 — Detect the audit unit, by hierarchy LEVEL not by type NAME

Not every ticket gets the same treatment, and which one it gets is a
**structural** question — read off `fields.issuetype.hierarchyLevel` (from
`getJiraIssue(..., expand: "names")` on a representative fetch), not off the
type's display name. Names vary per project ("Objective", "Initiative",
"Epic"…); `hierarchyLevel` doesn't. The rule generalizes to any depth:

- **`hierarchyLevel <= 0`** (Story, Task, Bug — whatever this project's base
  level is called) → **leaf ticket**: the full treatment below (Steps 1–5,
  the standard `audit-card-template`), written to `stories/`. Its own
  children (subtasks) are lateral context handled by Step 3c, not a separate
  drill-down.
- **`hierarchyLevel >= 1`** → **grouping ticket**: it isn't the plannable
  unit, its children **one level down** (`hierarchyLevel - 1`) are. Skip the
  four-axis audit and code-reuse hunt entirely; go to **Step 3d**, which
  discovers those children via the native `parent` field (never
  issuelinks/subtasks — those don't surface this hierarchy) and writes the
  matching card. **This is the same rule at every level, applied recursively
  by whatever the scope actually contains:**
  - Auditing a backlog of **Objectives** (`hierarchyLevel: 2` here) → drill
    into their **Milestones** (`hierarchyLevel: 1`).
  - Auditing a backlog of **Milestones** directly (`hierarchyLevel: 1`) →
    drill into their **Stories/Bugs/Tasks** (`hierarchyLevel: 0`) — same Step
    3d, same `parent =` query, just one level lower. A Milestone-scoped run
    never needs an "Objective" folder at all.
  - A **mixed scope** (some Objectives, some Milestones, some leaf tickets in
    one JQL result) is not a special case — Step 0 checks each ticket
    individually, so each gets routed to the right treatment and folder on
    its own.

The type-description strings ("to group milestones" / "to group
stories/mvis") are this instance's human-readable label for `hierarchyLevel`
2 and 1 — useful to confirm you read the right level, not the primary signal.
If a project has no grouping types above the base level, every ticket is a
leaf and this step is a no-op.

## Step 1 — Extract in small batches

Search responses are large by default (forced project/issuetype/status/assignee/
description blocks per issue), so asking for many issues at once blows the token
limit. What works:

- Batches of **~3 issues**: `key in (<KEY>-a, <KEY>-b, <KEY>-c)`.
- An **explicit field list**: the custom fields from the field map (Score,
  Impact-calc, Confidence select+calc, Size select+calc, Acceptance Criteria,
  any draft-requirements field, the design fields, a class/category field if
  present, Sprint) **plus** summary, status, `parent`, priority, labels,
  issuelinks, attachment. `parent` matters even for a leaf ticket — see Step 2
  criterion 1's parent-context rule.
- **Write each batch's cards before fetching the next.** Don't accumulate raw
  issue data across many batches.

> Use the **default (ADF) format**, not `markdown`, when reading issues — the
> markdown rendering truncates custom fields.

## Step 2 — Audit each ticket on four axes

For every issue, assess:

1. **Goal & scope clarity** — Is there a clear objective, bounded scope, enough
   requirements and acceptance criteria to work in the quarter without blockers?
   Is the information *in Jira* or externalized (e.g. a Notion link)? **If the
   ticket's own description is thin, check its `parent`** (the Milestone/Epic
   it sits under, from the field you already fetched in Step 1) before calling
   it a gap — a near-empty Story under a Milestone that clearly states the
   goal isn't "missing context," it's context that lives one level up. Credit
   it as 🔎 deduced from parent (never ✅), same as an externalized Notion doc.
2. **UI / Design** — Does it need a UI? What design assets are missing? (Do the
   five-place design hunt in Step 3.) Produce a checklist of missing assets.
3. **Size coherence** — Is the T-Shirt Size realistic against the real scope and
   acceptance criteria? **Recompute the Score with a realistic size** to show how
   far the ranking would move. Watch for scope hiding under a small estimate
   (API + UI + billing + migration + risky behavior all under one "XS").
4. **Prioritization** — Are Impact and Confidence logical? Does the Score hold up
   given the description? Re-verify the arithmetic. Put **incoherences in bold**.

Then write the card (Step 5). The four axes are the heart of every card.

## Step 3 — Hunt for the design / Figma in FIVE places

Don't look only at the design field — for UI tickets, the linked design hides in
several places. Check all five and record where you looked:

1. **Design fields** — the project's design-related custom fields (names vary;
   e.g. UX/Concept/Design/Technical-Documentation fields from the field map).
2. **Attachments** — and **verify what each one actually is**. An attached PNG
   may be product information, not a UI mockup; it is not a design asset.
3. **Description & Acceptance Criteria** — search for `figma.com` / `notion.so`
   URLs.
4. **Issue links** — usually Jira↔Jira, rarely a design.
5. **Remote / web links** (`getJiraIssueRemoteIssueLinks`) — **this is where
   Figma usually lives.** Always check it for UI tickets.

Record per ticket: requires UI? (yes/probable/no), design linked? (yes/no + where
found), and the missing-asset checklist. See `references/design-link-hunt.md`.

**Frontmatter to set from this step:**
- `design_linked: true | false` — was a Figma/design found at all.
- `design_source:` — which of the five places (or `none`): `jira_design_field`,
  `jira_remote_link`, `description`, `notion_doc`, `linked_ticket`, `github`,
  `slack`. Set to `none` when `design_linked: false`.
- `slack_context: found` when a `slack.com` URL is found (upgrade to `read` after
  fetching). `none` if no Slack links appear anywhere in the ticket.
- `github_context: found` when a `github.com` URL is found (upgrade to `read`
  after fetching with `gh`). `none` if no GitHub links appear.

When the hunt surfaces a `slack.com` URL (thread or channel link), fetch the
thread with `slack_read_thread` (`mcp__slack__` or `mcp__claude_ai_Slack__`
prefix, whichever is on your tool list — see `slack-mcp` skill) and note the
relevant content. When it surfaces a `github.com` URL, fetch the PR or issue
with the `gh` CLI via Bash (see `gh-cli` skill). When it surfaces a
`figma.com` URL, confirm it resolves with `get_metadata` (`mcp__figma__` or
`mcp__claude_ai_Figma__` prefix — see `figma-mcp` skill); only pull the
screenshot/design-context when the Extrapolable/Partial/New-design call is
genuinely close, not as a default step.

## Step 3b — Open & extract the linked Notion context

Whenever the hunt surfaces a `notion.so` URL (the **Acceptance Criteria field is
frequently just a Notion link**), don't stop at "link exists" — follow the
**`jira-notion-context`** skill: register the link in the Notion coverage
registry, fetch the page read-only (`notion-fetch`, prefix `mcp__notion__` or
`mcp__claude_ai_Notion__` depending on your tool list), extract
requirements/AC, recorded decisions, open questions, embedded Figma links, scope
boundaries and freshness, and add the **`## Notion context`** section to the card
(skeleton in that skill's `assets/notion-context-block.md`). The result drives
DoR criterion 2: AC externalized to Notion only counts as ✅ **if the doc was
read**; an unreadable link is ⚠️ *externalized, unverified*. Flag in **bold** any
discrepancy between the Notion doc and the Jira ticket.

**Frontmatter to set from this step:**
- `notion: read` — fetched successfully and content extracted.
- `notion: unreadable` — link found but page not accessible (no access / not found).
- `notion: none` — no `notion.so` link found anywhere in the ticket.
- If the Notion doc contains a Figma link: set `design_linked: true` and
  `design_source: notion_doc`.

## Step 3c — Recursive linked-ticket context

Every Jira ticket can carry child issues (subtasks), linked issues (blocks /
blocked-by / relates-to / duplicates / …), and remote links pointing to other
Jira keys. Those linked tickets may hold the design, spec, or discussion that
the parent ticket only gestures at. **Always chase one hop.**

### 3c-1 Collect linked tickets

Gather all Jira keys referenced by the parent from three sources:

1. **`subtasks`** field in the parent's ADF payload.
2. **`issuelinks`** field — every `inwardIssue` / `outwardIssue`, regardless of
   relationship type.
3. **Remote/web links** that point back to `*.atlassian.net/browse/…` (may be
   cross-project references).

Deduplicate, skip the parent itself, and cap at **~8 linked tickets** (record
the rest as "not followed — cap reached").

**Frontmatter to set immediately (before fetching):**
- `subtasks:` — list of Jira keys from source 1, e.g. `[ABC-208, ABC-209]`. Empty
  list `[]` if none.
- `linked_issues:` — list of Jira keys from sources 2 and 3, e.g. `[ABC-111]`.
  Empty list `[]` if none.
- These are **keys only** — titles and relationship types go in the body table.

### 3c-2 Fetch and hunt each linked ticket

For each collected key, call `getJiraIssue` (default/ADF format, explicit field
list) and run the **same five-place hunt** as Step 3:

1. Design fields (the project's design-related custom fields).
2. Attachments — verify what each one actually is.
3. Description & AC — scan for `figma.com`, `notion.so`, `slack.com`,
   `github.com` URLs.
4. `issuelinks` — check for any further Jira references (record but don't
   recurse deeper).
5. `getJiraIssueRemoteIssueLinks` — **always check**; Figma most often hides
   here.

**Do not recurse** into the linked tickets' own linked tickets — one hop only.

### 3c-3 Follow external links found in linked tickets

Apply the same external-link rules as for the parent:

- **`notion.so` link** → run Step 3b (jira-notion-context skill) on it.
- **`slack.com` link** (direct message or thread URL, e.g.
  `https://<workspace>.slack.com/archives/…`) → fetch the thread with the Slack
  MCP's `slack_read_thread` (prefix `mcp__slack__` or `mcp__claude_ai_Slack__`
  depending on your tool list). Extract the relevant decision, question, or
  design reference and summarise it. Note date and channel. See the
  `slack-mcp` skill for URL parsing and tool usage.
- **`github.com` link** (PR or issue URL) → fetch with the **`gh` CLI** via
  Bash (see the `gh-cli` skill for commands and URL parsing):
  - PR URL → `gh pr view <number> --repo <owner>/<repo> --json title,state,body,url`
  - Issue URL → `gh issue view <number> --repo <owner>/<repo> --json title,state,body,url`
  - Record title, state, and any Figma/Notion links found in the body.
- **`figma.com` link** → fetch metadata with `get_metadata` (prefix
  `mcp__figma__` or `mcp__claude_ai_Figma__` depending on your tool list). A
  design found one hop away in a linked ticket is a **found design** — credit it
  to the parent card.

### 3c-4 Record findings in the parent card

Add a **`## Linked-ticket context`** section before `## Notion context` (or
before `## Definition of Ready` when there is no Notion context). The section
is already scaffolded in the card template — fill its table.

```markdown
## Linked-ticket context

| Key | Relationship | Title | Figma | Notion | Slack | GitHub | Notes |
|-----|-------------|-------|-------|--------|-------|--------|-------|
| [[ABC-208-slug\|ABC-208]] | subtask | "Suspension API endpoint" | None | [Spec](https://…) | None | [PR #42](https://…) | API contract already exists |
| [[ABC-209-slug\|ABC-209]] | blocks | "Billing freeze on suspend" | None | None | [#billing](https://…) | None | No additional signals |
```

**Frontmatter to update after completing Step 3c:**
- `child_context: full` — all linked tickets fetched and hunted.
- `child_context: partial` — cap reached or some fetch failed.
- `child_context: none` — `subtasks` and `linked_issues` are both empty.
- If a Figma was found in a linked ticket: `design_linked: true`,
  `design_source: linked_ticket`, note *"Found via [[ABC-xxx|ABC-xxx]]"*.
- If a Slack thread was found and read in a linked ticket: `slack_context: read`.
- If a GitHub PR was found and read in a linked ticket: `github_context: read`.
- If a Notion doc in a linked ticket was read: register it in the Notion coverage
  registry (same registry as Step 3b) and note it in the body.
- If nothing extra was found in a linked ticket, still record the row with
  "No additional signals" — absence is a finding.

## Step 3d — One-level-down discovery (grouping tickets only)

Skip this step for leaf tickets — go straight to Step 4/5 for those. This step
**replaces** Steps 2–4 for a grouping ticket (`hierarchyLevel >= 1`, caught by
Step 0): no four-axis audit, no five-place design hunt, no code-reuse hunt at
the grouping level. The whole point is that this ticket isn't the plannable
unit — **whatever sits one level below it** is. What "one level below" means
depends on what's actually in scope — apply the same mechanics whether that's
Milestones under an Objective, or Stories/Bugs/Tasks under a Milestone:

### Discover children via the native `parent` field, not issuelinks

Grouping tickets connect to their children through Jira's native **`parent`**
field (Advanced Roadmaps hierarchy), which `subtasks`/`issuelinks` do **not**
surface — a ticket can show zero subtasks and only a stray "Relates" link while
still having real children one level down. Query for them explicitly with
`searchJiraIssuesUsingJql`, `parent = <this-ticket-key> ORDER BY Rank ASC` —
the same query whether `<this-ticket-key>` is an Objective (children:
Milestones) or a Milestone (children: Stories/Bugs/Tasks).

If the query returns **zero** children, that is itself a finding — record it
as "No <child-type> found under this <ticket-type>" rather than silently
skipping the section; a grouping ticket with no plannable children yet is not
ready by definition.

### Fetch each child's own fields — and, if the child is itself leaf-level, its decomposition depth too

For each child found, fetch it (`getJiraIssue`, default/ADF, explicit field
list) and pull: status, T-Shirt Size, Score/Impact/Confidence (same schema as
the parent — this hierarchy scores independently at every level), Objective
Class, Domain, description/AC, start/target dates, and any `issuelinks` of
type blocks/blocked-by. Do **not** run the five-place design hunt or the
Notion/Slack/GitHub follow-up here — that level of depth is what made the old
per-Objective cards too long for what this decision needs; a child that's
genuinely contested on design/Notion grounds gets its own standalone
`ticket-research` dossier instead (full treatment), not more prose here.

**If the child sits at `hierarchyLevel: 0`** (a Milestone's Story/Bug/Task
children) — go one level further and check *its* subtasks too
(`parent = <child-key>`, or the `subtasks` field): a Milestone that "has 3
Stories" reads very differently depending on whether those Stories are
already broken into subtasks with real progress, or are still one-liners.
Fold this into a single rollup, don't open a new section for it: e.g. "3
Stories (1 Done, 2 In Progress) · 5 subtasks across them (2 Done)." This is
exactly what a **Milestone-scoped audit** needs to show — when the *scope
itself* is Milestones (not discovered as an Objective's children), this
subtask rollup is the primary decomposition signal, since there's no
Objective layer to lean on. Stop at this depth — don't recurse into the
subtasks' own children.

**Use the parent's context when the child's own is thin.** You already have
the parent's description from Step 0/1 — no extra fetch. A child with an
empty description isn't automatically "missing context" if its parent
already states the goal clearly enough to know what the child must deliver;
credit that the same way an externalized Notion doc is credited (🔎 deduced
from parent, never ✅ — see the DoR section below). If the parent is *also*
thin, that's a real gap — say so, don't paper over two empty descriptions.

### Judge sprint-fit and write each Milestone to its own card

**Only the child ONE level below the audited ticket gets its own file** — a
Milestone (found under an Objective, or audited directly because the scope
*is* Milestones). Its own Story/Bug/Task children, two levels down, never get
a separate card here — they're the rollup signal folded into the Milestone's
card above, not independent deliverables. (A Story genuinely needs its own
card only when it's itself in scope, i.e. a leaf-ticket audit — Steps 1–5.)

Apply the `definition-of-ready` skill's **"Applying DoR to a Milestone
(sprint-fit call)"** section — weigh size, decomposition (the Stories/subtasks
you just counted), AC/definition (checking the parent's context per the rule
above), blockers, and dates — then write the Milestone's **own file**
(`milestones/<KEY>-slug.md`, skeleton `assets/milestone-card-template.md`):
the metadata header plus the condensed sprint-fit block
(`definition-of-ready/assets/milestone-sprint-fit-block-template.md`). Never
the full seven-row table here — see Step 5.

## Step 4 — Identify the implicated project(s) and code

Leaf tickets only — a grouping ticket handled in Step 3d skips straight to
Step 5's roll-up card, no code-reuse hunt at that level.

For each ticket, name the repo(s) involved, the high-level approach, and your
identification confidence. To do this well:

1. **Characterize the repos first** by reading each `README` (scope) and
   detecting language (`go.mod` / `package.json` / `pyproject.toml`). Don't
   assume language from the repo name.
2. **If `codegraph` (the `codegraph_*` MCP tools) is available, prefer it** for
   structural questions — what calls what, where a symbol is defined, blast
   radius. It's faster and more accurate than grep for "does this code exist".
3. **Otherwise do scoped term sweeps:** `rg -i -l <term> <one-repo>`, **one repo
   and a few terms at a time**. Sweeping all repos × many terms at once times
   out — scope it down.
4. Write per ticket: **project(s) involved**, **how it'd be done at a high level**
   (no file-by-file detail), **technical notes**, and **identification
   confidence**. If scope can't be pinned down, say so explicitly.

For UI tickets, also classify design effort by what the code already supports —
**Extrapolable** (a pattern/component already exists; reuse it, no new Figma),
**Partial** (reuses most; only one new sub-part needs a design decision), or
**New design** (no analogous pattern, confidently). This is what tells you a
missing Figma isn't actually a blocker. When you're genuinely unsure which
level applies, default to Extrapolable/Partial (🔎 deduced), never New design
— see `references/design-link-hunt.md` for the exact rule and how to log the
deduction. See `references/code-identification.md` for the code-side method.

## Step 5 — Write the card(s), into a type-scoped folder

Output is split into **up to three folders**, by issue type, so the objective
overview, the milestone detail, and any individually-audited stories don't
end up mixed in one pile:

- `objectives/<KEY>-slug.md` — Objective cards.
- `milestones/<KEY>-slug.md` — Milestone cards.
- `stories/<KEY>-slug.md` — leaf tickets (Story/Task/Bug) that got the full
  audit-card treatment. Only exists if the scope actually includes leaf
  tickets audited on their own — a pure Objective- or Milestone-scoped run
  has no `stories/` folder at all, because Step 3d never gives a discovered
  child two levels down the full four-axis treatment (it only
  counts/status-checks it).

A **Milestone-scoped run** (the scope's tickets are Milestones directly, not
discovered under an Objective) never creates `objectives/` at all — there's
no Objective in scope to index. Only the folders this particular scope
actually populates get created; never all three by default.

`mkdir -p` whichever of the three this batch needs before writing — don't
create folders you have nothing to put in.

**Grouping ticket (Objective)?** Write `objectives/<KEY>-slug.md` — skeleton
`assets/objective-card-template.md`: a short header (name, status, domain,
target customer, one line of intent — omit entirely if the title already says
it) followed by a **Milestones index**: one line per Milestone, verdict emoji
+ wikilink + title only. No four-axis table, no DoR block, and **no
sprint-fit reasoning here** — that lives in the Milestone's own card, which
this section only links to.

**Grouping ticket (Milestone)?** Write `milestones/<KEY>-slug.md` separately —
skeleton `assets/milestone-card-template.md`: the metadata header (status,
size, children breakdown, dates) plus the condensed sprint-fit block from
`definition-of-ready/assets/milestone-sprint-fit-block-template.md`. A
**standalone** Milestone (audited on its own, not as part of an Objective
scope — e.g. a `ticket-research` dossier on one Milestone key) gets this same
card, or the full audit-card treatment below if the request genuinely needs
the full seven-criteria rubric shown (state which one you're doing and why).

**Leaf ticket (Story/Task/Bug)?** Continue with the standard card below,
written to `stories/<KEY>-slug.md`.

Cards are **Obsidian-native markdown** (see the `obsidian-vault` skill): they
open with YAML frontmatter, cross-reference other tickets with
**wikilinks**, and render verdicts/alerts as **callouts**. Keep the prose human,
brief, and concise, and lead with the bottom line — follow the **`writing-style`**
skill. Use the structure in `assets/audit-card-template.md`. Each card is:

- **Frontmatter** — the Dataview-queryable schema (fill every field; use the
  vocabulary in the template). Fields are set progressively across Steps 3–3c
  — never leave any field blank. Full schema with per-step ownership:

  ```yaml
  ---
  ticket: <KEY>                   # e.g. ABC-207
  aliases: ["<KEY>"]
  title: "<issue title>"
  type: <issue type>              # whatever the project uses (Story, Objective, Epic…)
  status: <status>
  bucket: <sprint / backlog bucket>
  objective_class: <class>        # only if the project has such a field; else "—"
  owner: <name or "unassigned">
  priority: <priority>
  domain: <domain or "—">
  carryover: <true | false>       # was it dragged from a past quarter/sprint?
  size: <XS | S | M | L | XL | points>
  size_factor: <numeric factor>
  impact: <numeric | null>
  confidence: <numeric | null>
  score: <n | 0>
  scoring_complete: <true | false>  # false when a factor is missing (Score 0)
  requires_ui: <true | probable | false>   # ← Step 3
  design_linked: <true | false>            # ← Step 3 (or 3c if found in linked ticket)
  design_source: <none | jira_design_field | jira_remote_link | description | notion_doc | linked_ticket | github | slack>
  design_reuse: <FULL | PARTIAL | NONE | N/A>   # ← Step 4
  code_reuse: <FULL | PARTIAL | NONE>           # ← Step 4
  repos: [<repo>, <repo>]
  notion: <none | read | unreadable>       # ← Step 3b
  slack_context: <none | found | read>     # ← Steps 3/3c
  github_context: <none | found | read>    # ← Steps 3/3c
  subtasks: []                    # Jira keys of direct child/subtask issues ← Step 3c
  linked_issues: []               # Jira keys of issue-link targets ← Step 3c
  child_context: <none | partial | full>   # ← Step 3c
  dor: <ready | almost-ready | not-ready>  # ← Step 5
  jira: https://<site>/browse/<KEY>
  tags: [backlog-audit, ticket, <PROJECT>, readiness/<ready|almost-ready|not-ready>]
  ---
  ```

- **TL;DR** — a `> [!tldr]` callout right under the H1, **one line**: verdict +
  Score + the single thing that gates it. The bottom line up top; the full DoR
  block still closes the card. (writing-style skill.)
- **Header** with metadata (type, sprint + carryover note, status, class, owner,
  priority). The **Jira link stays a standard markdown URL**; any **other ticket
  referenced** (synergy, duplicate, same theme) is a **wikilink**
  (`[[ABC-285-…|ABC-285]]`).
- **Audit summary table** — one row per axis: verdict (OK / Risk / N/A) + a short
  note.
- **Project & technical notes** — repo(s), high-level approach, notes,
  identification confidence.
- **The four axes**, each as its own `## N. <axis>` section. Anchor edits on
  these stable, unique headings (see gotchas). The **estimate / hidden-scope
  alert** in axis 3 is a `> [!warning]` callout.
- **Code reuse** — what already exists vs. what's new, with a verdict
  (FULL / PARTIAL / NONE) and suggested approach.
- **`## Linked-ticket context`** — the table from Step 3c (one row per linked
  ticket, keys as wikilinks). If none: "No linked tickets — child_context: none."
  Place before `## Notion context`. Also show `subtasks:` and `linked_issues:`
  keys in the card header for at-a-glance visibility.
- **`## Notion context`** — from the `jira-notion-context` skill (Step 3b).
  If none: "No Notion links found — notion: none."
- **Definition of Ready (DoR)** — **end every card with the DoR block** from the
  `definition-of-ready` skill (don't use a freeform readiness line): the verdict
  as a callout (`> [!success]` 🟢 / `> [!warning]` 🟡 / `> [!danger]` 🔴), the
  seven-point checklist, and a one-line *"To be ready it needs: …"* drawn from the
  reason taxonomy. The four axes feed it directly — goal/scope → criteria 1–3 & 7;
  UI/design → criterion 5; size coherence → criteria 3–4 & "unrealistic estimate";
  prioritization → criterion 4 ("incomplete scoring" when the Score is 0). This
  keeps every card comparable, and `dor:` in the frontmatter mirrors the verdict.

One file per leaf ticket, in `stories/`, named `<KEY>-<kebab-slug>.md` (e.g.
`stories/ABC-207-export-reports-to-pdf.md`) — a unique basename so wikilinks
resolve cleanly regardless of which folder they live in.

## Gotchas

- **Markdown rendering truncates custom fields** → use the default format.
- **The Score can be 0** even with a size set, if Impact/Confidence are missing →
  "scoring incomplete", not a formula error.
- **An attachment is not necessarily a design** → verify what each one is.
- **Figma usually lives in remote links**, not the design field.
- **Mind each repo's real language** when filtering by glob — the wrong glob
  returns 0 and misleads (e.g. a "cluster-api" that's Python, not Go).
- **Over-broad code sweeps time out** → one repo, few terms.
- **Anchor markdown `Edit`s on stable, unique headings** (e.g.
  `## 1. Goal & scope clarity`). If a reply sits inside bold text, an `old_string`
  with trailing text may not match — use just the heading.
- **Host vs. mount paths differ:** file tools use host paths (`/Users/...`);
  `bash` uses the mount (`/sessions/<id>/mnt/...`). Account for it when copying.
- **Cards are Obsidian deliverables** → cross-ticket references are wikilinks
  (`[[ABC-285-…|ABC-285]]`), the Jira/Figma/Notion URLs stay markdown links, and the
  file opens with frontmatter. See the `obsidian-vault` skill.
- **Linked-ticket recursion is one hop only.** Fetch the linked tickets and hunt
  them; don't recurse into their links. Cap at ~8 linked tickets to avoid blowing
  token budget.
- **`parent =` finds Milestones; `issuelinks`/`subtasks` usually don't.** An
  Objective can show zero subtasks and only a stray "Relates" issuelink while
  still having real Milestone children one level down via the native `parent`
  field — Step 3c's issuelink/subtask hunt is for leaf tickets' *lateral*
  context, not for discovering an Objective's/Milestone's children. Use
  `parent = <key>` (Step 3d) for that.
- **Slack thread URLs** look like `https://<workspace>.slack.com/archives/C.../p...`;
  use `slack_read_thread` with the channel ID and thread timestamp extracted from
  the URL.
- **GitHub → use `gh` CLI** (not an MCP). Run via Bash: `gh pr view <n> --repo
  <owner>/<repo> --json title,state,body,url`. See the `gh-cli` skill for the
  full command reference and URL parsing. Requires `gh auth login` beforehand.

## Related skills

- **`definition-of-ready`** — owns the DoR rubric (verdicts, the seven-point
  checklist, the reason taxonomy, and the copy-paste DoR block). Every card ends
  with its block: this skill *judges*, that skill *defines*.
- **`jira-notion-context`** — owns Step 3b: detecting, registering and reading
  the Notion docs linked from tickets (read-only via the `notion` MCP) and the
  `## Notion context` card section. Use it for every ticket with a `notion.so`
  link before judging DoR criterion 2.
- **`writing-style`** — how the card *reads*: human, brief, concise, no
  repetition, TL;DR-first. `obsidian-vault` owns the format; this owns the voice.
- **`figma-mcp`** — owns Figma MCP usage during the design hunt (Step 3/3c):
  the existence check every Figma link gets, and the screenshot/design-context
  verification reserved for close design-effort classification calls.
- **`jira-context-gatherer`** (agent) — when run inside a workflow, this agent
  does the retrieval portions of Steps 1, 3, 3b, 3c, and 3d (the `parent =`
  discovery only) on the cheap tier and hands you a context dump to read
  first; you do the judgment (Steps 2, 4, 5, or the sprint-fit call for 3d).
  Standalone, you do both yourself.

## Reference files

- `assets/audit-card-template.md` — the per-ticket card skeleton to copy and
  fill; the DoR block closes a standard card, followed by an **optional appendix**
  (Open questions + Recommendation for ticket-research dossiers; Escalated review
  for escalation passes). Based on a real, well-formed card. **Leaf tickets
  only** (`stories/`) — see the next two assets for grouping tickets.
- `assets/objective-card-template.md` — the Objective index skeleton
  (`objectives/`): grouping header + a Milestones index (verdict emoji +
  wikilink + title only, no reasoning).
- `assets/milestone-card-template.md` — the Milestone card skeleton
  (`milestones/`): metadata header + the condensed sprint-fit block from
  `definition-of-ready`. This is where the real detail lives.
- `references/design-link-hunt.md` — the five places a design hides, plus the
  Extrapolable / Partial / New-design classification for UI tickets.
- `references/code-identification.md` — how to characterize repos and run scoped
  sweeps (or use codegraph). It builds the repo map per run; if you keep a local
  environment reference (`*.local.md`) with your repos, point it there.

---
name: jira-backlog-synthesis
description: >-
  Roll up per-ticket Jira audit cards into a cross-cutting synthesis package and
  prove the whole audit was read-only. Use this LAST in a backlog audit, once the
  per-ticket cards exist (see jira-ticket-audit), to produce the executive
  summary, master table (ordered by Score with the formula verified), cross-cutting
  findings, the quarter/sprint readiness plan with a Definition of Ready,
  the methodology + scoring-model write-up, the design/Figma coverage review, the
  code-reuse review, the tickets-by-project matrix, a thematic grouping that
  clusters tickets into logical themes/conceptual objectives, an index, and an
  actions-audit report demonstrating that nothing in Jira was changed. When the
  scope is Objective-type tickets (jira-ticket-audit wrote lean Objective/
  Milestone roll-up cards, not full audit cards), produces a single condensed
  Milestone Plan instead of the full package — see "Objective-scoped runs"
  below; a real Objective→Milestone hierarchy already exists in Jira, so the
  thematic-grouping inference and the other 9 docs would be redundant weight for
  that scope. Trigger whenever someone wants to wrap up a backlog audit, generate
  an executive summary or master table of a backlog, write quarter/sprint
  planning recommendations from audited tickets, surface cross-cutting backlog
  findings, group tickets by theme/topic so they can be tackled by conceptual
  objective, work out which Milestones are ready for the next sprint, or
  document that a Jira analysis touched nothing. Read-only on Jira — never
  writes. Part 3 of a 3-skill workflow (follows jira-backlog-scoping and
  jira-ticket-audit).
---

# Jira Backlog Synthesis

Turn the per-ticket cards into the documents a planning audience actually reads:
a verdict, a ranked table, the patterns that repeat, a readiness plan, and the
proof that the audit changed nothing in Jira.

This is **part 3 of 3**. Inputs: the per-ticket cards from `jira-ticket-audit`
(part 2) and the scope + verified scoring model from `jira-backlog-scoping`
(part 1). Don't synthesize ahead of the cards — every cross-cutting claim must
trace back to a card or a verified count.

## Ground rules (apply throughout)

1. **Read-only on Jira.** The synthesis is built from the cards on disk and any
   read-only re-queries (`searchJiraIssuesUsingJql`, `getJiraIssue`,
   `getJiraIssueRemoteIssueLinks`, metadata). Never write to Jira.
2. **Don't invent.** Every number in the master table and every cross-cutting
   finding must come from a card or a re-verified count — not from memory.
3. **Verify.** Re-confirm the Score formula in the master table, and **recount
   totals with `grep`/`rg`** (counts by status, by size, Figma coverage, etc.)
   before asserting them. "Looks right" is not evidence.
4. **Surgical.** Produce exactly the documents below; don't add speculative
   sections.
5. **Obsidian-native output.** Every doc opens with YAML frontmatter, links to
   sibling docs and to tickets with **wikilinks** (`[[02_MASTER_TABLE|…]]`,
   `[[ABC-207-…|ABC-207]]`), and renders the read-only note as a `> [!info]`
   callout. External URLs stay markdown links. See the `obsidian-vault` skill;
   the frontmatter schema is below.
6. **TL;DR-first and human.** Every doc opens with a one-line `**TL;DR:**` under
   its H1, then descends most-important to least — the verdict never hides at the
   bottom. Keep the prose concise and human, no filler or repetition. See the
   `writing-style` skill.

## The deliverable set

Write these into the working folder. Suggested filenames/order (English):

| File | Purpose |
|------|---------|
| `00_README_index.md` | Index + suggested reading order + 1-line scoring recap + top-3 immediate actions. |
| `01_EXECUTIVE_SUMMARY.md` | One-sentence verdict, key findings, critical alerts, process recommendation. |
| `02_MASTER_TABLE.md` | All issues in one table, ordered by Score, with a formula-check column + quick stats. |
| `03_CROSS_CUTTING_FINDINGS.md` | Repeating patterns (H1, H2, …), each with evidence + recommended action. |
| `04_PLAN_RECOMMENDATION.md` | Readiness tiers, a shortlist, and a proposed Definition of Ready. |
| `05_METHODOLOGY_AND_SCORING.md` | How scope was obtained, the field map, the deduced + verified scoring model, limitations. |
| `06_DESIGN_FIGMA_REVIEW.md` | Design/Figma coverage across UI tickets + the extrapolable/partial/new-design split. |
| `07_CODE_REVIEW.md` | Per-UI-ticket: reuse existing code vs. needs new design, with cited paths. |
| `08_TICKETS_BY_PROJECT.md` | Which repo(s) each ticket touches (matrix + counts) + tickets with un-scopable scope. |
| `09_THEMATIC_GROUPING.md` | Tickets clustered into logical themes (conceptual objectives) so the backlog can be tackled group-by-group, not just ticket-by-ticket. |
| `ACTIONS_AUDIT.md` | Enumerates every connector call and confirms all were reads. |

The exact structure of each document is in `references/synthesis-docs.md` — read
it before writing. `assets/` holds copyable skeletons for the index and the
actions-audit report.

**This 10-doc-plus-actions-audit package is for leaf-ticket scopes** (the
cards are the full Story/Task-level audit-card-template). See the next
section for the alternate, much shorter package when the scope is
Objective-type.

### Objective-scoped runs: the Milestone Plan (condensed mode)

When `jira-ticket-audit` wrote **lean roll-up cards** (Step 0 detected
Objective/Milestone-type tickets — check a card's frontmatter: `objective:`
+ `milestones:` instead of `ticket:` + `dor:`), don't produce the 10-doc
package above. It was sized for auditing individual Stories; running it over
Objectives repeats content the roll-up cards already state concisely, and
adds output (executive summary, cross-cutting findings, code review,
tickets-by-project, thematic grouping…) that doesn't help the one decision
this scope needs: **which Milestone is small/clear/unblocked enough to plan
into the next 2-week sprint.** Notably, **09_THEMATIC_GROUPING's whole job —
inferring conceptual objectives because no native field backs them — is moot
here: the Objective/Milestone hierarchy is a real Jira field (`parent`), not
an inference.**

Write exactly **two** files instead — and keep `MILESTONE_PLAN.md` an
**overview only**. The full reasoning for each Milestone (the "Sprint fit: …
Needs: …" line) already lives in its Objective's roll-up card; restating it
here would be the exact duplication this mode exists to cut. This doc's only
job is: can I see everything at a glance, and can I click through to the one
Milestone I care about?

1. **`MILESTONE_PLAN.md`**:
   - TL;DR: total Objectives, total Milestones, and the verdict split
     (🟢/🟡/🔴) across all Milestones in scope. This is the whole "vision
     general."
   - **By Objective** — the entire body, **one line per Objective**: a
     wikilink to its roll-up card, title, status, and then each of its
     Milestones as `<verdict-emoji> [[Milestone-wikilink]]` — verdict and key
     only, no reasoning text (that's one click away). Example:
     `- [[PM-207-slug|PM-207]] Reduce k8s permissions (In Progress) — 🟡 [[ABC-118-slug|ABC-118]]`.
     An Objective with zero Milestones gets its own line too: `— No Milestones
     found`. **Nothing else in this document** — no separate sprint-candidates
     list, no reason-grouped breakdown, no methodology section: the scope
     JQL and field map already live in frontmatter and the scoping hand-off
     note; don't restate them here.
2. **`ACTIONS_AUDIT.md`** — unchanged, same as the leaf-ticket package (cheap,
   and the read-only proof matters regardless of scope).

Still **recount** the verdict split with `grep`/`rg` against the roll-up
cards' frontmatter before asserting it, and still open with frontmatter +
wikilinks per the `obsidian-vault` skill. Everything else in this
skill — the ground rules, the "don't invent" / "verify" discipline, the
final-verification checklist — applies unchanged; only the deliverable set
shrinks.

**Frontmatter (open every synthesis doc with it):**

```yaml
---
title: "Master table"
doc: master-table          # index | executive-summary | master-table | cross-cutting | plan | methodology | design-review | code-review | tickets-by-project | actions-audit | milestone-plan
team: "<team>"
board: <NNN>
project: <KEY>
scope: "<sprints/filter>"
generated: <YYYY-MM-DD>
readonly: true
tags: [backlog-audit, synthesis]
---
```

## Key construction notes

**Resynthesis passes.** If this run re-derives the package from cards that
were only partially updated since the last synthesis (e.g. a Notion doc that
was `unreadable` before and is now `read`), state the delta once — in `00`'s
info callout and `01`'s key findings — and give every other doc a single
line ("unchanged since the prior pass, see [[01_EXECUTIVE_SUMMARY|01]]")
instead of re-narrating the same delta in each document's own words. Only a
doc whose own numbers or verdict actually changed gets to explain *why* in
its own terms.

**Master table (02).** Order by Score descending. Each issue cell is a **wikilink**
to its card (`[[ABC-207-export-reports-to-pdf|ABC-207]]`). Include a column
that shows `Impact × Confidence × Size ✓` (the explicit reconciliation), so a
reader can see the formula holds and which rows are "scoring incomplete". Add quick stats: by
sprint, by status, by size, scoring completeness, documentation/design coverage,
assignment, and cross-quarter carryover. Put a ⚠ on any row whose top rank
depends on an optimistic size.

**Cross-cutting findings (03).** These are the patterns the per-ticket cards
reveal in aggregate — e.g. "optimistic size inflates the ranking",
"acceptance-criteria/design vacuum in Jira", "scoring incomplete", "impact
inflated at the top", "duplicates to consolidate". Each finding = evidence
(specific tickets/numbers) + a recommended action. The recurring structural one
is the **inverse-size effect**: show a table of `Score` vs. `Score at a realistic
size` for the worst offenders.

**Plan (04).** Don't pretend to know team velocity. Sort by *what's ready*, not
*how much fits*: Tier A (executable after light refinement), Tier B (recalibrate
size/impact first), Tier C (discovery/decision needed — spike candidates), plus
a "hygiene now" list (e.g. remove Done items still in the backlog; complete
Score-0 items). **Group the readiness tiers by the DoR verdict** (🟢 Ready /
🟡 Almost ready / 🔴 Not ready) carried on each card, and within 🔴 by reason
(incomplete scoring, placeholder/missing context, épic, unrealistic estimate).
End with the **Definition of Ready** checklist from the `definition-of-ready`
skill — don't reinvent it here; reuse the shared rubric.

**Methodology (05).** Reuse the scope + scoring note from part 1. State scope
reconstruction, the field map, the scoring model with the value mappings, the
arithmetic verification result, and limitations (which mappings were inferred,
what lives in Notion and wasn't opened).

**Design (06) & Code (07) reviews.** Report Figma coverage as a fraction
(e.g. "0/11 UI tickets have a Figma link") and immediately reframe with the
code reality ("but only 3/11 need new design"). Use the `design_source` field
from each card to break down **where** designs were found — across all eight enum
values (`jira_design_field`, `jira_remote_link`, `description`, `notion_doc`,
`linked_ticket`, `slack`, `github`, `none`) — this shows the team which
sources are worth checking first in future audits, and flags any design found
"one hop away" in a linked ticket (parent ticket itself has no direct link).

Report **external-context coverage** using the four frontmatter fields — **06
is the sole owner of the full breakdown**; every other doc (`02`, `05`)
gets one line plus a wikilink to `06`, not a repeat of the four bullets below:
- **Notion** (`notion:`): X/N tickets with `read`, Y/N `unreadable`, Z/N `none`.
  Unreadable docs → methodology limitations.
- **Slack** (`slack_context:`): X/N tickets had a thread found; Y/N were read.
- **GitHub** (`github_context:`): X/N tickets had a PR/issue found; Y/N were read.
- **Linked tickets** (`child_context:`): X/N tickets had linked/child issues;
  Y/N fully hunted, Z/N partial (cap or access error). Summarise how many designs,
  Notion docs, Slack threads, and GitHub PRs were found via linked tickets only —
  this is the "one hop away" signal worth tracking.

Any bold Notion↔Jira discrepancies from cards → call them out. The code review
cites the actual component/file paths found, confirmed by the owning team.

**Tickets-by-project (08).** A matrix (★ leader · ● involved · ○ minor/possible)
across repos, per-repo ticket counts, and an explicit list of tickets whose scope
is **not** confidently identifiable (with the open question for each).

**Thematic grouping (09).** Cluster every ticket into a logical theme (e.g.
"Backups", "Hybrid Cloud lifecycle", "Cluster UI") so the backlog can be
approached by conceptual objective instead of one ticket at a time. Ground
rules specific to this doc:
- **No native Jira field backs this.** Unlike Score or DoR, there is no
  `Theme`/`Initiative` field to read — this is a synthesis judgment call over
  each card's title + description + `domain`. Say so explicitly in the doc; it
  is inference, not a verified fact.
- **One theme per ticket** — a clean partition, every ticket appears exactly
  once. If a ticket clearly straddles two themes, put it in the theme its
  *primary* deliverable belongs to and note the overlap in that theme's
  rationale (cross-reference the other theme by wikilink) rather than
  double-counting it.
- **Evidence per theme**: cite the one-line TL;DR (or a short quote) from each
  member ticket's card — the same standard as cross-cutting findings. Don't
  assert a grouping without the evidence that justifies it.
- **Per theme, report**: member tickets (wikilinks), combined Score, DoR mix
  (🟢/🟡/🔴 counts), and a one-line rationale for why they belong together.
- **Flag cross-theme dependencies** the cards already surfaced (e.g. one
  ticket's Notion doc or comment thread explicitly overlaps another ticket in
  a different theme) — these are candidates for sequencing, not for merging
  the themes.
- This groups **existing** tickets; it is not a proposal to create new Jira
  epics/initiatives. If the team wants a persistent Theme field, say so as a
  recommendation, not an action taken.

**Actions audit (`ACTIONS_AUDIT.md`).** Enumerate every Jira/connector call made
during the audit, mark each as a read, list the write tools that were available
but **not** used, and record the only writes (local markdown files). This is the
proof that the board, issues, and fields are exactly as before. See
`assets/actions-audit-template.md`.

## Final verification before handing off

- **Recount** every aggregate with `grep`/`rg` against the cards (counts by
  status/size, Figma coverage, scoring-incomplete count). Fix any mismatch.
- **Re-check** the master-table arithmetic column.
- **Obsidian check:** every doc opens with frontmatter; internal references are
  wikilinks (`rg '\]\([0-9].*\.md\)|\]\(tickets/' *.md` should return nothing —
  those are markdown links to deliverables that should be wikilinks); external
  URLs remain markdown links.
- If you worked in a scratchpad, **copy everything into the working folder** and
  confirm it's there. Remember host vs. mount paths: file tools use host paths
  (`/Users/...`), `bash` uses the mount (`/sessions/<id>/mnt/...`); copy with
  `cp <scratchpad>/*.md <working-folder-mount>/`.
- If `Write` fails with "outside connected folders", the working folder isn't
  mounted — mount it, then write.

## Reference files

- `references/synthesis-docs.md` — the exact section structure of each of the 10
  documents, with what goes in each. Read before writing the docs.
- `assets/index-template.md` — skeleton for `00_README_index.md`.
- `assets/actions-audit-template.md` — skeleton for `ACTIONS_AUDIT.md`.

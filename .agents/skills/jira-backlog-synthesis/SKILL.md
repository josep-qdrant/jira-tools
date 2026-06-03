---
name: jira-backlog-synthesis
description: >-
  Roll up per-ticket Jira audit cards into a cross-cutting synthesis package and
  prove the whole audit was read-only. Use this LAST in a backlog audit, once the
  per-ticket cards exist (see jira-ticket-audit), to produce the executive
  summary, master table (ordered by Score with the formula verified), cross-cutting
  findings, the quarter/sprint readiness plan with a Definition of Ready,
  the methodology + scoring-model write-up, the design/Figma coverage review, the
  code-reuse review, the tickets-by-project matrix, an index, and an
  actions-audit report demonstrating that nothing in Jira was changed. Trigger
  whenever someone wants to wrap up a backlog audit, generate an executive
  summary or master table of a backlog, write quarter/sprint planning
  recommendations from audited tickets, surface cross-cutting backlog findings,
  or document that a Jira analysis touched nothing. Read-only on Jira — never
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
| `ACTIONS_AUDIT.md` | Enumerates every connector call and confirms all were reads. |

The exact structure of each document is in `references/synthesis-docs.md` — read
it before writing. `assets/` holds copyable skeletons for the index and the
actions-audit report.

## Key construction notes

**Master table (02).** Order by Score descending. Include a column that shows
`Impact × Confidence × Size ✓` (the explicit reconciliation), so a reader can see
the formula holds and which rows are "scoring incomplete". Add quick stats: by
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
(e.g. "0/11 UI tickets have a Figma link") and immediately reframe it with the
code reality ("but only 3/11 need new design"). The code review cites the actual
component/file paths found, and notes they should be confirmed by the owning team.

**Tickets-by-project (08).** A matrix (★ leader · ● involved · ○ minor/possible)
across repos, per-repo ticket counts, and an explicit list of tickets whose scope
is **not** confidently identifiable (with the open question for each).

**Actions audit (`ACTIONS_AUDIT.md`).** Enumerate every Jira/connector call made
during the audit, mark each as a read, list the write tools that were available
but **not** used, and record the only writes (local markdown files). This is the
proof that the board, issues, and fields are exactly as before. See
`assets/actions-audit-template.md`.

## Final verification before handing off

- **Recount** every aggregate with `grep`/`rg` against the cards (counts by
  status/size, Figma coverage, scoring-incomplete count). Fix any mismatch.
- **Re-check** the master-table arithmetic column.
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

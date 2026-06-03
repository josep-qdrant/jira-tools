# Structure of each synthesis document

Section-by-section structure for the 10 deliverables. Adapt headings to the
team/quarter; keep the substance. Every figure must trace to a per-ticket card
or a re-verified count.

> [!note] Obsidian conventions (apply to every doc below)
> Each file opens with the synthesis frontmatter (see the `jira-backlog-synthesis`
> skill). Links to sibling docs and to ticket cards are **wikilinks**
> (`[[02-master-table|…]]`, `[[PM-207-…|PM-207]]`); ticket keys in prose are
> wikilinks too. The "read-only, nothing modified in Jira" line is a `> [!info]`
> callout. External URLs (Jira/Figma/Notion) stay markdown links. See *Output
> format — Obsidian vault* in `AGENTS.md`.

## 00_README_index.md

- Title + one-paragraph framing (team, board, scope, # issues, the axes audited).
- A `> [!info]` callout: "Read-only, nothing modified in Jira. Generated <date>."
- **Suggested reading order** — a numbered list pointing at 01–08 as **wikilinks**.
- **Cards by bucket** — a small table listing the issue keys per sprint/bucket,
  each key a **wikilink** to its card (`[[PM-207-…|PM-207]]`).
- **One-line scoring recap** — the formula + value mappings.
- **Top 3 immediate actions.**

## 01_EXECUTIVE_SUMMARY.md

- Header (team, board, scope split, date) + read-only note.
- **Verdict in one sentence** — the honest bottom line.
- **Key findings** — a numbered list (7–9), each a crisp claim with the evidence.
- **Critical alerts (immediate action)** — bullets.
- **Process recommendation** — the refinement pass to run before planning.

## 02_MASTER_TABLE.md

- Header: # issues, ordering (Score desc), date, the formula + mappings.
- The table. Columns: `# | Issue | Title | Bucket | Status | Size | Imp | Conf |
  **Score** | I×C×T ✓ | UI | Design/AC in Jira | Readiness`. The **Issue** cell is
  a **wikilink** to the card (`[[PM-207-self-service-cluster-suspension|PM-207]]`).
- A ⚠ note under the table for any rank that hinges on an optimistic size.
- **Quick stats:** by bucket; by status (table); by size; scoring completeness
  (X/N complete, Y/N at Score 0); documentation/design coverage (design fields,
  Figma on UI tickets, attachments, AC, draft requirements); assignment;
  cross-quarter carryover.
- Optional: a compact Figma-coverage table (issue · requires UI? · Figma?).

## 03_CROSS_CUTTING_FINDINGS.md

- Intro line: "patterns across the N issues, with evidence + action".
- One `## H<n> — <pattern>` section each. Typical patterns:
  - **H1 Optimistic size inflates the ranking** — include a table of
    `Score` vs `Score at realistic size` for the worst offenders.
  - **H2 Estimates probably low** — list with the hidden scope.
  - **H3 Acceptance-criteria / design vacuum in Jira** — what's empty; Figma
    coverage; the DoR action.
  - **H4 Scoring incomplete / data hygiene** — Score-0 items; Done-but-in-backlog.
  - **H5 Impact inflated at the top** — convenience work carrying max Impact.
  - **H6 Duplicates / scattered themes** — designate one owner issue per theme.
  - **H7 Bucket vs. score mismatch** — items mis-bucketed relative to Score.
  - **H8 Ownership & carryover** — unassigned top items; items dragged across
    quarters.
- Each section ends with **Action:**.

## 04_PLAN_RECOMMENDATION.md

- Framing: sorted by readiness, not capacity (velocity unknown).
- **Tier A — executable after light refinement** (table: issue · Score · why
  ready · minimal pre-work).
- **Tier B — recalibrate before committing** (table: issue · current Score ·
  problem · expected Score after recalibration).
- **Tier C — discovery/decision first** (table: issue · Score · what's missing).
- **Hygiene (do now)** (table: issue · action).
- **Recommended shortlist** (ordered by value × readiness, with caveats).
- **Design effort recap** — the extrapolable/partial/new-design split.
- **Proposed Definition of Ready** — a checklist.

## 05_METHODOLOGY_AND_SCORING.md

- Header (team, board, date, scope).
- **How the scope was obtained** — the quick-filter≠JQL note, the actual JQL,
  the result count, what the buckets really are (future sprints).
- **Field map** — the customfield→label table.
- **Scoring model (deduced)** — formula, value-mappings table, the inverse-size
  implication, the arithmetic-verification result (X/N reconcile).
- **The audit axes** — the four axes, one line each.
- **Limitations** — inferred mappings, externalized (Notion) content not opened.

## 06_DESIGN_FIGMA_REVIEW.md

- The question ("do UI tickets have a linked design?") and the short answer
  (coverage as a fraction, e.g. 0/11).
- **Where I looked** — the five places, with the result of each.
- **Per UI ticket** table: issue · Score · Figma link? · design extrapolable
  from code? (Extrapolable / Partial / New design).
- **Non-UI tickets** (no Figma expected) table.
- **Design-effort summary** — the 5/3/3 style split.
- **Recommendation** — don't block extrapolable ones; reserve design for
  new-design; the UI Definition of Ready rule.

## 07_CODE_REVIEW.md

- Header: repo(s), stack, read-only.
- Objective: which UI tickets need *new* design vs. can extend existing code.
- One-sentence result (the 5/3/3 split).
- **Classification table** (Extrapolable / Partial / New design → issues).
- **Per-issue detail**, grouped by level, **citing real file/component paths**
  found in the repo.
- **Recommendations** + a note that the owning team should confirm the paths.

## 08_TICKETS_BY_PROJECT.md

- Header: repos base path, date, read-only.
- Short repo characterization (name, language, scope) — correct any name/language
  drift discovered.
- **Who leads each ticket** (leader repo → count → tickets).
- **Involvement matrix** (★ leader · ● involved · ○ minor/possible) across repos.
- **Per-repo ticket counts** (incl. secondary involvement).
- **Tickets with scope NOT confidently identifiable** — each with its open
  question.
- **Caveats** — language gotchas, internal-vs-customer distinctions, "confirm per
  team".

## ACTIONS_AUDIT.md

See `assets/actions-audit-template.md`.

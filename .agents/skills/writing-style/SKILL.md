---
name: writing-style
description: >-
  How every Jira-audit deliverable should READ: human, brief, concise, no
  repetition, no filler — and TL;DR-first (inverted pyramid: bottom line on top,
  detail below, so reading the top of the file is enough for a general view).
  Use whenever you write or edit any markdown deliverable (audit cards, synthesis
  docs, dossiers, sprint/triage notes). Trigger when asked to "humanize",
  "make it concise/less verbose", "cut the fluff", "add a TL;DR", "it's too
  repetitive", "it reads like a robot/AI", or "it's padded with empty/placeholder
  sections". Cross-cutting voice + concision +
  ordering skill the audit, synthesis, DoR, scoping and sprint skills all defer
  to — the sibling of obsidian-vault, which owns format mechanics. Judgment only;
  never writes to Jira.
---

# Writing style — human, concise, TL;DR-first

One job: how deliverables **read**. `obsidian-vault` owns the *format mechanics*
(frontmatter, wikilinks, callouts, tags); this owns the *prose and the ordering*.
Apply both to every file written to disk.

The test for any deliverable: **a reader who stops after the top of the file
still understands the verdict and why.** Everything below only adds depth.

## 1. TL;DR-first (inverted pyramid) — non-negotiable

Every standalone deliverable **opens with its bottom line**, then descends from
most to least important. The conclusion never hides at the bottom.

- **Audit card / dossier** — a `> [!tldr]` callout directly under the H1, **one
  line**: verdict + Score + the single thing that gates it. The full DoR block
  still closes the card (canonical); the TL;DR is its one-line preview, not a copy.
- **Synthesis doc** — a `**TL;DR:**` line directly under the H1: the doc's bottom
  line in one sentence (e.g. *"9/19 ready, 6 blocked on AC; the ranking is
  inflated by optimistic sizes — recalibrate the top 4 first."*).
- **Package** — `00_README` + `01_EXECUTIVE_SUMMARY` are the package-level TL;DR;
  keep them skimmable and put the verdict in the first sentence.

Order sections so the high-value ones (verdict, risks, blockers) sit above the
reference detail (field-by-field notes, enumerations). If a section can be cut
without losing the conclusion, it belongs lower — or not at all.

## 2. Sound human

- Write like a sharp colleague leaving a note, not a report generator.
- **No throat-clearing:** drop "It is important to note that…", "This section
  will…", "In this analysis we…". Start with the point.
- **No hedging stacks:** not "it seems this might potentially be…" — say what you
  found, and mark a real unknown once, plainly (`Uncertain`, `Not recorded`).
- Active voice, concrete subject. "The proto contract lacks a size field" beats
  "It was observed that a size field may be absent from the contract."

## 3. Concise — no filler

- Every sentence earns its place or gets cut. Prefer a number or a table row over
  a paragraph describing it.
- One fact, one place. State the verdict once; cross-reference it, don't restate
  it in three sections.
- Cut padding: "in order to" → "to", "utilize" → "use", "a number of" → the
  number, "due to the fact that" → "because".
- Don't narrate the document ("Next, we will look at…"). Headings do that.

## 4. No repetition

- Don't echo the frontmatter back as prose — the reader can see `status: Backlog`.
- Don't restate the heading as the first sentence of a section.
- Cross-reference sibling files with wikilinks instead of re-explaining them.

## 5. No no-ops — omit, don't pad

A template lists what to *consider*, not slots that must each emit prose. If a
section has nothing real to say, **omit it** — never ship an empty heading, a
leftover placeholder (`- ...`, `<placeholder>`), or a sentence written only to
fill the slot.

- **Recorded absence is a finding — keep it, one line.** "No Notion links found",
  "No linked tickets", "Requires UI? No" each state a real negative result. One
  line each; don't inflate them into a paragraph or an empty checklist.
- **True N/A → collapse or cut.** A backend ticket's design checklist, an empty
  external-context block, a discrepancy list with nothing in it → "none" on one
  line, or gone.

## 6. Honesty over filler — surface what's unclear

Never write plausible text to cover a gap. If the objective, scope, approach, or
estimate is genuinely unclear, contradictory, or undecided, **say so plainly**
(`Uncertain`, `Not recorded`, or an explicit open question) and stop. A labelled
gap is worth more than fabricated coverage — the reader can act on the first and
is misled by the second.

Where unclear things go: a **dossier** (ticket-research) has a dedicated
`## Open questions` section; a **standard audit card** surfaces them inline — a
**bold** incoherence in the relevant axis, a Notion↔Jira discrepancy, the DoR
*"To be ready it needs: …"* line. No extra heading needed.

## Anti-patterns (cut on sight)

- A TL;DR that summarizes nothing: *"This ticket is a ticket about a feature."*
- Section intros that paraphrase the heading.
- The same risk spelled out in the summary, the axis, and the DoR — say it once
  where it's most load-bearing, reference it elsewhere.
- Adjective/adverb stacking ("very significantly impactful").
- An empty heading, a leftover `- ...` bullet, or a section whose only content is
  the template's `<placeholder>` text.
- A made-up approach or estimate written because the template had a slot — when
  the honest answer is `Uncertain`.

## How the other skills use it

- **jira-ticket-audit** — every card opens with the `> [!tldr]` line (Step 5) and
  follows the voice rules; the four axes stay terse, incoherences in bold.
- **jira-backlog-synthesis** — every synthesis doc opens with its `**TL;DR:**`
  line; the executive summary leads with the verdict sentence.
- **definition-of-ready** — the verdict callout is already a one-liner; keep it
  that way, no preamble.
- **sprint-planning / ticket-triage** — lead with the goal / the one-line triage;
  no warm-up.

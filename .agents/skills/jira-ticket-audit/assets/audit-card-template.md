---
ticket: <KEY>
aliases: ["<KEY>"]
title: "<Issue title>"
type: <issue type>
status: <status>
bucket: <sprint / backlog bucket>
objective_class: <Standard | Big Rock>
owner: <name or "unassigned">
priority: <priority>
domain: <domain or "—">
carryover: <true | false>
size: <XS | S | M | L | XL>
size_factor: <10 | 8 | 6 | 4 | 2>
impact: <9 | 6 | 2 | null>
confidence: <9 | 6 | 2 | null>
score: <n | 0>
scoring_complete: <true | false>
requires_ui: <true | probable | false>
design_linked: <true | false>
design_reuse: <FULL | PARTIAL | NONE | N/A>
code_reuse: <FULL | PARTIAL | NONE>
repos: [<repo>, <repo>]
dor: <ready | almost-ready | not-ready>
jira: https://<site>/browse/<KEY>
tags: [backlog-audit, ticket, <PROJECT>, readiness/<ready|almost-ready|not-ready>]
---

# <KEY> · <Issue title>

**Type:** <issue type> · **Sprint:** <sprint> (note carryover, e.g. "was in 2025-Q3, closed without completing") · **Status:** <status> · **Objective Class:** <Standard/Big Rock> · **Owner:** <name or "unassigned"> · **Priority:** <priority>
**Link:** [<KEY>](https://<site>/browse/<KEY>) · **Reporter:** <name> · **Domain:** <domain> · **Created/Updated:** <date> / <date>
**Related:** <wikilink any ticket referenced, e.g. same theme as [[PM-285-unify-ui-text-fields|PM-285]] (Done); synergy with [[PM-296-backup-in-update-version-dialog|PM-296]]>

---

## Audit summary

| Axis | Verdict | Short note |
|------|---------|------------|
| 1. Goal / scope | OK / Risk / Gap | <one line> |
| 2. UI / Design | OK / Risk / N/A | **<bold any alert, e.g. needs modals; no designs linked>** |
| 3. Size (<size>) | OK / Risk | <is the estimate realistic? what's hiding under it?> |
| 4. Prioritization (Score <n>) | OK / Risk | <does Impact×Confidence×Size hold up?> |

## Project & technical notes

**Project(s):** <repo(s) involved, leader vs. secondary>
**How it'd be done (high level):** <approach in 1–2 sentences, no file-by-file detail>
**Technical notes:** <risks, e.g. data-loss risk; dependencies on other tickets — wikilink them>
**Identification confidence:** <High / Medium / Low> (<why>)

## 1. Goal & scope clarity

<Is the objective clear? Is scope bounded? Are requirements + acceptance criteria
present and sufficient? Is the info in Jira or externalized to Notion? Call out
well-captured risks. Note missing formal AC.>

## 2. UI / Design needs

**Design reuse (code `<ui-repo>`):** <FULL / PARTIAL / NONE> — <what already
exists vs. what's new>.

**Design / Figma:** <Yes/No> — <where you looked across the five places; what
was found. If "No": design fields empty, no design attachments, 0 remote links.>

**Requires UI? <Yes / Probable / No>** — <which screens/modals/states>.

Missing design-asset checklist:

- [ ] <missing mockup / flow / states / copy / Figma link>
- [ ] ...

## 3. Size coherence (T-Shirt Size)

Size **<size>** (factor <n>).

> [!warning] Estimate alert (under/over-estimation risk)
> <why the estimate may be off; what scope is hidden>. Realistic estimate
> **<size>**; review before committing.

<If re-estimating changes the ranking, recompute: Impact × Confidence × new-size
= new Score, and state the delta.>

## 4. Prioritization (Impact / Confidence / Score)

| Variable | Value | Numeric |
|----------|-------|---------|
| Impact (calc) | <High/Med/Low> | <n> |
| Confidence (calc) | <High/Med/Low> | <n> |
| Size factor (<size>) | — | <n> |
| **Score (RICE)** | — | **<n>** |

Model check: <a> × <b> × <c> = **<Score> ✓** (or "incomplete — missing
Impact/Confidence → Score 0").

Assessment: <are Impact and Confidence justified? what would the Score be if
re-estimated? bold any incoherence>.

## Code reuse (`<ui-or-service-repo>`)

**Verdict: <FULL / PARTIAL / NONE> — <one-line summary>.**

**Already exists (reusable):**

- `<path>` — <what it provides>

**New / to build:**

- <what doesn't exist yet>

**Suggested approach:** <reuse X; design only the new sub-part Y>.

## Definition of Ready (DoR)

> **Single source of truth — don't duplicate the block here.** Paste the DoR block
> from `definition-of-ready/assets/dor-block-template.md` and fill it in: the
> verdict **as a callout** (`> [!success]` 🟢 / `> [!warning]` 🟡 / `> [!danger]` 🔴),
> the seven-point checklist (✅ / 🔎 deduced / ⚠️ / ❌ / N/A), the *Deductions to
> verify* lines (whenever a row is 🔎), and the closing *"To be ready it needs: …"*.
> Keep `dor:` in the frontmatter in sync with the verdict. The rubric and the block
> live in the `definition-of-ready` skill; edit them there so this template never
> drifts.

---
name: definition-of-ready
description: >-
  Decide whether a backlog ticket is ready to start and, when it is not, name
  exactly what it is missing. Defines the shared Definition of Ready (DoR) rubric
  used across the Jira backlog workflow: one verdict (Ready to start / Almost
  ready / Not ready), a fixed seven-point readiness checklist, and a reason
  taxonomy (missing definitions or acceptance criteria, missing UI/design, not
  extrapolable from existing code, missing context, not well scoped / it's an
  épic, incomplete scoring, unrealistic estimate). Trigger whenever someone asks
  whether a ticket is "ready" or "ready to start", mentions "definition of ready"
  or "DoR", asks "what's missing before we plan this", whether an item can enter a
  sprint, or wants a readiness verdict on backlog items. Used by jira-ticket-audit
  (the DoR block that ends every card), jira-backlog-synthesis (the readiness plan
  grouped by verdict), and sprint-planning (the gate before committing work).
  Judgment only — it never writes to Jira.
---

# Definition of Ready (DoR)

A single, shared rubric for the one question every backlog ticket must answer
before it is planned: **is it ready to start, and if not, what is missing?**

Without a shared definition, "readiness" drifts into a vague Low/Medium/High that
isn't comparable across tickets or reviewers. This skill fixes the verdicts, the
checklist, and the vocabulary for *what's missing* so every ticket is judged the
same way — and so the gaps map directly to an action.

It is the **cross-cutting** piece of the backlog workflow. The three-part chain
(`jira-backlog-scoping` → `jira-ticket-audit` → `jira-backlog-synthesis`) and
`sprint-planning` all consume this rubric; see **How the other skills use it**.

## The verdict (pick exactly one)

| Verdict | Meaning | Can it enter a sprint? |
|---|---|---|
| 🟢 **READY TO START** | Objective and scope clear, acceptance criteria defined (or only minor formalization left), realistically sized, scoring complete, design available if needed, extrapolable from existing code/contract. | Yes, now. |
| 🟡 **ALMOST READY** | Fundamentally sound but blocked by **one** clearly named thing to resolve first (a pending ADR, a design, a contract change, a split, a confirmation). | After that one blocker. |
| 🔴 **NOT READY** | Missing a lot, or blocked on something structural. Always pair it with one or more reasons from the taxonomy below. | No. |

Keep the verdict honest: if a "ready" ticket still needs acceptance criteria
written, it is at best 🟡. The point of the rubric is to make the gap visible, not
to wave tickets through.

## The readiness checklist (every ticket)

Score each criterion **✅ met / 🔎 deduced (to verify) / ⚠️ partial / ❌ missing /
N/A**. Use **🔎** when the criterion isn't satisfied explicitly in the ticket but
you filled it by extrapolation from what already exists — a near-identical design,
analogous code, or a derivable requirement (see *Deduction* below). The seven
criteria are grounded in the engineering skills they each map to:

1. **Objective / description clear** — there's a real description, not a one-liner
   or placeholder. *(writing-style, engineering:documentation)*
2. **Acceptance criteria defined** — you can tell when it's done and how it's
   verified. AC are often **externalized to a Notion doc**: that counts as ✅ only
   if the doc was **opened and read** (see the `jira-notion-context` skill) and
   actually contains AC — note it as *"externalized in Notion — read"*. A Notion
   link that couldn't be read is **⚠️ externalized, unverified** (not ❌ — the doc
   exists; not ✅ — you couldn't verify it). *(engineering:testing-strategy)*
3. **Well scoped** — it's a single story with a realistic size, not an épic that
   needs splitting. *(engineering:system-design)*
4. **Scoring complete** — Impact, Confidence and Size are all set so the Score is
   non-zero and trustworthy. *(see jira-backlog-scoping for the formula)*
5. **Design / UI available** — if it touches UI, the design exists; **or it can be
   extrapolated from a very similar existing design/pattern** (then mark it 🔎, not
   ✅, and log the deduction); `N/A` for backend-only work. *(see jira-ticket-audit
   Step 3)*
6. **Extrapolable from existing code/contract** — it can be built by
   extending/exposing what already exists. If the missing piece (a field, a flow,
   even a requirement) **can be deduced from analogous code, a near-identical
   contract, or an established pattern**, mark it 🔎 deduced (to verify) and log it
   — not ✅. A genuinely new contract or an undecided architecture (ADR owed) stays
   ⚠️/❌. *(engineering:architecture, engineering:system-design)*
7. **Context sufficient** — origin/requests, dependencies and constraints are
   captured, not assumed.

## Reason taxonomy (why it's not ready)

When the verdict is 🟡 or 🔴, name the gap using these standard reasons. They make
"not ready" actionable and let the synthesis group tickets by failure mode:

- **Missing definitions / AC** — no acceptance criteria or requirements.
- **Missing UI / design** — needs a UI and no design (or pattern) exists.
- **Not extrapolable from existing code** — needs a new API contract, a new
  concept, or an undecided architecture (an ADR is owed).
- **Missing context** — empty/placeholder description, unclear origin or
  dependencies.
- **Not well scoped (épic / split)** — too big or bundles several stories; must be
  broken down.
- **Incomplete scoring** — Impact / Confidence / Size missing → Score 0; the
  ticket is invisible in the ranking until fixed.
- **Unrealistic estimate** — the size doesn't match the real scope (often a small
  size hiding API + UI + billing + migration). Inflates or deflates the Score.

Close every non-green verdict with a one-line **"To be ready it needs: …"** drawn
from these reasons. That line is the hand-off to refinement.

## Deduction: filling gaps by extrapolation

A gap that isn't written in the ticket may still be **deducible** from what already
exists — and doing that deduction is a real refinement step, not a shortcut. It's
*one step further than the ticket got*. Look for:

- **A very similar existing design** — a screen, modal, or pattern almost identical
  to what's asked (e.g. the same control already shipped for a sibling feature).
- **Analogous code / a near-identical contract** — a field, endpoint, or flow that
  already exists for a comparable feature and can be copied or extended.
- **A derivable requirement or decision** — acceptance criteria or behavior you can
  infer from the description plus how the system already works.

When you fill a criterion this way, readiness moves forward — a 🔴 can become a 🟡 —
**but only provisionally**, because it's *your inference*, not the ticket's word.
So three rules, always:

1. **Mark the criterion 🔎 deduced (to verify), never ✅.** ✅ is reserved for what
   the ticket states explicitly or for what has already been confirmed.
2. **Log it under "Deductions to verify"** with its basis, confidence, and how to
   confirm — so the deduction is visible and a human can check it. The whole point
   is to surface the extra step you took *so it can be verified*, not hide it.
3. **Make the verdict conditional.** A verdict propped up by deductions reads
   *"🟡 Almost ready — pending confirmation of N deductions"*. It only reaches 🟢
   once those deductions are confirmed; then they turn into ✅.

A wrong deduction dressed as a ✅ is worse than an honest ❌ — it sends the ticket
into a sprint on a false premise. Keep deductions labelled until confirmed.

**"Deductions to verify" sub-block** (add it whenever any criterion is 🔎):

```markdown
**Deductions to verify:**
- <what was deduced> — basis: <similar design / analogous code / precedent ticket>; confidence: <High/Med/Low>; confirm by: <who/what checks it>
```

## The DoR block (paste into each ticket)

End every audit card / refined ticket with this block. Fill the table, then the
one-liner. Render the verdict as an Obsidian **callout** — 🟢 → `[!success]`,
🟡 → `[!warning]`, 🔴 → `[!danger]` — and keep the card's frontmatter `dor:`
(`ready` / `almost-ready` / `not-ready`) in sync. See
`assets/dor-block-template.md` for the copy-paste skeleton.

```markdown
## Definition of Ready (DoR)

> [!success] Verdict: 🟢 READY TO START — <one line>
<!-- callout type by verdict: 🟢 [!success] · 🟡 [!warning] · 🔴 [!danger] -->

| DoR criterion | Status |
|---|---|
| Objective / description clear | ✅/🔎/⚠️/❌ |
| Acceptance criteria defined | ✅/🔎/⚠️/❌ |
| Well scoped (realistic size, not an épic) | ✅/🔎/⚠️/❌ |
| Scoring complete (Impact·Confidence·Size) | ✅/🔎/⚠️/❌ |
| Design / UI available | ✅/🔎/⚠️/❌/N/A |
| Extrapolable from existing code/contract | ✅/🔎/⚠️/❌ |
| Context sufficient | ✅/🔎/⚠️/❌ |

**Deductions to verify:** <only if any row is 🔎 — what was deduced · basis · confidence · how to confirm; otherwise "none">

**To be ready it needs:** <reasons from the taxonomy + the concrete next step>
```

## How the other skills use it

- **jira-ticket-audit** — every audit card **must end with the DoR block** above
  instead of a loose readiness line. The four audit axes feed the checklist:
  goal/scope → criteria 1–3 & 7; UI/design → criterion 5; size coherence →
  criteria 3–4 & "unrealistic estimate"; prioritization → criterion 4. Its Step-4
  design classification maps straight onto the 🔎 status: **Extrapolable** → 🔎
  deduced (a missing Figma isn't a blocker, it's a deduction to verify),
  **Partial** → 🔎/⚠️, **New design** → ❌.
- **jira-backlog-synthesis** — the quarter/sprint **readiness plan groups tickets
  by DoR verdict** (🟢 / 🟡 / 🔴) and, within 🔴, by reason; the biggest lever is
  usually "incomplete scoring" and "missing context/placeholder".
- **sprint-planning** — treat DoR as a **gate**: only commit 🟢 items; pull 🟡 in
  only if the single blocker is resolved during planning; never commit 🔴.

## Ground rules

- **Judgment only — never write to Jira.** The DoR is recorded in the markdown
  card, not in the ticket (the wider workflow is read-only on Jira).
- **One verdict, no hedging.** "Almost ready" must name its single blocker;
  "not ready" must name its reasons.
- **Don't invent readiness.** A missing field is a gap, not a guess — mark it ❌
  and say so.

## Reference files

- `assets/dor-block-template.md` — the copy-paste DoR block.

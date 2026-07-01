---
ticket: PM-284
aliases: ["PM-284"]
title: "Unify UI modal dialogs"
type: Objective
status: UI/UX Design
bucket: 2026-Q3
objective_class: Standard
owner: Amogha Sathyanarayana
priority: Medium
domain: Platform
carryover: false
size: XS
size_factor: 10
impact: 2
confidence: 9
score: 180
scoring_complete: true
requires_ui: true
design_linked: false
design_source: none
design_reuse: PARTIAL
code_reuse: PARTIAL
repos: [qdrant-cloud-ui]
notion: none
slack_context: none
github_context: none
subtasks: []
linked_issues: []
child_context: none
dor: not-ready
jira: https://qdrant.atlassian.net/browse/PM-284
tags: [backlog-audit, ticket, PM, readiness/not-ready]
---

# PM-284 · Unify UI modal dialogs

> [!tldr] 🔴 NOT READY · Score 180 (XS) · one-liner description, no defined "unified" target, and status/comment ("Already completed!") directly **contradicts** the open review comment asking whether scope is even understood

**Type:** Objective · **Sprint:** 2026-Q3 (not carryover) · **Status:** UI/UX Design · **Objective Class:** Standard · **Owner:** Amogha Sathyanarayana · **Priority:** Medium
**Link:** [PM-284](https://qdrant.atlassian.net/browse/PM-284) · **Reporter:** Bastian Hofmann · **Domain:** Platform · **Created/Updated:** 2026-01-20 / 2026-06-25
**Subtasks:** none
**Linked issues:** none
**Related:** none found in this batch

---

## Audit summary

| Axis | Verdict | Short note |
|------|---------|------------|
| 1. Goal / scope | Gap | One-sentence description; no list of which modals, no TO-BE spec |
| 2. UI / Design | Risk | **No Figma anywhere; design reuse deduced from existing `BaseDialog`/`ModalDialog` primitives** |
| 3. Size (XS) | Risk | **"Already completed!" comment conflicts with status still being UI/UX Design and an open scoping-review comment** |
| 4. Prioritization (Score 180) | OK | Impact=Minimal is defensible (internal maintenance work); arithmetic checks out |

## Project & technical notes

**Project(s):** `qdrant-cloud-ui` (leader; sole repo — pure frontend consistency work, no backend/API involved).
**How it'd be done (high level):** Audit all existing dialog/modal components, converge them onto the repo's existing `BaseDialog`/`ModalDialog` primitives (or a small extension of them), and migrate call sites off ad-hoc MUI `Dialog` usage.
**Technical notes:** No data-loss or backend risk — purely a frontend refactor/consistency pass. Main risk is scope creep: "unify" could mean anything from "converge visual styling" to "migrate every call site to one component API".
**Identification confidence:** High (single repo, clearly a UI-only ticket; code search confirms both the target primitive and the fragmentation it addresses).

## 1. Goal & scope clarity

The description is a single sentence: *"Our UI modals use different implementations. To ease maintenance and increase consistency, we should unify them."* There is no list of which modals are in scope, no definition of what "unified" looks like (one component API? one visual style? one state-management pattern?), and no acceptance criteria field populated.

A comment on the ticket says **"Already completed!"** (Amogha Sathyanarayana, 2026-06-09) — but the ticket's status is still **UI/UX Design**, and a separate, more recent "Objective review" comment (same reporter's team, undated author metadata but structurally a refinement checklist) explicitly raises unresolved questions: *"What is our confidence based on?"*, *"List of UI modals is known (?)"*, *"TO-BE implementation is clear (?)"*, *"Minimal design(s) is required at most (?)"*, and *"What things are important to clarify so that the work can start?"*. **These two comments are incoherent with each other** — one claims completion, the other treats the ticket as unscoped. This is not resolved anywhere in the ticket.

No externalized AC (Notion or otherwise) — `customfield_10087` (Acceptance Criteria) is empty.

## 2. UI / Design needs

**Design reuse (code `qdrant-cloud-ui`):** PARTIAL — `src/components/Dialog/BaseDialog.tsx` and `src/components/Dialog/ModalDialog.tsx` already exist as the intended shared primitive (`ModalDialog` is documented in-code as "a convenience wrapper around BaseDialog... ideal for critical dialogs"). But adoption is partial: only 10 files import `BaseDialog` and 14 import `ModalDialog`, while the repo has 41 distinct `*Dialog.tsx` component files and 112 files touching a `Dialog` symbol at all — most likely importing MUI's `Dialog` directly rather than the shared wrapper. This confirms the ticket's own premise ("different implementations") and shows the unification target already exists in code — **deduced from `BaseDialog`/`ModalDialog`, no Figma found**; flagged as a Deduction to verify below.

**Design / Figma:** No — checked all five places: design fields (`Concept Design`, `UX Designs`, `Technical Documentation` all null), attachments (none), description/AC (no `figma.com`/`notion.so` URL), issue links (none), remote links (0 via `getJiraIssueRemoteIssueLinks`).

**Requires UI? Yes** — this is a pure frontend consistency ticket by definition.

Missing design-asset checklist:

- [ ] List of in-scope modals/dialogs (the review comment itself asks for this)
- [ ] TO-BE target: which component API/pattern all dialogs converge to
- [ ] Confirmation of "minimal design" scope claim, or a light Figma if visual changes are involved

## 3. Size coherence (T-Shirt Size)

Size **XS** (factor 10).

> [!warning] Estimate alert (under/over-estimation risk)
> XS assumes a small, mechanical refactor. But "unify UI modal dialogs" with 41 distinct dialog components and no defined TO-BE state could range from a trivial style pass (genuinely XS) to a repo-wide migration of ~30 call sites off direct MUI usage onto the shared primitive (more realistically S–M). The ticket's own open-questions comment flags this exact risk ("List of UI modals is known (?)", "TO-BE implementation is clear (?)"). Realistic estimate **S**, pending scope confirmation; review before committing.

If S (factor 8) is used instead of XS (10): Impact(2) × Confidence(9) × 8 = **144** vs. current 180 — an 20% drop, not rank-changing on its own, but the real issue is the ticket isn't scoped enough to trust either number.

## 4. Prioritization (Impact / Confidence / Score)

| Variable | Value | Numeric |
|----------|-------|---------|
| Impact (calc) | Minimal | 2 |
| Confidence (calc) | High | 9 |
| Size factor (XS) | — | 10 |
| **Score (RICE)** | — | **180** |

Model check: 2 × 9 × 10 = **180 ✓**.

Assessment: Impact=Minimal is reasonable for an internal maintenance/tech-debt item (labeled `Tech Category: Tech Debt`), not customer-facing value. **Confidence=High is the incoherent factor**: the ticket's own review comment explicitly questions "What is our confidence based on?" while scope, modal inventory, and TO-BE state are all still open — High confidence is not supported by the ticket's current content. If Confidence were Medium (6) instead: 2 × 6 × 10 = **120**, a meaningful drop that would move this well down the Q3 ranking.

## Code reuse (`qdrant-cloud-ui`)

**Verdict: PARTIAL — the unification target already exists; the work is migration, not creation.**

**Already exists (reusable):**

- `src/components/Dialog/BaseDialog.tsx` — the base dialog primitive.
- `src/components/Dialog/ModalDialog.tsx` — thin wrapper disabling ESC-dismiss, documented as the pattern for "critical dialogs".

**New / to build:**

- An audit of the ~41 `*Dialog.tsx` files (and other inline `@mui/material` `Dialog` usages) to classify which should migrate to `BaseDialog`/`ModalDialog`.
- The actual migration of call sites currently bypassing the shared primitive.
- A definition of what "unified" means for styling/behavior beyond just component reuse (e.g. `Common/Dialog/DialogTitleWithIcon.tsx`, `DialogTitleWithBadge.tsx`, `DialogTitleBase.tsx` suggest some convergence already happened at the title level too).

**Suggested approach:** Treat `BaseDialog`/`ModalDialog` as the target API; scope the ticket to a concrete list of dialogs to migrate rather than "all of them," and confirm whether any visual/UX change (vs. pure code consolidation) is in scope — that determines whether a designer needs to be involved at all.

## Linked-ticket context

No linked tickets — child_context: none. `subtasks: []`, `linked_issues: []`, 0 remote links.

## Notion context

No Notion links found — notion: none.

## Definition of Ready (DoR)

> [!danger] Verdict: 🔴 NOT READY — scope undefined (which modals, TO-BE target) and the ticket's own comments contradict each other on whether it's even understood, let alone complete

| DoR criterion | Status |
|---|---|
| Objective / description clear | ⚠️ |
| Acceptance criteria defined | ❌ |
| Well scoped (realistic size, not an épic) | ⚠️ |
| Scoring complete (Impact·Confidence·Size) | ✅ |
| Design / UI available | 🔎 |
| Extrapolable from existing code/contract | 🔎 |
| Context sufficient | ❌ |

**Deductions to verify:**
- Unification target = `BaseDialog`/`ModalDialog` — basis: these primitives already exist and are already used by ~24 dialogs, matching the ticket's stated goal; confidence: Medium (could also mean a broader/different consolidation); confirm by: PM or eng lead naming the target component explicitly and the list of dialogs in scope.

**To be ready it needs:** Missing definitions / AC — the ticket needs a concrete list of in-scope dialogs and a stated TO-BE target (confirm it's `BaseDialog`/`ModalDialog` migration) before size and confidence can be trusted. The "Already completed!" comment should also be resolved — either the ticket is done and should be closed, or the comment is wrong and should be removed to stop misleading readers.

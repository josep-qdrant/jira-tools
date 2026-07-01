---
ticket: PM-187
aliases: ["PM-187"]
title: "Multi-channel alert notifications"
type: Objective
status: Idea Intake
bucket: 2026-Q3
objective_class: Standard
owner: unassigned
priority: Medium
domain: "—"
carryover: false
size: S
size_factor: 8
impact: 6
confidence: 9
score: 432
scoring_complete: true
requires_ui: true
design_linked: false
design_source: none
design_reuse: PARTIAL
code_reuse: PARTIAL
repos: [qdrant-cloud-cluster-api, qdrant-cloud-ui]
notion: none
slack_context: none
github_context: none
subtasks: []
linked_issues: [PM-403, PM-305, CRC-2031, PM-500, PM-517, PM-527]
child_context: full
dor: not-ready
jira: https://qdrant.atlassian.net/browse/PM-187
tags: [backlog-audit, ticket, PM, readiness/not-ready]
---

# PM-187 · Multi-channel alert notifications

> [!tldr] 🔴 NOT READY · Score 432 (S) · Reviewers already flagged "S" as wrong — email config is a small extension, but the webhook half is genuinely undefined new scope and still Idea Intake

**Type:** Objective · **Sprint:** 2026-Q3 · **Status:** Idea Intake · **Objective Class:** Standard · **Owner:** unassigned · **Priority:** Medium
**Link:** [PM-187](https://qdrant.atlassian.net/browse/PM-187) · **Reporter:** Bastian Hofmann · **Domain:** — · **Created/Updated:** 2025-06-26 / 2026-06-25
**Subtasks:** none
**Linked issues:** [[PM-403-customizable-alerting-capabilities|PM-403]] (is a request from — Accepted), [[PM-305-alert-notifications-configurable|PM-305]] (merged from — Backlog), [[CRC-2031-resolve-alerts-proactively|CRC-2031]] (relates to — Backlog), [[PM-500-cost-governance-roche|PM-500]] (is a request from — Accepted), [[PM-517-cost-governance-roche-alerts|PM-517]] (is a request from — In Review), [[PM-527-alerts-to-slack|PM-527]] (is a request from — Accepted)
**Related:** synergy with [[PM-165-improve-backup-ux|PM-165]]-style channel/region selector patterns (not directly linked, same UI family).

---

## Audit summary

| Axis | Verdict | Short note |
|------|---------|------------|
| 1. Goal / scope | Risk | **Two internal PM reviews explicitly disagree with the ticket's own size and scope; open questions (customer request? account vs. cluster level? who configures?) are unresolved after two review passes** |
| 2. UI / Design | Risk | No design field, no Figma anywhere in 5 places or across 6 linked tickets; requires new settings UI for channel config |
| 3. Size (S) | Risk | **A PM reviewer already called out that "webhook is completely new" scope under a single S — email-recipient config alone might be S, but webhook delivery is undefined and unscoped** |
| 4. Prioritization (Score 432) | Risk | Impact/Confidence disagree between the two review comments (Confidence High vs. Medium, same Impact) — the stored 6×9×8 reflects the *first*, more optimistic review, not the later, more cautious one |

## Project & technical notes

**Project(s):** `qdrant-cloud-cluster-api` (leader — owns `AlertHandler`/`Notification` delivery, the `RecipientType` model, and the alert-resolution cronjob referenced in CRC-2031); `qdrant-cloud-ui` (secondary — new settings screen for channel configuration).
**How it'd be done (high level):** extend `RecipientType` (currently `account`/`email`/`admin`/`user`) with a genuinely new `webhook` variant and delivery path, add a channel-configuration UI, and decide whether channels live at account or cluster level (open question, unresolved).
**Technical notes:** CRC-2031 (linked, Backlog) shows the alert-resolution cronjob only runs daily and doesn't push real-time "resolved" events — a webhook consumer would see stale state without that being fixed first; worth flagging as a dependency risk, not yet linked formally. No customer-request evidence found in Jira — an open question in the ticket's own review comments ("Do we have a specific customer request behind it?") is still unanswered; PM-527 (linked) shows a customer *did* ask for Slack-specific delivery, but that's a further scope question (webhook vs. native Slack integration), not a resolution of the open question.
**Identification confidence:** High for `qdrant-cloud-cluster-api` (verified via codegraph: `AlertHandler`, `RecipientType`, `Notification` all exist and are email-only today); Medium for the UI repo (no existing settings-page pattern found to point to specifically).

## 1. Goal & scope clarity

The description is a one-liner: configurable email + webhook channels per account. Two internal "Objective review" comments (2026-06-05 and 2026-06-09) show the PM team scoring this live and **disagreeing with each other**: the first sets Confidence=High citing "many customers complaining," the second walks it back to Confidence=Medium ("less confidence... only because of this") — the stored Score (Confidence=9/High) reflects the *first*, not the *second and more recent*, assessment. Both reviews raise the same unresolved open questions: is there a specific customer request behind this, do channels live at account or cluster level, who can configure them, is it paid-only. A third comment (2026-06-22) asks someone to research whether Alertmanager is already used and how configurable it is — meaning **the technical feasibility research hasn't even started**. Six linked tickets (customer/internal requests spanning 2025–2026) confirm real, recurring demand, but none resolve the open questions above.

## 2. UI / Design needs

**Design reuse (code `qdrant-cloud-ui`):** PARTIAL — 🔎 deduced. No dedicated notification-channel settings screen exists in the codebase (confirmed via codegraph query — only `ClusterAlertsCard`/`ClusterAlertRow`, which *display* alerts, not configure delivery channels). The email-recipient-list part of this ticket is a small, standard settings-form pattern (analogous to other account-settings forms in the repo) and is Extrapolable; the webhook-configuration UI (URL input, format selection, test/verify action) has no analogous pattern in this codebase and would need real design.

**Design / Figma:** No — hunted all five places: Concept Design, UX Designs, Technical Documentation fields all null; no attachments; no `figma.com`/`notion.so` in description or the 3 comments; 0 remote links; none of the 6 linked tickets (PM-403, PM-305, CRC-2031, PM-500, PM-517, PM-527) carry a design field, attachment, or Figma/Notion link either.

**Requires UI? Yes** — an account (or cluster) settings screen to add/edit/remove email addresses and webhook endpoints, and to map alert types to channels (per the second review comment: "per enabled alert and cluster, you choose what channel they go to").

Missing design-asset checklist:

- [ ] Decision: channels configured at account or cluster level (blocks any layout decision)
- [ ] Webhook-endpoint configuration UI (URL, payload format, verification) — no analogous pattern found
- [ ] Per-alert-type × per-channel routing UI (matrix or toggle-list design)

## 3. Size coherence (T-Shirt Size)

Size **S** (factor 8).

> [!warning] Estimate alert (under/over-estimation risk)
> The ticket's own review comments flag this directly: "Webhook is completely new... Need more details to narrow the scope" — yet the size stayed S through both reviews. Email-channel configuration alone (extending an existing recipient list with free-form addresses) is plausibly S; adding a **new delivery mechanism** (webhook: payload contract, retry/failure handling, per-channel routing, a settings UI, and confirming whether it's an internal-standards effort or a customer-driven spec) is easily **M or L** on its own. Realistic estimate is **M**, and only after the webhook scope question is resolved — review before committing.

Re-estimating M (factor 6) instead of S (factor 8) at the current 6×9 Impact×Confidence: 6 × 9 × 6 = 324 (vs. stored 432) — an 108-point drop, moving it below PM-230 (324, tied) and several other S/M tickets in this batch. Using the second review's more cautious Confidence=Medium (6) instead: 6 × 6 × 6 = 216, a bigger drop still.

## 4. Prioritization (Impact / Confidence / Score)

| Variable | Value | Numeric |
|----------|-------|---------|
| Impact (calc) | Measurable | 6 |
| Confidence (calc) | High | 9 |
| Size factor (S) | — | 8 |
| **Score (RICE)** | — | **432** |

Model check: 6 × 9 × 8 = **432 ✓** (arithmetic reconciles against the stored field).

Assessment: **the stored Confidence=High (9) reflects the earlier, more optimistic review comment; a later review comment on the same ticket explicitly walks Confidence back to Medium, and the field was never updated** — the Score is stale relative to the ticket's own documented history. Combined with the unresolved "is webhook in scope" question, this Score is not safe to rank against tickets whose Impact/Confidence/Size are uncontested.

## Code reuse (`qdrant-cloud-cluster-api`, `qdrant-cloud-ui`)

**Verdict: PARTIAL — email delivery and recipient modeling exist; webhook delivery is entirely new.**

**Already exists (reusable):**

- `cluster_api/notification/clients/base.py` (`EmailRequest`) and `cluster_api/notification/schemas/recipient.py` (`RecipientType`, `AccountsRecipient`, `UsersRecipient`, `ExternalUserRecipient`, `AdminsRecipient`) — a working, typed recipient/delivery model for email today.
- `cluster_api/alert/services/alert_notification_handlers.py` (`AlertHandler` and its per-alert-type subclasses) — the per-alert-type dispatch point where a new channel would plug in.
- `qdrant-cloud-ui`: `ClusterAlertsCard`/`ClusterAlertRow` — existing alert display, though not configuration.

**New / to build:**

- A `webhook` `RecipientType` variant and its delivery client (`RecipientType` currently has no non-email external-delivery concept at all — verified, no `webhook` string anywhere in the notification module).
- Payload contract for webhook delivery (JSON schema, retry/failure semantics) — explicitly called "internal idea," not yet a confirmed external contract.
- Full settings UI for channel management (no existing screen).
- CRC-2031's stale-resolution cronjob (daily) may need to become event-driven for a webhook consumer to see timely "resolved" states — a dependency risk, not yet scoped into this ticket.

**Suggested approach:** split into (a) email-recipient configurability — Extrapolable, ship first; (b) webhook delivery — treat as a new, separately-scoped contract requiring an ADR on payload format and delivery guarantees before estimating.

## Linked-ticket context

| Key | Relationship | Title | Figma | Notion | Slack | GitHub | Notes |
|-----|-------------|-------|-------|--------|-------|--------|-------|
| [[PM-403-customizable-alerting-capabilities|PM-403]] | is a request from | "Customizable alerting capabilities" | None | None | None | None | Accepted Product Request; empty description — no additional spec |
| [[PM-305-alert-notifications-configurable|PM-305]] | merged from | "Make alert notifications individually configurable for customers" | None | None | None | None | Per-cluster opt-out request; describes account/cluster-level ambiguity but doesn't resolve it |
| [[CRC-2031-resolve-alerts-proactively|CRC-2031]] | relates to | "Resolve alerts proactively in cluster-api" | None | None | None | GitHub blob links (source refs, not PR/issue) — confirm `cluster_api/alert/db/repositories.py` cronjob location | Backlog; identifies a real dependency risk (daily resolution cronjob vs. real-time webhook consumers) not reflected in PM-187's scope |
| [[PM-500-cost-governance-roche|PM-500]] | is a request from | "Cost governance for large shared deployments…" | None | None | None | None | Accepted; alerting is one of three needs bundled in a much larger Roche cost-governance ask — no new design/spec for PM-187 itself |
| [[PM-517-cost-governance-roche-alerts|PM-517]] | is a request from | "Cost governance for Roche: usage and budget alerts" | None | None | None | None | In Review; clone of PM-500's alerts need — confirms customer demand, no new spec |
| [[PM-527-alerts-to-slack|PM-527]] | is a request from | "Integration of customer alerts to customer slack channel" | None | None | None | None | Accepted; customer wants Slack specifically — suggests "webhook" scope may really mean "Slack integration," a further open question for this ticket |

## Notion context

No Notion links found — notion: none.

## Definition of Ready (DoR)

> [!danger] Verdict: 🔴 NOT READY — webhook scope is undefined and the ticket's own reviewers disagree on Confidence/Size

| DoR criterion | Status |
|---|---|
| Objective / description clear | ⚠️ one-line description states the goal but not account/cluster level, ownership, or webhook consumer format |
| Acceptance criteria defined | ❌ AC field empty; no Notion link; only informal review comments |
| Well scoped (realistic size, not an épic) | ❌ bundles a small email-config extension with an undefined new webhook delivery mechanism |
| Scoring complete (Impact·Confidence·Size) | ⚠️ populated, but stale — later review comment contradicts the stored Confidence value |
| Design / UI available | ❌ no Figma; no settings-page pattern found for channel configuration |
| Extrapolable from existing code/contract | 🔎 deduced for email-recipient config only; ❌ for webhook (no analogous contract in `cluster_api/notification/`) |
| Context sufficient | ⚠️ six linked tickets confirm demand, but open questions (customer request? account/cluster level? paid-only?) remain unanswered after two review passes |

**Deductions to verify:**
- Email-recipient configuration is Extrapolable from the existing `RecipientType`/`ExternalUserRecipient` model and settings-form patterns elsewhere in `qdrant-cloud-ui` — basis: analogous typed recipient model already in production for other recipient kinds; confidence: Medium (no specific settings-page component cited, only the underlying data model); confirm by: engineering pass identifying the actual settings-form component to extend.

**To be ready it needs:** Not well scoped (épic / split) — split email-channel config (near-ready) from webhook delivery (needs an ADR on payload/delivery contract and a decision on whether it's customer-driven or an internal standard). Missing context — resolve the open questions from both review comments (customer request? account vs. cluster level? paid-only?) before re-scoring.

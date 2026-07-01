# Model policy

Single source of truth for **which model runs which task** in this repo. Rule:
the cheapest model that does the job well — never default everything to Opus.

## Tiers

| Tier | Model (id) | Use for | Never for |
|------|-----------|---------|-----------|
| **Retrieval** | `haiku` (`claude-haiku-4-5`) | Mechanical I/O + extraction: fetch Jira ADF/fields, follow remote links, read Notion/Slack/GitHub/Figma, dump raw context verbatim. No judgment. | Scoring, readiness verdicts, scope calls. |
| **Reasoning** (default) | `sonnet` (`claude-sonnet-4-6`) | The workhorse: scoping/JQL, the four-axis audit, recompute Score, DoR verdict, code association, synthesis docs. ~95% of the reasoning. | Pure retrieval (waste — use Haiku). |
| **Escalation** | `opus` (`claude-opus-4-8`) | Only the hard call: ambiguous scope, contested Score arithmetic, epic-in-disguise decomposition, high-stakes final synthesis. **Conditional, not the default.** | Routine extraction or rubric application. |

## Escalation triggers (Sonnet → Opus)

Escalate a **single question** to Opus only when the Sonnet pass self-flags one of:

- Confidence = **low** on the readiness / Score verdict.
- Score arithmetic **contested** — the recomputed Score diverges materially and
  the cause is judgment, not a missing factor (a missing factor is just
  "scoring incomplete", no Opus needed).
- Ticket looks like an **epic in disguise** and the decomposition is non-obvious.
- **Scope boundary contested** (Scope phase only, `jira-backlog-scoper`) — two
  readings of "what defines the backlog" give materially different key lists
  and the args + site data don't resolve it. Routine under-specification (no
  team/board given) is NOT this — that's just an assumption, documented, no
  escalation.

Escalation is **per-question, per-ticket** — not "run the whole thing on Opus".
If nothing is flagged, Opus never runs.

## Per-workflow assignment

| Workflow | Phase | Model |
|---|---|---|
| `ticket-research` | Gather (`jira-context-gatherer`) | `haiku` |
| `ticket-research` | Analyze (`jira-ticket-auditor`) | `sonnet` |
| `ticket-research` | Escalate (conditional) | `opus` |
| `backlog-audit` | Scope (`jira-backlog-scoper`) | `sonnet` |
| `backlog-audit` | Scope escalate (conditional) | `opus` |
| `backlog-audit` | Gather (`jira-context-gatherer`, per batch) | `haiku` |
| `backlog-audit` | Analyze (`jira-ticket-auditor`, per batch) | `sonnet` |
| `backlog-audit` | Audit escalate (conditional) | `opus` |
| `backlog-audit` | Synthesize | `sonnet` |

## Keeping it in sync

An agent's frontmatter `model:` is its **standalone default**; a workflow
**overrides per phase** via the `model` option on each `agent()` call. The
agent defaults and this table must agree:

- `jira-backlog-scoper` → `sonnet` (Opus only on a flagged-ambiguous scope)
- `jira-context-gatherer` → `haiku` (always — it has no judgment to escalate)
- `jira-ticket-auditor` → `sonnet` (was Opus; Opus is now escalation-only)
- `jira-backlog-synthesizer` → `sonnet`

When run **standalone** (not via a workflow), an agent stays on its frontmatter
model and cannot self-escalate — it flags a contested call explicitly so a human
can re-run that one question on Opus.

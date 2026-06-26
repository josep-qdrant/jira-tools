# Ticket research (deep dive on specific tickets)

> Part of the [jira-tools workflow guide](../../WORKFLOW.md). For a whole backlog, use [backlog-audit](./backlog-audit.md) instead.

A deep, read-only dive on **a few specific tickets** — not a whole backlog. Writes one research dossier per key.

**When to use it:** someone asks "what's the full story on PM-207 and PM-210?" It's cheaper and deeper than running the backlog-audit pipeline on a 1-ticket scope — there's no scoper/synthesizer overhead, and each ticket gets two extra research sections (Open questions + Recommendation) the audit cards don't have.

---

## Model-tiered, per ticket

Each key flows through three stages independently (see [model policy](../MODEL_POLICY.md)):

| Stage | Model | Does |
|---|---|---|
| **Gather** | Haiku | Fetches Jira fields, remote links, one-hop linked tickets, and every Notion/Slack/GitHub/Figma URL into a raw context dump. No judgment. |
| **Analyze** | Sonnet | Reads the dump, writes the dossier: four-axis audit, design hunt, code association, DoR + Open questions + Recommendation. |
| **Escalate** | Opus | Only if Sonnet flagged a genuinely contested call. Resolves that one question in place. |

---

## Run it

> [!info] Read-only and non-interactive
> Like backlog-audit, it can't pause to ask — pass the tickets in `args`.

```
Run the ticket-research workflow with args:
{
  "keys": ["PM-207", "PM-210"],
  "outputFolder": "research-PM-2026-Q3",
  "reposRoot": "/absolute/path/to/repos",   // optional — code association
  "escalate": true                          // optional — Opus escalation, default on
}
```

| arg | required | meaning |
|---|---|---|
| `keys` | **yes** | The tickets to research. `key: "PM-207"` (singular) also works for one. |
| `outputFolder` | **yes** | Where dossiers are written. Missing → aborts before touching Jira. |
| `reposRoot` | no | Local repos root for ticket → code association. |
| `escalate` | no | Set `false` to disable the Opus pass. Default on. |

---

## What you get

```
research-PM-2026-Q3/
  PM-207-<kebab-slug>.md        ← dossier
  PM-210-<kebab-slug>.md
  _research/
    PM-207-context.md           ← raw context dump (Gather stage output)
    PM-210-context.md
```

Each dossier is an audit card plus two research-depth sections after the DoR block:

- **Open questions** — what a human must answer before the ticket is plannable.
- **Recommendation** — the call (plan as-is / refine first / split / drop) and the single next action.

The run reports each dossier path, its DoR verdict, and which tickets were escalated to Opus.

---

## Tips

- **Don't run the backlog-audit pipeline on 1–2 tickets.** That's what this workflow is for — it skips the scoper and synthesizer.
- **The `_research/` dumps are the source of truth** the analysis stage reads. If a dossier looks thin, check whether the dump captured the linked Notion/Slack/GitHub content.
- **One hop only.** Linked tickets are followed one level deep and capped at 8, to keep the gather cheap.

See also: [prompts cookbook](./prompts.md) · [quick-checks](./quick-checks.md) for a faster "is it ready?" without a full dossier.

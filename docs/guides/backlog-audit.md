# Backlog audit (the flagship workflow)

> Part of the [jira-tools workflow guide](../../WORKFLOW.md). New here? Start with [getting-started](./getting-started.md).

Reads an entire team backlog, audits every ticket, and produces a full planning package. It is three sequential skills: **scope → audit → synthesize**.

**When to use it:** before a quarterly planning cycle, before sprint planning on an unknown backlog, or any time you want a structured view of what's ready and what isn't.

**Output:** a folder with 9 synthesis documents + one markdown card per ticket, formatted as an Obsidian vault.

> [!info] Read-only on Jira
> Every phase only reads Jira. The only writes are markdown files. The synthesis package includes an actions-audit (`08`) that proves it.

---

## Pick how you run it

| Mode | Best when | Interactive? |
|---|---|---|
| **A — one-command workflow** | You know the scope and want one deterministic run | No (pass scope in `args`) |
| **B — one-shot conversational** | You trust the agent to chain all three steps | Lightly |
| **C — phase-by-phase subagents** | You want each phase to run fully autonomously, with checkpoints | Between phases |
| **D — step-by-step with the main agent** | You're iterating, or running only part of the pipeline | Yes |

---

## A — One-command workflow (recommended)

A single deterministic run of the whole pipeline — no manual chaining. Saved at [.agents/workflows/backlog-audit.js](../../.agents/workflows/backlog-audit.js) (exposed to Claude Code as `.claude/workflows/backlog-audit.js`). It runs scoper → auditor → synthesizer, fans the audit out over batches of ~3 tickets in parallel (all on Sonnet; only contested tickets get re-audited on Opus — see [model policy](../MODEL_POLICY.md)), and the phases hand off through files in the output folder.

```
Run the backlog-audit workflow with args:
{
  "outputFolder": "refinement-PM-2026-Q3",
  "project": "PM",
  "board": "267",
  "team": "Cloud Regions & Clusters",
  "buckets": "2026-Q3",
  "reposRoot": "/absolute/path/to/repos",   // optional — code association
  "batchSize": 3                             // optional — default 3
}
```

| arg | required | meaning |
|---|---|---|
| `outputFolder` | **yes** | Where the vault is written. Missing → the run aborts before touching Jira. |
| `project` | no | Project key (e.g. `PM`). |
| `board` | no | Board ID (e.g. `267`). |
| `team` | no | Team name; scoper resolves it to the `Team[Team]` UUID. |
| `buckets` | no | What defines the backlog: sprint/status names, comma-separated. |
| `reposRoot` | no | Local repos root for ticket → code association. |
| `batchSize` | no | Tickets per audit batch (default 3). |

If `project`/`board`/`team`/`buckets` are omitted, the scoper discovers the scope from the site and **states its assumptions** in the hand-off note. Pass them to be sure.

Watch progress with `/workflows`. The result reports the scoped count, cards written, the readiness split, any failed batches (retried once automatically), and whether the actions-audit confirmed Jira was untouched.

---

## B — One-shot conversational

If you trust the agent to run end-to-end without checkpoints:

```
Do a full backlog audit for board 267, team "Cloud Regions & Clusters".
Use the jira-backlog-scoping → jira-ticket-audit → jira-backlog-synthesis pipeline.
Save all output as Obsidian markdown in a new folder called refinement-PM-2026-Q3.
```

---

## C — Phase-by-phase with subagents (autonomous)

Invoke each subagent directly. They run independently, each with a model tuned for the task, and hand off through files on disk — the output folder is the interface between phases. Let each phase finish before starting the next.

**In Claude Code:**

```
# Phase 1
/agent jira-backlog-scoper
Scope the backlog for board 267, team "Cloud Regions & Clusters". Save to refinement-PM-2026-Q3.

# Phase 2 (after phase 1 completes)
/agent jira-ticket-auditor
Audit all tickets from the scope in refinement-PM-2026-Q3. Save cards to refinement-PM-2026-Q3/tickets/.

# Phase 3 (after phase 2 completes)
/agent jira-backlog-synthesizer
Synthesize the audit cards in refinement-PM-2026-Q3/tickets/ into the full planning package.
```

**In VS Code Copilot agent mode**, select the agent from the picker or name it in the prompt:

```
@jira-backlog-scoper Scope board 267 for team "Cloud Regions & Clusters"
```

All three default to **Sonnet**. Run standalone, an agent can't self-escalate — it flags a contested call so you can re-run that one question on Opus. (Inside the workflow, escalation is automatic.)

---

## D — Step-by-step with the main agent

Run one phase at a time, conversationally. Useful when iterating or running only part of the pipeline.

### Step 1 — Scope (`jira-backlog-scoping`)

Establishes the foundation everything downstream depends on.

```
Audit the backlog for the Cloud Regions & Clusters team on board 267.
Start with jira-backlog-scoping. Confirm the JQL query, map the custom fields,
and verify the scoring formula. Save the working note to refinement-PM-2026-Q3.
```

The agent confirms scope with you, builds the JQL, maps `customfield_XXXXX` → readable names (Score, Impact, Confidence, Size…), verifies `Score = Impact × Confidence × Size factor`, and saves the hand-off note.

### Step 2 — Audit each ticket (`jira-ticket-audit`)

```
Now run jira-ticket-audit on all tickets from the scope we just built.
Produce one markdown card per ticket. Save them to refinement-PM-2026-Q3/tickets/.
```

Per ticket: four axes (goal/scope clarity · UI/design needs · size-estimate coherence with a recomputed Score · prioritization soundness), a design hunt across five places (description, attachments, remote links, Notion links, custom design fields), a ticket → code mapping, and a DoR verdict: 🟢 Ready · 🟡 Almost ready · 🔴 Not ready.

The agent works in batches of ~3 tickets to stay under token limits — that's expected.

### Step 3 — Synthesize (`jira-backlog-synthesis`)

```
Run jira-backlog-synthesis on the audit cards in refinement-PM-2026-Q3/tickets/.
Produce the full synthesis package.
```

---

## The output documents

| # | Document | Contents |
|---|---|---|
| 00 | Executive summary | Key findings, readiness breakdown, top recommendation |
| 01 | Master table | All tickets ranked by recomputed score |
| 02 | Scoring model & methodology | Formula derivation and verification |
| 03 | Cross-cutting findings | Patterns: incomplete scoring, unrealistic estimates, epic candidates |
| 04 | Readiness plan | Sprint candidates, refinement actions, ADRs to open |
| 05 | Design review | Which tickets need design, what Figma/Notion was found |
| 06 | Code review | Ticket → repo mapping, what already exists |
| 07 | Tickets by project | Grouped by primary repo |
| 08 | Actions audit | Proof that nothing was written to Jira |
| 09 | Definition of Ready reference | The DoR rubric used across all cards |

---

## Tips

- **Batching is expected.** The auditor processes ~3 tickets at a time to avoid token limits.
- **No design link → the card says so.** The agent never invents a Figma/Notion link. `Not recorded` is a refinement signal.
- **Code association needs `reposRoot`** (workflow) or `QDRANT_REPOS_ROOT` in `AGENTS.local.md` (conversational). Without it, cards record code association as "not available".
- **Re-verify counts.** Synthesis recounts every frontmatter total with `rg`/`grep` before asserting — so should you if you edit cards by hand.

See also: [prompts cookbook](./prompts.md) · [model policy](../MODEL_POLICY.md) · [conceptual overview](../WORKFLOW_OVERVIEW.md)

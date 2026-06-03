# Workflow guide

This document explains how to use `jira-tools` with an AI agent: what agents are available, when to use each one, how to talk to them effectively, and the full workflows you can run.

---

## How it works

This repo ships with three layers:

| Layer | Location | Purpose |
|---|---|---|
| **Master instructions** | `AGENTS.md` | Golden rules, output format, and workflow overview picked up by any AI assistant |
| **Agents** | `.agents/agents/` | Autonomous subagents with a fixed model, tool set, and scope boundary |
| **Skills** | `.agents/skills/` | Detailed instruction sets that agents load at runtime for each phase |

When you open the repo as a workspace, the AI assistant reads `AGENTS.md` automatically. You can then either ask the main agent to run a workflow (it will call the right skills), or invoke a dedicated subagent directly for more autonomous execution.

### Agents vs. skills — when to use which

- **Talk to the main agent** when you want a conversational experience, need to iterate, or are running a partial workflow (e.g. just a DoR check on one ticket).
- **Invoke a subagent** (`jira-backlog-scoper`, `jira-ticket-auditor`, `jira-backlog-synthesizer`) when you want a phase to run fully autonomously end-to-end, without interruptions. Each subagent has a fixed model optimised for its task (`jira-ticket-auditor` runs on Opus for deeper reasoning; the others on Sonnet for speed).

**Prerequisites:**
- An AI coding assistant with agent/MCP support (VS Code + GitHub Copilot agent mode, Claude Code, Cursor, etc.)
- The Atlassian MCP server configured in `mcp.json` with a valid Jira token
- Optional: Codegraph MCP for code association (ticket → repo mapping)

---

## Available workflows

### 1. Full backlog audit (the main workflow)

The flagship workflow. Reads an entire team backlog, audits every ticket, and produces a full planning package. Made up of three sequential skills.

**When to use it:** before a quarterly planning cycle, before a sprint planning session on an unknown backlog, or any time you want a structured view of what's ready and what isn't.

**Output:** a folder with 9 synthesis documents + one markdown card per ticket, formatted as an Obsidian vault.

#### Step 1 — Scope the backlog (`jira-backlog-scoping`)

Establishes the foundation: what issues are in scope, how the scoring formula works, and what the custom fields mean. Everything downstream depends on this being correct.

**Prompt:**
```
Audit the backlog for the [team name] team on board [board ID].
Start with jira-backlog-scoping. Confirm the JQL query, map the custom fields,
and verify the scoring formula. Save the working note to [output folder].
```

**What the agent does:**
- Confirms scope parameters with you before querying anything
- Builds a JQL query that covers the right buckets (backlog, priority tiers, future sprints)
- Discovers cryptic `customfield_XXXXX` IDs and maps them to readable names (Score, Impact, Confidence, Size…)
- Deduces and verifies the RICE-style formula: `Score = Impact × Confidence × Size factor`
- Saves a working note with the scope, field map, and formula for the next steps

**What to tell the agent:**
- The board ID and team name
- Which buckets define the backlog (e.g. "Backlog, 2026-Q3, Backlog Prio 1, Backlog Prio 2")
- Where to save the output

---

#### Step 2 — Audit each ticket (`jira-ticket-audit`)

Reads every ticket from the scope and writes one detailed audit card per issue.

**Prompt:**
```
Now run jira-ticket-audit on all tickets from the scope we just built.
Produce one markdown card per ticket. Save them to [output folder]/tickets/.
```

**What the agent does for each ticket:**
- Judges it on **four axes**: goal/scope clarity · UI/design needs · size-estimate coherence (recomputes the score) · prioritization soundness
- Hunts for Figma/design links in five places: description, attachments, remote links, Notion links, and custom design fields
- Maps the ticket to the repos and code most likely to implement it
- Ends every card with a **Definition of Ready (DoR) verdict**: 🟢 Ready · 🟡 Almost ready · 🔴 Not ready

**Tips:**
- The agent works in batches of ~3 tickets to avoid token limits. This is expected.
- If a ticket has no design link, the card will say so explicitly — the agent never invents one.
- Code association works best when `QDRANT_REPOS_ROOT` is set in `AGENTS.local.md`.

---

#### Step 3 — Synthesize (`jira-backlog-synthesis`)

Rolls up all the audit cards into the planning package a team or PM actually reads.

**Prompt:**
```
Run jira-backlog-synthesis on the audit cards in [output folder]/tickets/.
Produce the full synthesis package.
```

**Output documents:**
| # | Document | Contents |
|---|---|---|
| 00 | Executive summary | Key findings in 6 points, readiness breakdown, top recommendation |
| 01 | Master table | All tickets ranked by recomputed score |
| 02 | Scoring model & methodology | Formula derivation and verification |
| 03 | Cross-cutting findings | Patterns: incomplete scoring, unrealistic estimates, epic candidates |
| 04 | Readiness plan | Sprint candidates, refinement actions needed, ADRs to open |
| 05 | Design review | Which tickets need design, what Figma/Notion was found |
| 06 | Code review | Ticket → repo mapping, what already exists |
| 07 | Tickets by project | Grouped by primary repo |
| 08 | Actions audit | Proof that nothing was written to Jira |
| 09 | Definition of Ready reference | The DoR rubric used across all cards |

---

#### One-shot (let the agent chain all three steps)

If you trust the agent to run end-to-end without checkpoints:

```
Do a full backlog audit for board [ID], team "[team name]".
Use the jira-backlog-scoping → jira-ticket-audit → jira-backlog-synthesis pipeline.
Save all output as Obsidian markdown in a new folder called refinement-[date].
```

#### Using the dedicated subagents (autonomous mode)

For fully autonomous execution, invoke each subagent directly instead of the main agent. The subagents run independently, each with a model tuned for their task.

**In Claude Code:**
```
# Phase 1
/agent jira-backlog-scoper
Scope the backlog for board [ID], team "[team name]". Save to [output folder].

# Phase 2 (after phase 1 completes)
/agent jira-ticket-auditor
Audit all tickets from the scope in [output folder]. Save cards to [output folder]/tickets/.

# Phase 3 (after phase 2 completes)
/agent jira-backlog-synthesizer
Synthesize the audit cards in [output folder]/tickets/ into the full planning package.
```

**In VS Code Copilot agent mode**, select the agent from the agent picker or reference it by name in your prompt:
```
@jira-backlog-scoper Scope board [ID] for team "[team name]"
```

> **Note:** Each subagent hands off to the next via files on disk — the output folder is the interface between phases. Make sure each phase completes and writes its files before starting the next.

---

### 2. Sprint planning (`sprint-planning`)

Plans a sprint from an already-scoped or audited backlog. Accounts for team capacity, PTO, and carryover. Applies the Definition of Ready gate — only 🟢 Ready tickets get committed.

**When to use it:** at the start of every sprint, especially after a backlog audit.

**Prompt:**
```
Plan the next sprint for [team name].
Team: [list of engineers], 2-week sprint starting [date].
[Name] is out [N] days. We have the audited backlog from [output folder].
Use sprint-planning.
```

**What to tell the agent:**
- Team members and their availability (PTO, recurring meetings)
- Sprint length and start date
- Any carryover from the previous sprint
- Goals or themes for this sprint (optional — the agent will suggest if not provided)

**Output:** a sprint plan document with P0 commits, stretch items, capacity breakdown, and sprint goals.

---

### 3. Definition of Ready check (`definition-of-ready`)

A quick readiness verdict on one or more tickets, without running the full audit.

**When to use it:** mid-sprint when someone asks "is this ticket ready to pick up?", or during ad-hoc refinement sessions.

**Prompts:**
```
Is PM-207 ready to start? Use the definition-of-ready rubric.
```
```
Check these tickets for readiness: PM-102, PM-184, PM-207.
Give me a verdict and what's missing for each one.
```

**The DoR checklist (7 points):**
1. Goal and scope clearly stated
2. Acceptance criteria defined
3. UI/design linked (if needed)
4. Size estimate present and coherent
5. Score is complete (no zero factors)
6. Not an epic in disguise (well-scoped, implementable)
7. Dependencies identified

**Verdicts:** 🟢 Ready to start · 🟡 Almost ready (one named blocker) · 🔴 Not ready

---

### 4. Ticket triage (`ticket-triage`)

For inbound **support tickets** — not product backlog items. Assigns P1–P4 priority and routes to the right team.

**When to use it:** when a customer issue comes in and you need to categorize and route it quickly.

**Prompt:**
```
Triage this support ticket:
[paste ticket title and description]

Assign a P1–P4 priority and suggest which team should handle it.
Check if it's a duplicate or known issue.
```

**Priority levels:**
| Level | Meaning |
|---|---|
| P1 | Production down / data loss — respond immediately |
| P2 | Major feature broken, workaround exists — respond within hours |
| P3 | Minor issue or degraded experience — respond within days |
| P4 | Cosmetic / low impact — schedule for backlog |

---

## Tips for talking to the agent

**Be explicit about scope.** The agent will always ask before querying Jira if scope is ambiguous, but you save a round-trip by providing board ID, team name, and bucket names upfront.

**Name the output folder.** Tell the agent where to save results. If you don't, it will ask. A good convention: `refinement-[project]-[YYYY-QN]/`.

**Chain skills explicitly.** When running the full pipeline, naming each skill (`jira-backlog-scoping → jira-ticket-audit → jira-backlog-synthesis`) helps the agent stay on track and not skip steps.

**Trust "Not recorded".** The agent is instructed never to invent data. If a design link, estimate, or acceptance criteria is missing, the card will say so. That's a signal for refinement, not an agent error.

**Code association needs local repos.** The ticket → repo mapping in `jira-ticket-audit` works by searching local clones. Add a `AGENTS.local.md` file (gitignored) with:
```
QDRANT_REPOS_ROOT=/absolute/path/to/your/repos
```

**The output is an Obsidian vault.** All synthesis documents use wikilinks (`[[PM-207|PM-207]]`), YAML frontmatter, and callouts. Open the output folder in Obsidian for the full experience, including Dataview queries over ticket metadata.

---

## Reference

### Agents

| Agent | Model | Pipeline step | Writes to Jira? |
|---|---|---|---|
| `jira-backlog-scoper` | Sonnet | Step 1 of 3 | Never |
| `jira-ticket-auditor` | Opus | Step 2 of 3 | Never |
| `jira-backlog-synthesizer` | Sonnet | Step 3 of 3 | Never |

### Skills

| Skill | Used by | Writes to Jira? |
|---|---|---|
| `jira-backlog-scoping` | `jira-backlog-scoper` | Never |
| `jira-ticket-audit` | `jira-ticket-auditor` | Never |
| `jira-backlog-synthesis` | `jira-backlog-synthesizer` | Never |
| `definition-of-ready` | `jira-ticket-auditor`, `sprint-planning`, main agent | Never |
| `sprint-planning` | Main agent (standalone) | Never |
| `ticket-triage` | Main agent (standalone) | Never |
| `atlassian-mcp` | Reference / setup | — |

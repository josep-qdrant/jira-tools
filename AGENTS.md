# Jira backlog audit & refinement

Instructions for **Jira backlog audit** tasks aimed at quarter planning (or similar): read a set of tickets, audit them across several axes, review the design and code involved, and produce synthesis documentation.

> Philosophy: **read-only on Jira** · **all output as Obsidian-native markdown** in the working folder · **always verify** data and arithmetic · **never invent**.

---

## Golden rules

1. **Never edit Jira.** Use read operations only (`search…`, `getJiraIssue`, `getJiraIssueRemoteIssueLinks`, metadata). Never `create…`, `edit…`, `transition…`, `addComment…`, or any write. The only writes in the session are markdown files on disk.
2. **Don't invent.** If a piece of data is missing (project, scope, design, estimate), mark it explicitly as uncertain. "Not recorded" beats a made-up value.
3. **Verify.** Re-confirm the scoring arithmetic on every ticket and re-check counts with `grep`/`rg`. "Looks right" is not enough.
4. **Surgical and traceable.** Every document answers what was asked; don't add speculative analysis or restructure what already works.
5. **Work in a scratchpad and copy.** Process in batches to avoid piling up context, and copy the result to the working folder at the end.

---

## Before you start — surface assumptions

Before extracting anything, make explicit and confirm the **scope parameters** with the user: team/board, project, which sprints or filter define the backlog, and the destination working folder. Don't infer them silently. If anything is ambiguous, ask before launching queries.

---

## Workflow — use the 3-skill chain

The full step-by-step procedure lives in three dedicated skills. Invoke them in order:

| Step | Skill | What it does |
|---|---|---|
| 1 | **`jira-backlog-scoping`** | Confirm scope parameters, build the JQL query, discover and map custom fields, deduce and verify the scoring formula. |
| 2 | **`jira-ticket-audit`** | Extract tickets in small batches, audit each on four axes, hunt for Figma/design links, identify the implicated repos/code, and end every card with a DoR block. |
| 3 | **`jira-backlog-synthesis`** | Roll up the cards into the full synthesis package (executive summary, master table, cross-cutting findings, readiness plan, methodology, design/code reviews, tickets-by-project matrix, actions audit report). |

Do not duplicate the detailed procedures here; load the relevant skill when needed.

---

## Output format — Obsidian vault

The working folder is an **Obsidian vault** (this repo has an `.obsidian/`). Every
deliverable — ticket cards and synthesis docs — must be **Obsidian-native
markdown**. Four conventions, applied to **deliverables only** (skill/agent
scaffolding under `.agents/` keeps ordinary relative-path links, since the agent
reads those by path):

### 1. Wikilinks for every internal cross-reference

Link between deliverables and to tickets with `[[target|alias]]`, never with
`[text](path.md)`:

- To a ticket card: `[[PM-207-self-service-cluster-suspension|PM-207]]`.
- To a sibling doc: `[[01-tabla-maestra|01 · Tabla maestra]]`.
- To a heading inside a doc: `[[02-master-table#Quick stats|stats]]`.
- **Any ticket key mentioned in prose becomes a wikilink** (e.g. "synergy with
  [[PM-296-backup-in-update-version-dialog|PM-296]]").

Rules:

- The target is the **basename without folder path and without `.md`**. Obsidian
  resolves it by filename across the vault, so a doc in the root can link a card
  in `tickets/` with no path. Keep deliverable filenames unique (the
  `PM-<n>-<slug>` and `NN-<slug>` schemes already are).
- Use the alias (`|`) to render a short, readable label.
- **External URLs stay standard markdown links** — Jira
  (`https://…/browse/PM-207`), `figma.com`, `notion.so`. Wikilinks are
  vault-internal only.
- Add `aliases: ["PM-207"]` to each card's frontmatter so a bare `[[PM-207]]`
  also resolves.

### 2. YAML frontmatter (Properties) on every file

Open every deliverable with a `---` frontmatter block so Obsidian Properties and
Dataview can query it. Always include a `tags:` list. The exact schemas live with
the skills that own each artifact: **ticket cards** → `jira-ticket-audit`,
**synthesis docs** → `jira-backlog-synthesis`.

### 3. Tags — a small controlled vocabulary

Use frontmatter `tags:` from a fixed set, not free-form: `backlog-audit` (all),
`ticket` / `synthesis` (kind), the project key (`PM`), and on cards the DoR
verdict (`readiness/ready`, `readiness/almost-ready`, `readiness/not-ready`).

### 4. Callouts for verdicts and alerts

Render the standout blockquotes as Obsidian callouts instead of plain `>`:

- Read-only / "nothing modified in Jira" note → `> [!info]`
- DoR verdict → `> [!success]` (🟢 ready) · `> [!warning]` (🟡 almost ready) ·
  `> [!danger]` (🔴 not ready)
- Estimate / hidden-scope alert → `> [!warning]`
- "Single source of truth / canonical" pointers → `> [!note]`

---

## Code association — where the repos live

Step 7 (identify the project/code involved) maps tickets to these repos. They live under **`QDRANT_REPOS_ROOT`** (host path; the `bash` mount may differ). Always characterize a repo by its README + dominant language before sweeping, and keep sweeps scoped to one repo + few terms.

### Local path configuration

Set **`QDRANT_REPOS_ROOT`** to the local directory that contains the Qdrant repos. It may be absolute or relative to this repository root. This file is intended to be shared in git, so do not hard-code a user's home directory here.

Resolution order:

1. If `AGENTS.local.md` exists, read it first and use its `QDRANT_REPOS_ROOT` value.
2. Otherwise, ask the user for `QDRANT_REPOS_ROOT` before doing code association.

Example local override (do not commit):

```md
QDRANT_REPOS_ROOT=../qdrant
```

### Core — Qdrant Cloud platform (default relevant)

| Repo | Path | Role | Lang |
| --- | --- | --- | --- |
| qdrant-cloud-public-api | `$QDRANT_REPOS_ROOT/qdrant-cloud-public-api` | **Source of truth.** The Protobuf API contracts (the `.proto` files). **Ignore `gen/`** — auto-generated SDKs, not source. | `.proto` |
| qdrant-cloud-cluster-api | `$QDRANT_REPOS_ROOT/qdrant-cloud-cluster-api` | Backend implementing the APIs; cluster metadata + k8s deployment. | Python |
| qdrant-cloud-ui | `$QDRANT_REPOS_ROOT/qdrant-cloud-ui` | Customer-facing dbaas console (cloud.qdrant.io). | React/TS |

### Supporting platform services

| Repo | Path | Role | Lang |
| --- | --- | --- | --- |
| qdrant-cloud-api-gateway | `$QDRANT_REPOS_ROOT/qdrant-cloud-api-gateway` | Public API entrypoint (REST+gRPC), fronts cluster-api, enforces perms via IAM. | Go |
| qdrant-cloud-iam-service | `$QDRANT_REPOS_ROOT/qdrant-cloud-iam-service` | gRPC identity/access mgmt: users, roles, permissions, auth. | Go |
| qdrant-cloud-admin-v2 | `$QDRANT_REPOS_ROOT/qdrant-cloud-admin-v2` | Internal admin dashboard for platform operators (TanStack). | React/TS |
| operator | `$QDRANT_REPOS_ROOT/operator` | Kubernetes operator (v2) handling cluster lifecycle. | Go |
| qdrant-cloud | `$QDRANT_REPOS_ROOT/qdrant-cloud` | Infra: multi-region k8s via Terraform + FluxCD, app manifests. | Terraform/Py |

### Testing / tooling

| Repo | Path | Role | Lang |
| --- | --- | --- | --- |
| cloud-test | `$QDRANT_REPOS_ROOT/cloud-test` | Functional & perf tests against the Cloud API. | TypeScript |
| qdrant-cloud-platform-local-kit | `$QDRANT_REPOS_ROOT/qdrant-cloud-platform-local-kit` | Minimal local runner for the cloud services. | Shell |

### Out of scope by default (OSS DB side, not cloud platform)

- `qdrant-js` — TS/JS client library for the OSS engine.
- `qdrant-web-ui` — self-hosted UI served by the Qdrant database itself.
- `skills-internal` — internal agent skills, no product code.

### Duplicates — ignore

`qdrant-cloud-admin-v2-copy`, `qdrant-cloud-cluster-api-copy`, `qdrant-cloud-ui-copy`, `qdrant-cloud-ui-copy2`, `qdrant-cloud-ui-autologin` are clones of the repos above (same git remote). Don't treat them as separate projects.

---

## Known gotchas

- **Board quick-filter ≠ JQL filter** → rebuild the scope with explicit fields (project + team + sprint).
- "Backlog buckets" may be **future sprints**, not statuses or a separate field; look at the real values of a few issues to confirm names/identifiers.
- **Search responses are huge** due to forced metadata → small batches + explicit fields.
- **`getJiraIssue`'s markdown format truncates the custom fields** → use the default format when you need the custom fields.
- **The score can come out 0** if factors are missing even when size is set → "incomplete scoring".
- **An attachment is not necessarily a design** → verify what each one is.
- **Figma/design usually lives in _remote links_**, not in the design field.
- **Mind each repo's actual language** when filtering by extension (filtering by the wrong glob returns 0 and misleads).
- **Code sweeps that are too broad → timeout** → scope by repo and by glob.
- **Host vs. bash paths differ** → file tools use host paths; `bash` uses the mount. Keep this in mind when copying between folders.
- **You can't write outside mounted folders** → if `Write` fails with "outside connected folders", mount the working folder first.
- **Anchor `Edit`s on stable, unique headings** when editing long markdown.
- **Obsidian wikilinks resolve by basename** → keep deliverable filenames unique; qualify with a path only on collision (`[[folder/name|alias]]`). Wikilinks are for deliverables; external URLs (Jira/Figma/Notion) stay markdown links.
- **Escape the alias pipe inside markdown tables** → a wikilink in a table cell needs `\|` before the alias (`[[PM-207-…\|PM-207]]`), or the `|` is read as a column separator and the row breaks. Outside tables a plain `|` is fine.

---

## Definition of Ready (DoR)

The shared DoR rubric (verdicts, seven-point checklist, reason taxonomy) lives in the **`definition-of-ready`** skill. Load it whenever you need to judge a ticket's readiness. Every ticket card produced by `jira-ticket-audit` must end with a DoR block following that rubric.

## Deliverables

The full deliverable spec (per-ticket card format and synthesis document list) is defined in the **`jira-ticket-audit`** and **`jira-backlog-synthesis`** skills respectively. Follow those specs — don't maintain a parallel list here.

---

## Tools

- **Jira (Atlassian MCP)**: read-only. Reference skill: `atlassian-mcp`.
- **Working folder / repos**: mount with `request_cowork_directory` before writing or analyzing code. The code repos to associate tickets with live under `QDRANT_REPOS_ROOT` — see **Code association — where the repos live** above for the path of each.
- **Shell (`bash`)**: for copying between folders, `grep`/`rg`, counts.
- **codegraph** (if available): structural queries over the code (what calls what, where a symbol is defined, impact). If unavailable, fall back to `rg`/`grep` + reading the README, always scoped.

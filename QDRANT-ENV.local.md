# Qdrant environment reference (local, not shipped with the skills)

This file holds the **company/environment-specific** values the backlog-audit
skills used to inline. The skills themselves are now project-agnostic: they
instruct to *discover* scope, field map, scoring model, and repo map per run.
This is the filled-in reference for **this** environment.

Read it top to bottom when you start an audit:

- **A. Stable facts** — true for *any* team/board/quarter in the Qdrant Jira
  instance. Reuse as-is.
- **B. Per-run scope template** — the blanks you fill in fresh each audit. Copy
  into your working note and complete via discovery.
- **C. Worked example** — one fully filled-in run (board 267) to show the shape.
- **D. Repo map** — for ticket-to-code association.

`*.local.md` is gitignored, so this stays local.

---

## A. Stable facts — Qdrant Jira instance

These do **not** change between teams, boards, or quarters. Custom-field IDs are
instance-wide; the scoring model is the PM project's RICE setup. Verify once,
then trust across runs.

### Constants

- **Site / cloudId:** `qdrant.atlassian.net`
- **Project:** `PM` (Product Management)

### Field map (customfield → label)

Instance-wide — the same IDs apply to every PM ticket regardless of team/board.

| Concept | Field | Notes |
|---------|-------|-------|
| Score (RICE) | `customfield_10090` | system-computed final number |
| Impact (calculated) | `customfield_10108` | numeric used in the Score |
| Confidence (select) | `customfield_10098` | High / Medium / Low |
| Confidence (calculated) | `customfield_10109` | numeric used in the Score |
| T-Shirt Size (select) | `customfield_10099` | XS / S / M / L / XL |
| T-Shirt Size (calculated) | `customfield_10110` | numeric factor (inverse to effort) |
| Target Impact | `customfield_10085` | often empty |
| Complexity | `customfield_10089` | |
| Acceptance Criteria | `customfield_10087` | usually a link to Notion |
| Draft Requirements | `customfield_10086` | often empty |
| UX Designs / Concept Design / Design | `customfield_10096` / `_10095` / `_10034` | often empty |
| Technical Documentation | `customfield_10097` | often empty |
| Objective Class | `customfield_10829` | Standard / Big Rock |
| Sprint | `customfield_10020` | holds the priority-bucket / quarter sprints |

### Scoring model (verified)

```
Score = Impact × Confidence × Size factor
```

- Impact / Confidence: High = 9 · Medium = 6 · Low = 2
- Size factor (inverse): XS = 10 · S = 8 · M = 6 · L = 4 · XL = 2

Verified against real audits: reconciles in 100% of issues with complete data.
Issues with Score 0 are missing Impact and/or Confidence (scoring incomplete) —
not a different formula.

---

## B. Per-run scope template — fill this in each audit

Everything below is **per-run**: discover and confirm it live, never assume it
carried over from a previous quarter or another team.

### Scope parameters (blank)

- **Team:** `<team name>`
- **Team UUID:** `<uuid>` — used in the `Team[Team]` JQL clause
- **Board:** `<board id>`
- **Backlog definition:** `<which sprints / statuses count as "the backlog">`
  (future sprints are often used as priority buckets — they are sprints, NOT
  statuses, NOT a separate field)
- **Issue types in scope:** `<e.g. Objective, Product Request>`

### Scope JQL skeleton (read-only)

```
project = PM
AND "Team[Team]" in (<team-uuid>)
AND Sprint in ("<bucket 1>", "<bucket 2>")
ORDER BY Rank ASC
```

### How to discover the blanks (proven call sequence)

1. JQL searches to find the team filter and sprint names (sample a few issues).
2. `getJiraProjectIssueTypesMetadata` to learn the project's issue types.
3. `getJiraIssue(<key>, fields: ["*all"], expand: "names")` on one issue to
   reconcile against the field map in section A.
4. Key+summary search of the full scope, paginated by Rank, to get the issue list.

All read-only.

### Gotcha — board quick-filters are not global JQL filters

A board's `?customFilter=NNN` in the URL is a **board quick-filter**, not a saved
global filter — `filter = NNN` in JQL returns 0. Rebuild the scope from
`project + Team[Team] + Sprint` as in the skeleton above.

---

## C. Worked example — "Cloud Regions and Clusters" (board 267)

One fully filled-in run, to show the shape of a completed section B. These values
are correct **only** for this specific team/board/period — they are an
illustration, not defaults.

### Filled scope parameters

- **Team:** Cloud Regions and Clusters
- **Team UUID:** `a58b9345-d5c4-46bd-857f-24747fe27038`
- **Board:** `267`
- **Backlog definition:** `Backlog Prio 1`, `Backlog Prio 2` (future sprints used
  as priority buckets)
- **Issue types in scope:** `Objective` (hierarchy 2), `Product Request` (hierarchy 0)

### Filled scope JQL

```
project = PM
AND "Team[Team]" in (a58b9345-d5c4-46bd-857f-24747fe27038)
AND Sprint in ("Backlog Prio 1", "Backlog Prio 2")
ORDER BY Rank ASC
```

Result: 18 issues, all of type `Objective` (12 in Prio 1, 6 in Prio 2).

> This run hit the quick-filter gotcha: the board's `?customFilter=272` returned
> 0 as `filter = 272`. Scope was rebuilt from project + Team[Team] + Sprint.

### The 18 issues audited

PM-102, 106, 184, 194, 207, 225, 252, 273, 281, 284, 288, 295, 296, 310, 313,
338, 345, 346.

Scoring reconciled in 15/15 issues with complete data; 3 had Score 0 from
missing Impact/Confidence.

---

## D. Qdrant Cloud repo map (for ticket-to-code association)

Repos live under `QDRANT_REPOS_ROOT` (host path; shell mount path may differ).
See `AGENTS.local.md` for the local value. Characterize per audit — names,
languages, and ownership drift.

### Core platform

| Repo | Path | Role | Lang |
| --- | --- | --- | --- |
| `qdrant-cloud-public-api` | `$QDRANT_REPOS_ROOT/qdrant-cloud-public-api` | Source of truth for Protobuf API contracts. Ignore `gen/`; it is generated SDK output. | `.proto` |
| `qdrant-cloud-cluster-api` | `$QDRANT_REPOS_ROOT/qdrant-cloud-cluster-api` | Backend implementing APIs; cluster metadata and Kubernetes deployment. | Python |
| `qdrant-cloud-ui` | `$QDRANT_REPOS_ROOT/qdrant-cloud-ui` | Customer-facing Cloud console. | React / TypeScript |

### Supporting services

| Repo | Path | Role | Lang |
| --- | --- | --- | --- |
| `qdrant-cloud-api-gateway` | `$QDRANT_REPOS_ROOT/qdrant-cloud-api-gateway` | Public API entrypoint; fronts cluster-api and enforces permissions via IAM. | Go |
| `qdrant-cloud-iam-service` | `$QDRANT_REPOS_ROOT/qdrant-cloud-iam-service` | Identity and access management: users, roles, permissions, auth. | Go |
| `qdrant-cloud-admin-v2` | `$QDRANT_REPOS_ROOT/qdrant-cloud-admin-v2` | Internal admin dashboard for platform operators. | React / TypeScript |
| `operator` | `$QDRANT_REPOS_ROOT/operator` | Kubernetes operator for cluster lifecycle. | Go |
| `qdrant-cloud` | `$QDRANT_REPOS_ROOT/qdrant-cloud` | Infra: multi-region Kubernetes via Terraform and FluxCD, app manifests. | Terraform / Python |

### Testing / tooling

| Repo | Path | Role | Lang |
| --- | --- | --- | --- |
| `cloud-test` | `$QDRANT_REPOS_ROOT/cloud-test` | Functional and performance tests against the Cloud API. | TypeScript |
| `qdrant-cloud-platform-local-kit` | `$QDRANT_REPOS_ROOT/qdrant-cloud-platform-local-kit` | Minimal local runner for cloud services. | Shell |

### Out of scope by default

- `qdrant-js` — JS/TS client library for the OSS engine.
- `qdrant-web-ui` — self-hosted UI served by Qdrant database.
- `skills-internal` — internal agent skills, not product code.

### Useful search terms / domain caveats (proven in past audits)

Search terms: `suspend`, `snapshot`, `vault`, `cors`, `gpu`, `traefik`,
`reserved`, `force.?delete|finalizer`, `bundle`, `backup`, `support`,
`diagnostics`.

- **`cluster-api` is Python**, not Go — filtering by `*.go` returns 0 and misleads.
- **The platform deploys with FluxCD, not ArgoCD** internally (a GitOps ticket is
  about *customer-facing* GitOps support, not internal ArgoCD).
- **Traefik lives in the infra repo**, not the services.
- Some enforcement (e.g. metrics-only API keys, CORS) may live in the **Qdrant
  engine** (the database itself), which is **outside** the cloud repos.

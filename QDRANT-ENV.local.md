# Qdrant environment reference (local, not shipped with the skills)

This file holds the **company/environment-specific** values the backlog-audit
skills used to inline. The skills themselves are project-agnostic: they instruct
to *discover* scope, field map, scoring model, and repo map per run. This is the
filled-in reference for **this** environment.

Read it top to bottom when you start an audit:

- **A. Stable facts** — true for *any* team/board/quarter in the Qdrant Jira
  instance. Reuse as-is.
- **B. Per-run scope template** — the blanks you fill in fresh each audit. Copy
  into your working note and complete via discovery.
- **C. Repo map** — for ticket-to-code association.

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

### Scoring model

```
Score = Impact × Confidence × Size factor
```

- Impact / Confidence: High = 9 · Medium = 6 · Low = 2
- Size factor (inverse): XS = 10 · S = 8 · M = 6 · L = 4 · XL = 2

Verify once per environment, then trust across runs. Issues with Score 0 are
missing Impact and/or Confidence (scoring incomplete) — not a different formula.

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

### How to discover the blanks (read-only call sequence)

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

## C. Qdrant Cloud repo map (for ticket-to-code association)

Repos live under `QDRANT_REPOS_ROOT` (host path; shell mount path may differ).
See `AGENTS.local.md` for the local value. Characterize per audit — names,
languages, and ownership drift.

The scope below is the **Regions & Clusters (R&C)** unit — the one this backlog
belongs to. Source: `cloud-rc-docs/docs/architecture/` (repo-ownership +
context maps). Scope drifts — re-check per run.

### R&C-owned — full (whole repo is ours)

These are the primary association targets for an R&C ticket.

| Repo | Path | Role | Lang |
| --- | --- | --- | --- |
| `qdrant-cloud-ui` | `$QDRANT_REPOS_ROOT/qdrant-cloud-ui` | Customer-facing Cloud console; consumes the Cluster API. | React / TypeScript |
| `operator` | `$QDRANT_REPOS_ROOT/operator` | Kubernetes operator: provisions, scales, upgrades clusters from desired state. | Go (+ Python) |
| `kubernetes-api` | `$QDRANT_REPOS_ROOT/kubernetes-api` | Cluster CRD schemas — the desired-state types the operator realizes. | Go |
| `qdrant-cloud-auth-sidecar` | `$QDRANT_REPOS_ROOT/qdrant-cloud-auth-sidecar` | Data-plane auth: validates each request to a managed cluster (API key / JWT / dashboard cookie) via Traefik. | Go |
| `qdrant-cluster-exporter` | `$QDRANT_REPOS_ROOT/qdrant-cluster-exporter` | Prometheus exporter that discovers and scrapes running clusters. | Go |
| `qdrant-cloud-cluster-service` | `$QDRANT_REPOS_ROOT/qdrant-cloud-cluster-service` | New R&C gRPC backend — currently a scaffold (health + reflection only; not yet wired at runtime). | Go |
| `qdrant-private-cloud` | `$QDRANT_REPOS_ROOT/qdrant-private-cloud` | Helm packaging of the self-hosted stack (operator + cluster manager). | Helm / YAML |
| `cloud-rc-docs` | `$QDRANT_REPOS_ROOT/cloud-rc-docs` | R&C documentation vault; source of the ownership + context maps above. | Markdown |

### R&C-owned — partial / path-scoped (only some paths are in scope)

Associate only to the relevant paths; the rest of the repo is out of scope.

| Repo | Lang | In-scope paths |
| --- | --- | --- |
| `qdrant-cloud-cluster-api` | Python | `/cluster_api/cluster`, `/cluster_api/alert`, `/tests/cluster` |
| `qdrant-cloud` | Terraform / Python | `flux/**`, `environments/*/multi-region-setups/**`, `environments/*/apps/qdrant-releases`, `.github/workflows/operator-kubernetes-api-update.yaml`, `.github/workflows/qdrant-db-acceptance-checks.yaml` |

### Other scopes — neighbours (not in R&C scope, kept for context)

Listed because R&C tickets often touch them or they are easy to mistake for ours.
A ticket that lands mainly here probably belongs to another scope.

| Repo | Role | Lang |
| --- | --- | --- |
| `qdrant-cloud-public-api` | Protobuf API contract; source of truth for clients. Ignore `gen/` (generated). R&C co-defines + consumes. | `.proto` |
| `qdrant-cloud-api-gateway` | Public API entrypoint; fronts cluster-api, enforces permissions via IAM. | Go |
| `qdrant-cloud-iam-service` | Identity and access: users, roles, permissions, auth. | Go |
| `qdrant-cloud-route-manager` | Configures the shared Envoy fleet via xDS. | Go |
| `qdrant-cloud-envoy` | Helm chart for the edge Envoy proxy fleet. | Helm / YAML |
| `qdrant-cloud-internal-api` | Internal API contract. | `.proto` |
| `serverless-operator` | Serverless cluster operator. | Go |
| `qdrant-cloud-cluster-admin` | Cluster admin backend. | Go |
| `qdrant-cloud-admin-v2` | Internal platform-admin console (React 19 + TanStack, ConnectRPC). | React / TypeScript |
| `terraform-provider-qdrant-cloud` | Official Terraform provider over the public API. | Go |
| `qdrant-cloud-agent` | Hybrid Cloud agent that bridges a customer cluster back to the control plane. | Go |

### Reference / clients / engine (no CODEOWNERS or out of product scope)

- `qdrant` — the OSS vector-search engine (database itself); read-only reference for engine config keys/enums.
- `qcloud-cli`, `qdrant-js` — official clients over the public API.
- `cloud-test`, `cloud-test-newman` — functional / performance tests against the Cloud API.
- `qdrant-cloud-platform-api`, `qdrant-cloud-platform-local-kit`, `node-update-operator`, `qdrant-web-ui` — no CODEOWNERS; treat as not-ours unless told otherwise.
- `skills-internal` — internal agent skills, not product code.

### Local working copies — ignore

`*-copy`, `*-copy2`, `*-autologin` clones (e.g. `qdrant-cloud-ui-copy`,
`qdrant-cloud-cluster-api-copy`, `qdrant-cloud-admin-v2-copy`) are local scratch
checkouts, not separate repos. Always search the canonical repo.

### Search terms and domain caveats

Search terms: `suspend`, `snapshot`, `vault`, `cors`, `gpu`, `traefik`,
`reserved`, `force.?delete|finalizer`, `bundle`, `backup`, `support`,
`diagnostics`.

- **`cluster-api` is Python**, not Go — filtering by `*.go` returns 0 and misleads.
- **The platform deploys with FluxCD, not ArgoCD** internally (a GitOps ticket is
  about *customer-facing* GitOps support, not internal ArgoCD).
- **Traefik lives in the infra repo**, not the services.
- Some enforcement (e.g. metrics-only API keys, CORS) may live in the **Qdrant
  engine** (the database itself), which is **outside** the cloud repos.

# Qdrant environment reference (local, not shipped with the skills)

This file holds the **company/environment-specific** values the backlog-audit
skills used to inline. The skills themselves are now project-agnostic: they
instruct to *discover* scope, field map, scoring model, and repo map per run.
This is the filled-in reference for **this** environment — paste the relevant
parts into a working note when you start a Qdrant audit, or hand them to the
skills as the "scope parameters".

`*.local.md` is gitignored, so this stays local.

---

## A. Worked example — "Cloud Regions and Clusters" (project PM, board 267)

A fully filled-in scoping result from a real audit. Use it to see the **shape**
of a completed scoping step. **Discover these values per run** — they are correct
only for this specific team/board/period.

### Scope parameters

- **Site / cloudId:** `qdrant.atlassian.net`
- **Project:** `PM` (Product Management)
- **Board:** `267`
- **Team:** Cloud Regions and Clusters
- **Team UUID:** `a58b9345-d5c4-46bd-857f-24747fe27038`
- **Backlog sprints:** `Backlog Prio 1`, `Backlog Prio 2` (future sprints used as
  priority buckets — NOT statuses, NOT a separate field)
- **Issue types:** `Objective` (hierarchy 2), `Product Request` (hierarchy 0)

### Scope JQL (read-only)

```
project = PM
AND "Team[Team]" in (a58b9345-d5c4-46bd-857f-24747fe27038)
AND Sprint in ("Backlog Prio 1", "Backlog Prio 2")
ORDER BY Rank ASC
```

Result: 18 issues, all of type `Objective` (12 in Prio 1, 6 in Prio 2).

> The board's `?customFilter=272` is a board quick-filter, not a saved global
> filter — `filter = 272` in JQL returns 0. The scope had to be rebuilt from
> project + Team[Team] + Sprint as above.

### Field map (customfield → label)

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
| Draft Requirements | `customfield_10086` | empty across the set |
| UX Designs / Concept Design / Design | `customfield_10096` / `_10095` / `_10034` | empty across the set |
| Technical Documentation | `customfield_10097` | empty across the set |
| Objective Class | `customfield_10829` | Standard / Big Rock |
| Sprint | `customfield_10020` | here: Prio 1 / Prio 2 (and past quarter sprints) |

### Scoring model (verified)

```
Score = Impact × Confidence × Size factor
```

- Impact / Confidence: High = 9 · Medium = 6 · Low = 2
- Size factor (inverse): XS = 10 · S = 8 · M = 6 · L = 4 · XL = 2 (XL inferred —
  no issue in the set used it)

Verified: reconciles in 100% of the 15 issues with complete data. 3 issues had
Score 0 from missing Impact/Confidence (scoring incomplete).

### The 18 issues audited

PM-102, 106, 184, 194, 207, 225, 252, 273, 281, 284, 288, 295, 296, 310, 313,
338, 345, 346.

### How the discovery actually went (call sequence)

1. JQL searches to find the team filter and sprint names (sample issues).
2. `getJiraProjectIssueTypesMetadata` to learn the project's issue types.
3. `getJiraIssue(<key>, fields: ["*all"], expand: "names")` on one issue to
   build the field map.
4. Key+summary search of the full scope, paginated by Rank.

All read-only.

---

## B. Qdrant Cloud repo map (for ticket-to-code association)

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

# Qdrant Cloud repo map

Use this for ticket-to-code association. Repos live under `QDRANT_REPOS_ROOT`
(host path; shell mount path may differ). Read `AGENTS.local.md` first for the
local value. If it is missing, ask the user.

## Core platform

| Repo | Path | Role | Lang |
| --- | --- | --- | --- |
| `qdrant-cloud-public-api` | `$QDRANT_REPOS_ROOT/qdrant-cloud-public-api` | Source of truth for Protobuf API contracts. Ignore `gen/`; it is generated SDK output. | `.proto` |
| `qdrant-cloud-cluster-api` | `$QDRANT_REPOS_ROOT/qdrant-cloud-cluster-api` | Backend implementing APIs; cluster metadata and Kubernetes deployment. | Python |
| `qdrant-cloud-ui` | `$QDRANT_REPOS_ROOT/qdrant-cloud-ui` | Customer-facing Cloud console. | React / TypeScript |

## Supporting services

| Repo | Path | Role | Lang |
| --- | --- | --- | --- |
| `qdrant-cloud-api-gateway` | `$QDRANT_REPOS_ROOT/qdrant-cloud-api-gateway` | Public API entrypoint; fronts cluster-api and enforces permissions via IAM. | Go |
| `qdrant-cloud-iam-service` | `$QDRANT_REPOS_ROOT/qdrant-cloud-iam-service` | Identity and access management: users, roles, permissions, auth. | Go |
| `qdrant-cloud-admin-v2` | `$QDRANT_REPOS_ROOT/qdrant-cloud-admin-v2` | Internal admin dashboard for platform operators. | React / TypeScript |
| `operator` | `$QDRANT_REPOS_ROOT/operator` | Kubernetes operator for cluster lifecycle. | Go |
| `qdrant-cloud` | `$QDRANT_REPOS_ROOT/qdrant-cloud` | Infra: multi-region Kubernetes via Terraform and FluxCD, app manifests. | Terraform / Python |

## Testing / tooling

| Repo | Path | Role | Lang |
| --- | --- | --- | --- |
| `cloud-test` | `$QDRANT_REPOS_ROOT/cloud-test` | Functional and performance tests against the Cloud API. | TypeScript |
| `qdrant-cloud-platform-local-kit` | `$QDRANT_REPOS_ROOT/qdrant-cloud-platform-local-kit` | Minimal local runner for cloud services. | Shell |

## Out of scope by default

- `qdrant-js` — JS/TS client library for the OSS engine.
- `qdrant-web-ui` — self-hosted UI served by Qdrant database.
- `skills-internal` — internal agent skills, not product code.

# 🧭 Summary

Qdrant **1.18** introduces a load-time **`storage.low_memory_mode`** setting that brings a node up in a "from-disk-only" mode. It only changes *how segments are loaded at startup* — it does **not** modify any persisted configuration — and is intended as a recovery knob when a node crash-loops on out-of-memory (OOM).

Today, when a Cloud cluster OOMs (e.g. too many collections/replicas, mmap-limit panics, "Cannot allocate memory" on shard load), support has to either **vertically scale** the cluster, **delete collections**, **restore from backup**, or hand-apply low-level `operator.qdrant.io/applied-json-patch-*` annotations on the node. These are slow, risky, and not self-service.

This initiative lets **admins/support toggle `low_memory_mode` per cluster through an easy CLI**, so an OOM-ing cluster can be brought up read-from-disk *without vertical scaling*, long enough to delete data and recover. The setting is **internal-only** — it is never exposed in the public API or the customer console.

# 👥 Contributors

- **Main author:** Josep Fornies (assignee of [CRC-1916](https://qdrant.atlassian.net/browse/CRC-1916))
- **Reporter / requestor:** Bastian Hofmann
- **PM / planning:** Amogha Sathyanarayana, Dani Terrín
- **Stakeholders:** Regions & Clusters team (operator + cluster-api owners), Support/On-Call (primary consumers), Security (permission gating review)

# 🔗 Related Jira

- **Objective:** [PM-471](https://qdrant.atlassian.net/browse/PM-471) — *Support Qdrant low memory mode in Cloud* (Ready for planning; flagged as late Q2 add, likely Q3-2026)
- **Milestone:** [CRC-1915](https://qdrant.atlassian.net/browse/CRC-1915) — *Support Qdrant low memory mode in Cloud* (In Progress, Q2-2026)
- **Story:** [CRC-1916](https://qdrant.atlassian.net/browse/CRC-1916) — *Support Qdrant low memory mode in Cloud* (In Progress)
- **Upstream reference:** Qdrant config — [`config/config.yaml` (storage section)](https://github.com/qdrant/qdrant/blob/94db47bb5bcbd68d7c6fdf4b10daccf5170a68ce/config/config.yaml#L45-L56)
- **Related runbook:** *Resolving mmap Limit Issues on Qdrant Clusters* (Notion, On-Call Run-books) — the manual OOM remediation this feature replaces.

# ✅ Goals & Success Criteria

**Goals**

- A cloud admin/support engineer can set `low_memory_mode` to `disabled` | `no_resident` | `no_populate` on a specific cluster with a single CLI command, and turn it off again.
- The setting is plumbed through the cluster configuration → CRD → operator → rendered Qdrant `config.yaml`, gated to Qdrant ≥ 1.18.
- The setting is **not** present in the public API or customer UI.

**Success looks like**

- An OOM crash-looping cluster can be recovered (started read-from-disk, data deleted) **without vertical scaling**, driven entirely from the support CLI.
- Setting/unsetting is reversible and idempotent; "off" returns the cluster to normal load behaviour.
- No customer-facing surface area is added.
- Behaviour is covered by operator unit + integration tests and cluster-api unit tests, mirroring the existing `hide_jwt_dashboard` precedent.

# 📋 Requirements

**Product**

- Per-cluster toggle with the three engine values plus an explicit "off"/unset.
- Admin/support only — invokable from the internal support tooling, never by end users.
- Easy to use: one command, takes a cluster id and a mode; clear help text.
- Reversible and idempotent.

**Security / Compliance**

- Mutation gated behind the existing internal permission (`internal:write:clusters`).
- The field must be **stripped** from any public/customer-facing API response (mirror the `hide_jwt_dashboard` handling).
- The action should be auditable: who toggled it, on which cluster, to which value, and when.

**Performance / Scalability**

- `low_memory_mode` deliberately trades latency/throughput for lower RAM (loads components from disk, skips mmap prefault). This degradation is expected and acceptable **only as a temporary recovery state** — the design must make it easy to detect and revert, not become a silent permanent config.

# 🧠 Design Overview

The cleanest path is to model `low_memory_mode` as a **structured, internal-only cluster-configuration field**, following the exact pattern already used for `hide_jwt_dashboard` (an admin-only Qdrant config flag that is gated out of the public API). That precedent already crosses every layer this ticket names — `kubernetes-api`, `operator`, the cluster configuration, and the public-API gate — so we extend the same seams instead of inventing a new mechanism.

`low_memory_mode` lives under the engine's `storage:` block (sibling of `on_disk_payload`), so it slots into the existing `StorageConfig` rather than the service/top-level config.

### End-to-end path

```
support CLI (cluster-api Typer `clusters` group)
   └─ writes storage.low_memory_mode into the cluster config (cluster-api models + DB)
        └─ internal write path / internal-api ClusterService (internal:write:clusters)
             └─ cluster config synced into the QdrantCluster CR  (kubernetes-api CRD)
                  └─ operator reconcile renders it into the Qdrant config.yaml ConfigMap
                       (version-gated: only if Qdrant >= 1.18)
                       └─ Qdrant pod reads storage.low_memory_mode at startup
                            → node comes up in from-disk-only mode
   public API / customer UI: field is popped → NOT exposed
```

### Component map (verified against the repos)

| Layer | Repo / file | What changes |
|---|---|---|
| **Cluster configuration model** | `qdrant-cloud-cluster-api/cluster_api/cluster/models.py`, `…/models_db.py` | Add `low_memory_mode` to the storage config model + DB JSON config + its allow-list (cf. `service_jwt_allowed_opts` at `models_db.py:1011`). |
| **Public-API gate** | `qdrant-cloud-cluster-api/grpc_api/cluster/v1/schema_mapper.py:537-540` | Pop `low_memory_mode` before exposing publicly, exactly like `hide_jwt_dashboard` ("used internally and does not need to be exposed publicly"). |
| **internal-api** | `qdrant-cloud-internal-api/proto/qdrant/cloud/internal_api/cluster/v1/cluster.proto` (`ClusterService`, line 16; gated by `internal:read/write:clusters`) | The internal write RPC the CLI uses to persist the config change. Decide: carry it inside the structured cluster config it already round-trips, vs. a generic patch (see Open Questions). |
| **kubernetes-api (CRD)** | `kubernetes-api/api/v1/qdrantcluster_types.go` — `QdrantConfiguration.Storage *StorageConfig` (:498), `StorageConfig` (:551) | Add `LowMemoryMode *string` with `+kubebuilder:validation:Enum=disabled;no_resident;no_populate` + a `GetLowMemoryMode()` getter (cf. `HideJwtDashboard` :633 / getter :665). Regenerate `zz_generated.deepcopy.go`, `crds/qdrant.io_qdrantclusters.yaml`, and the helm chart CRD. |
| **operator (rendering)** | `operator/pkg/controller/qdrant_cluster_configmap.go` — storage map assembly (~:243-263), `yaml.Marshal` (:358) → `production.yaml` (:376) | In the `config["storage"]` map (next to the `performance` block), set `storage["low_memory_mode"] = <value>` when the field is set **and** the version supports it. |
| **operator (version gate)** | `operator/pkg/cluster/features/features.go` — `MinSupportedVersionsByConfig` (:64), `IsSupportedByVersion` (:190), `ShouldEnableHideJwtDashboard` (:148) | Add `lowMemoryModeConfigKey = "LowMemoryMode"`, register `"v1.18.0"`, and a `ShouldRenderLowMemoryMode(qc)` helper. |
| **CLI tool** | `qdrant-cloud-cluster-api/cluster_api/cli/__init__.py` (Typer app), `…/cluster/commands.py` (`cluster_cli`) | Add `clusters set-low-memory-mode --cluster-id … --mode {disabled,no_resident,no_populate}` and an unset/off path. This is the internal support CLI — **not** the customer-facing `qcloud`. |

### Engine semantics (from the upstream config comment)

- **`disabled`** (default): load segments as persisted.
- **`no_resident`**: downgrade components to their on-disk variants where possible — quantization loads as if `always_ram=false`, payload field indexes as if `on_disk=true`, payload storage as mmap (not populated).
- **`no_populate`**: same as `no_resident`, plus skip mmap prefault on load for vectors, HNSW graph and payload storage.

Because it is a **load-time** setting read from `config.yaml` at startup, changing it only takes effect on (re)start of the Qdrant process — see Failure Modes.

# 🔍 Alternatives Considered

1. **Operator JSON-patch annotation** (`operator.qdrant.io/applied-json-patch-*`). Already used by support today (e.g. the mmap-limit runbook). *Pros:* zero code, available now. *Cons:* manual, undiscoverable, no validation, easy to get wrong, and explicitly not what the ticket asks for. → Keep as the interim manual workaround; not the deliverable.
2. **Expose in the public API + customer UI.** Rejected — the ticket requires it stay internal; it is a performance-degrading footgun that customers should not self-serve.
3. **Reuse the existing `recovery_mode`** (`QDRANT_ALLOW_RECOVERY_MODE`, `operator/pkg/controller/qdrant_cluster_pod.go:101`, feature `AllowRecoveryModeKey` ≥ v1.4.0). Different semantics: recovery mode starts the node *without loading collections* (can't serve, used purely to delete); `low_memory_mode` loads from disk and can still serve in a degraded state. **Complementary, not a substitute** — `low_memory_mode` is the gentler first step.
4. **Per-collection on-disk knobs** (`vectors.on_disk`, `on_disk_payload`, already modeled in the CRD). These persist and require re-optimization; `low_memory_mode` is a transient, cluster-wide startup knob designed for emergencies. Better suited to the recovery use case.

# 🧱 Implementation Plan

**Phase 1 — MVP (toggle works end-to-end)**

1. `kubernetes-api`: add `LowMemoryMode *string` (enum) to `StorageConfig` + getter; regenerate deepcopy, CRD yaml, helm chart.
2. `operator`: render `storage["low_memory_mode"]` in `qdrant_cluster_configmap.go`, gated by a new `features.go` entry (`"v1.18.0"`).
3. `qdrant-cloud-cluster-api`: add `low_memory_mode` to the storage config model + DB config + allow-list; pop it in `schema_mapper.py` so it never reaches the public API.
4. `internal-api`: ensure the write path carries the field (structured field vs. patch — see Open Questions).
5. CLI: add `clusters set-low-memory-mode` / unset to the internal Typer CLI.

**Phase 2 — Hardening**

6. Audit-log the toggle (actor, cluster, value, timestamp).
7. CLI UX: confirm-on-restart warning, show current value in `clusters describe`.
8. Observability: surface "cluster is in low_memory_mode" (telemetry/admin UI), optionally alert when left on > N hours.
9. Docs: update the mmap/OOM runbook to point at the CLI instead of manual collection deletion / annotation patches.

# 🧪 Testing Strategy

- **operator unit test** — extend `qdrant_cluster_configmap_test.go` to assert `storage.low_memory_mode` is rendered for each value and **omitted** when unset or when version < 1.18 (mirror the `hide_jwt_dashboard` cases).
- **operator integration test** — new test mirroring `integration_tests/tests/hide_jwt_dashboard_test.py` / `recovery_mode_test.py`: set the field, assert the ConfigMap content and pod startup.
- **cluster-api unit tests** — config model round-trip + `schema_mapper` pop (mirror `tests/cluster/test_service.py`, `test_service_add_cluster.py`).
- **version gating** — explicit test that a < 1.18 cluster does not get the key (avoid Qdrant rejecting an unknown config field).
- **CLI smoke test** — set/unset against a dev cluster; confirm the value reaches the rendered config and is absent from the public API response.

# 🔐 Security & Privacy Considerations

- No customer data is touched; the setting only affects load strategy.
- Mutation is gated behind `internal:write:clusters` (internal-api permission model).
- The field is **stripped** from public API responses (`schema_mapper.py`), so it is invisible to customers.
- Toggling is an admin action with operational impact (forces restart, degrades performance) → must be **audited**.

# 🆘 Failure Modes & Mitigations

- **Takes effect only on restart.** `low_memory_mode` is read at startup. On a healthy cluster, setting it triggers an operator reconcile → rolling restart (brief downtime). *Mitigation:* CLI warns about restart; in the target OOM crash-loop scenario the pod is already down, so this is expected.
- **Set on Qdrant < 1.18.** An unknown config key could make the engine fail to start. *Mitigation:* operator version gate (don't render if unsupported) + validate version in cluster-api/CLI.
- **Left on permanently.** Cluster silently runs degraded. *Mitigation:* surface the state in admin tooling/telemetry; document; optional alert.
- **`no_populate` too aggressive vs `no_resident`.** *Mitigation:* CLI help + runbook guidance (start with `no_resident`, escalate to `no_populate`).
- **Config drift** if both the structured field and an annotation patch set it. *Mitigation:* document precedence; prefer the structured field and remove ad-hoc annotations.

# 🔄 Rollout & Migration Plan

- **No data migration.** New optional config field; default unset = current behaviour.
- **Ordering:** ship the operator + kubernetes-api CRD/chart first (renders only when the field is set *and* version ≥ 1.18 — safe no-op until used), across all regions; then cluster-api + CLI.
- **Rollback:** unset the field → restart → normal load behaviour. The operator/kubernetes-api change is backward-compatible (additive, optional).

# 📣 Communication Plan

- **Internal only** — no customer-facing comms (the feature is not exposed to customers).
- Update the **mmap/OOM run-book** to reference the new CLI command as the preferred remediation.
- Short demo / note in **R&C Knowledge Sharing**.

# 🔓 Open Questions

1. **internal-api shape:** carry `low_memory_mode` inside the structured cluster config the write RPC already round-trips, or via a generic patch? (Recommend: structured field, for validation + discoverability.)
2. **Scope:** cluster-wide only (shared ConfigMap), or is a per-node override ever needed? (Recommend: cluster-wide.)
3. **Restart UX:** let the normal operator reconcile roll the pods, or add an explicit "apply + restart" step in the CLI? (Recommend: rely on reconcile; document.)
4. **Lingering-state safety:** do we want telemetry/alerting when a cluster stays in `low_memory_mode` beyond some window?
5. **Validation placement:** confirm whether cluster-api validates Qdrant-version-vs-config-key, or if the operator is the only gate.
6. **CLI verb naming:** `clusters set-low-memory-mode` vs a generic `clusters set-config low_memory_mode=…` — align with existing `cluster_cli` command conventions in `commands.py`.

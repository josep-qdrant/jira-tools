# Identifying the project/code a ticket touches

The goal: for each ticket, name the repo(s) involved, sketch the high-level
approach, and state how confident you are — without going down a rabbit hole or
timing out on giant searches.

## Order of operations

1. **Mount the repos** (the base projects folder) so you can read them.
2. **Characterize each repo before searching it.** Read the `README` for scope
   and detect the real language (`go.mod` → Go, `package.json` → JS/TS,
   `pyproject.toml`/`setup.py` → Python). The repo name can lie about the
   language — verify it.
3. **Prefer `codegraph` when available.** If the `codegraph_*` MCP tools are
   present, use them for structural questions (where is X defined, what calls X,
   what would changing X break). They're sub-millisecond and AST-accurate — far
   better than grep for "does this code/pattern exist". Seed `codegraph_explore`
   with the symbol/feature names from the ticket.
4. **Otherwise, scoped term sweeps.** `rg -i -l <term> <one-repo>`, one repo and
   a few terms at a time. **Do not** sweep all repos × many terms at once — that
   times out. Narrow by repo and by glob, and mind the language (a `--glob
   '*.go'` filter returns 0 in a Python repo).

## What to write per ticket

- **Project(s) involved** — distinguish the **leader** (who should coordinate)
  from **secondary** repos. Most tickets are multi-repo.
- **How it'd be done at a high level** — one or two sentences, no file-by-file
  detail.
- **Technical notes** — risks (e.g. data loss), dependencies on other tickets,
  decisions still open.
- **Identification confidence** — High / Medium / Low, with the reason. If the
  scope genuinely can't be pinned (no description, cross-cutting architecture),
  say "not scopable" rather than guessing.

## Worked example — Qdrant Cloud repo map

> **Canonical, live map:** the project's `AGENTS.md` (section *"Code association —
> where the repos live"*) holds the authoritative, full repo map with real paths
> and the "duplicates to ignore" list. The table below is a **worked-example
> snapshot** for portability — when working in this repo, defer to `AGENTS.md` and
> don't maintain a second authoritative copy here.

The repos in the Qdrant Cloud platform and what each owns (verify per audit;
names and ownership drift):

| Repo | Language | Scope |
|------|----------|-------|
| `qdrant-cloud-ui` | React (MUI, TanStack, Connect/protobuf, apexcharts) | frontend |
| `qdrant-cloud-cluster-api` | **Python** | control-plane API (packages: `booking`, `metrics`, `backup`, `authentication`, `payment`, `control_plane`…) |
| `operator` | Go | Kubernetes operator (pods, PVCs, resources, GPU, snapshots, finalizers) |
| `qdrant-cloud-public-api` | `.proto` | the API contract — changes in most behavior tickets |
| `qdrant-cloud-iam-service` | Go | platform authn/authz |
| `qdrant-cloud` | Terraform / FluxCD | infrastructure |
| `qdrant-cloud-admin-v2` | — | admin |
| `qdrant-cloud-api-gateway` | — | gateway |

Useful, already-proven search terms for this domain: `suspend`, `snapshot`,
`vault`, `cors`, `gpu`, `traefik`, `reserved`, `force.?delete|finalizer`,
`bundle`, `backup`, `support`, `diagnostics`.

Domain caveats learned the hard way:

- **`cluster-api` is Python**, not Go — filtering by `*.go` returns 0 and misleads.
- **The platform deploys with FluxCD, not ArgoCD** internally (a GitOps ticket is
  about *customer-facing* GitOps support, not internal ArgoCD).
- **Traefik lives in the infra repo**, not the services.
- Some enforcement (e.g. metrics-only API keys, CORS) may live in the **Qdrant
  engine** (the database itself), which is **outside** the cloud repos — note
  when a ticket isn't fully contained in the candidate set.

## UI design-effort classification (reuse vs. new design)

While you're in the UI repo, classify each UI ticket as Extrapolable / Partial /
New design (see `design-link-hunt.md`). Concretely, for an extrapolable ticket
cite the existing component/pattern (e.g. a confirm-by-name dialog component) so
the card can say "reuse this, no new Figma" instead of "design missing".

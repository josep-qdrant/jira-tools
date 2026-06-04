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

## Build a repo map (per run)

There's no built-in repo map — discover it for the codebase you're auditing.
Produce a small table once and reuse it across the batch:

| Repo | Language | Scope |
|------|----------|-------|
| `<repo>` | `<lang from go.mod/package.json/pyproject.toml>` | `<what it owns, from its README>` |

How to populate it cheaply:

1. List the repos under the projects root (ask the user for the path if you
   don't have it).
2. For each, read the `README` (scope) and detect the real language from the
   build file — **the repo name can lie about the language**, so verify.
3. Note a few **proven search terms** for the domain (feature nouns that recur
   in tickets) so later sweeps are fast and targeted.

> **If you keep a local environment reference** (a `*.local.md` file with your
> real repo map, paths, proven search terms, and domain caveats), use it instead
> of rebuilding the map every run — but keep that file out of the skill so the
> skill stays project-agnostic. Watch for repos that are easy to mis-scope:
> a service whose name implies one language but is written in another, infra
> code that lives in a separate repo from the services, or enforcement that
> lives outside the candidate set entirely (e.g. in an upstream engine). Note
> when a ticket isn't fully contained in the repos you can see.

## UI design-effort classification (reuse vs. new design)

While you're in the UI repo, classify each UI ticket as Extrapolable / Partial /
New design (see `design-link-hunt.md`). Concretely, for an extrapolable ticket
cite the existing component/pattern (e.g. a confirm-by-name dialog component) so
the card can say "reuse this, no new Figma" instead of "design missing".

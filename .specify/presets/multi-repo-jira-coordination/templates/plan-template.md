# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Jira Reference**: [PROJ-1234](url) — read-only; status/priority/stakeholders live in Jira, the actual plan lives here.

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.

  Most features here are a flow across more than one repo/language, not a
  single-repo change — fill one row per repo this feature touches. A
  genuinely single-repo feature gets a one-row table.
-->

| Repo | Language/Version | Primary Dependencies | Storage | Testing | Target Platform |
|------|--------------------|------------------------|---------|---------|------------------|
| [repo-name or NEEDS CLARIFICATION] | [e.g. Go 1.22, TypeScript 5, Python 3.11] | [e.g. FastAPI, UIKit, LLVM or NEEDS CLARIFICATION] | [if applicable, e.g. PostgreSQL, files, or N/A] | [e.g. go test, pytest, vitest or NEEDS CLARIFICATION] | [e.g. k8s, browser, CLI or NEEDS CLARIFICATION] |

**Project Type**: [e.g. multi-repo flow: API + console + operator, or single-repo CLI, or NEEDS CLARIFICATION]

**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]

**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]

**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Cross-Repo Concordance

<!--
  ACTION REQUIRED: Skip this section only if Technical Context above has a
  single repo row. Otherwise every contract shared between repos needs a
  named source of truth and the repos need a stated ship order — "build it in
  each repo and hope they match" is not a plan.
-->

**Shared contracts**: [List every contract more than one repo depends on — API schema, proto, generated client types, config keys, feature flags — and which repo is the source of truth for each. e.g. "Response shape defined in repo-a's OpenAPI spec; repo-b's generated client must match before repo-b ships."]

**Sequencing**: [Which repo must merge/deploy first, which can ship independently behind a flag, and which steps require a coordinated release across repos]

**Drift check**: [How you'll know if a repo has fallen out of concordance with the others, e.g. "contract test in repo-b's CI against repo-a's published schema"]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file]

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]

# [REMOVE IF UNUSED] Option 4: Multi-repo flow (independent repos checked out as siblings)
$REPOS_ROOT/                 # see project-local env config for the real root
├── [repo-a]/                # [role, e.g. API contract owner]
│   └── [paths this feature touches]
├── [repo-b]/                # [role, e.g. console / UI]
│   └── [paths this feature touches]
└── [repo-c]/                # [role, e.g. operator / infra]
    └── [paths this feature touches]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

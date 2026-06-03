---
name: gh-cli
description: >-
  Use the GitHub CLI (gh) to fetch PRs, issues, and file contents from GitHub
  URLs found in Jira tickets, Notion docs, or Slack threads during an audit.
  Use whenever a github.com link appears during the five-place design hunt or
  the recursive linked-ticket context step (Step 3c of jira-ticket-audit).
  Read-only: never creates, edits, or comments on GitHub resources.
---

# GitHub CLI (gh) — read-only audit usage

When the design hunt or linked-ticket recursion surfaces a `github.com` URL,
use the **`gh` CLI** (via Bash) to read its content. This is read-only: you
fetch PRs and issues to extract spec details, design links, or scope context
— you never create, edit, or comment.

## Prerequisites

`gh` must be installed and authenticated:

```bash
brew install gh   # macOS
gh auth login     # follow the browser prompt; choose HTTPS + token
```

Verify: `gh auth status` — should show your account and the active token.

## Parsing GitHub URLs

Before calling `gh`, extract `owner`, `repo`, and the number from the URL:

| URL pattern | owner | repo | number |
|-------------|-------|------|--------|
| `https://github.com/qdrant/qdrant-cloud/pull/123` | `qdrant` | `qdrant-cloud` | `123` |
| `https://github.com/qdrant/qdrant/issues/456` | `qdrant` | `qdrant` | `456` |

## Fetching a pull request

```bash
gh pr view 123 \
  --repo qdrant/qdrant-cloud \
  --json number,title,state,body,url,labels,linkedIssues,files \
  | jq '{number,title,state,url,body: .body[0:2000],labels: [.labels[].name]}'
```

Extract from the output:
- **title** and **state** (open / merged / closed)
- **body** — look for Figma links, Notion links, spec descriptions
- **labels** — often indicate scope (frontend, backend, design-needed…)
- **linkedIssues** — cross-reference to Jira keys or other GH issues

## Fetching an issue

```bash
gh issue view 456 \
  --repo qdrant/qdrant \
  --json number,title,state,body,url,labels \
  | jq '{number,title,state,url,body: .body[0:2000],labels: [.labels[].name]}'
```

## Searching for a Jira key in a repo

When you know a Jira key (e.g. `PM-207`) and want to find related PRs:

```bash
gh search prs "PM-207" \
  --repo qdrant/qdrant-cloud \
  --state all \
  --json number,title,state,url \
  | jq '.[:5]'
```

Limit results and repos — broad searches are slow and noisy.

## What to extract for the audit card

Record in the `## Linked-ticket context` or the design-hunt section:

| Field | What to record |
|-------|---------------|
| PR/issue title | verbatim |
| State | open / merged / closed |
| URL | markdown link |
| Body Figma links | any `figma.com` URL found in body |
| Body Notion links | any `notion.so` URL found in body — follow with Step 3b |
| Scope signals | labels, linked issues, brief summary of intent |

If the PR body contains a Figma link → that counts as a **found design**;
credit it to the parent Jira ticket's card and set `design_linked: true`.

## Gotchas

- **`gh` requires auth.** If `gh auth status` fails, the agent cannot read
  GitHub — note it as "GitHub link found but gh not authenticated" in the card.
- **Body length.** Truncate body to 2000 chars in the jq filter to avoid
  flooding context. If a Figma/Notion URL seems to be past the cutoff, increase
  the limit for that specific call.
- **Private repos.** The token used by `gh auth login` must have read access
  to the repo. If the fetch fails with 404 or 403, note "private repo or no
  access" in the card.
- **Rate limits.** `gh` inherits GitHub API rate limits. Keep searches
  targeted — one repo, one query at a time.
- **Don't recurse GH→GH.** If a PR's body links to another PR, record the
  link but don't chase it. One hop from the Jira ticket.

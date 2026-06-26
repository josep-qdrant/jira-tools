---
name: obsidian-vault
description: >-
  Output conventions for every Jira-audit deliverable written to disk — audit
  cards, synthesis docs, DoR blocks, ticket dossiers, scoping notes. Use
  whenever you write markdown into the working folder. Defines the YAML
  frontmatter, wikilinks, controlled tags, table escaping, and Obsidian
  callouts so deliverables open cleanly as an Obsidian vault. Read-only on
  Jira is unaffected — this is purely how files on disk are formatted.
---

# Output format — Obsidian vault

Every deliverable written to the working folder is **Obsidian-native markdown**.
This is the single source of truth for those conventions; the audit, synthesis,
scoping, and DoR skills all defer here.

## Conventions

- Every deliverable starts with YAML frontmatter and `tags:`.
- Internal deliverable links use wikilinks: `[[PM-207-slug|PM-207]]`.
- Ticket keys in prose become wikilinks.
- External URLs stay markdown links.
- In markdown tables, escape wikilink aliases: `[[PM-207-slug\|PM-207]]`.
- Cards use aliases in frontmatter, e.g. `aliases: ["PM-207"]`.
- Use controlled tags only: `backlog-audit`, `ticket` / `synthesis`, project key,
  and `readiness/ready`, `readiness/almost-ready`, `readiness/not-ready`.
- Use Obsidian callouts for verdicts / alerts:
  - `> [!info]` read-only note
  - `> [!success]` ready
  - `> [!warning]` almost ready, estimate risk, hidden scope
  - `> [!danger]` not ready
  - `> [!note]` canonical / source-of-truth pointer

## Schemas and templates

- Ticket cards: `../jira-ticket-audit/assets/audit-card-template.md`
- Synthesis docs: `../jira-backlog-synthesis/references/synthesis-docs.md`
- Actions audit: `../jira-backlog-synthesis/assets/actions-audit-template.md`
- DoR block: `../definition-of-ready/assets/dor-block-template.md`

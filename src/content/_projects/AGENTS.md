<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-15 | Updated: 2026-05-15 -->

# _projects

## Purpose
Project cards — one file per upstream project. A card introduces the project, links to its source repo / official site, lists the translated wiki pages, and assigns it to a domain. URL: `/projects/<slug>`.

## File template

```markdown
---
project: react
name: React                       # display name
summary: UI library for ...       # one-line description
domain: frontend                  # REQUIRED; must match an id in _meta/domains.yml
source_repo: <repo URL>
official_site: <site URL>
last_ingest: YYYY-MM-DD
---

# React

(one-paragraph introduction)

## 번역된 페이지
- [[wiki/<project>/<path>]] — 한국어 제목

## 번역 안 한 부분 (선택)
- (deliberately skipped areas and the reason)
```

## Current entries
`pnpm.md`. (Verify against `ls _projects/`.)

## For AI Agents

### Working In This Directory
- **`domain` field is REQUIRED** and must match an id in `../_meta/domains.yml`. If the project is for a domain that doesn't exist yet, propose the new domain to the user, get approval, then add it to BOTH `_meta/domains.yml` and `../../app/services/domain.service.ts`.
- **Refresh `last_ingest`** on every translation push to that project. `lint` flags mismatches between `last_ingest` and the actual newest body in the project.
- **The "번역된 페이지" list is maintained per ingest.** When a new body is added under `_wiki/<project>/`, append it here with its Korean title.
- **The "번역 안 한 부분" section is optional** — used when an upstream doc has whole sections deliberately skipped (e.g., legacy migration guides). Record the *reason*, not just the omission.
- **Wikilink resolver looks up `name` field** as the link text — `[[_projects/pnpm]]` renders as `<a href="/projects/pnpm">pnpm</a>` if `name: pnpm` is set.
- The project's body card itself can use wikilinks freely.

### Common Patterns
- Filename slug matches the `project:` frontmatter field, kebab-case.
- One paragraph intro — keep it concise; detail goes in the bodies.

## Dependencies

### Internal
- Linked from `_meta/index.md` and bodies via `[[_projects/<slug>]]`.
- Walked by `../../lib/build-lookups.ts` to build `projectLookup`.
- Read by `../../app/pages/projects/[slug].page.ts` (per-project card view), `../../app/components/doc-nav/`, `../../app/pages/domains/[id].page.ts`, `../../app/services/domain.service.ts`.
- `domain` field validated against `../_meta/domains.yml`.

<!-- MANUAL: -->

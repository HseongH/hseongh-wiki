<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-15 | Updated: 2026-05-15 -->

# content

## Purpose
**The markdown content store.** Everything under here is consumed at build time by `@analogjs/content`, made available to components via `injectContentFiles()` (frontmatter only) and `injectContentFilesMap()` (lazy body loader). Also walked by `src/lib/build-lookups.ts` to populate the wikilink resolver and the `virtual:wiki-titles` module.

The directory tree mirrors the wiki concept: bodies live under `_wiki/<project>/`, glossary terms under `_glossary/`, project cards under `_projects/`, and meta artefacts (index, log, style guide, domain catalog) under `_meta/`.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `_wiki/` | Body pages — faithful Korean translations of upstream docs, organised per project (see `_wiki/AGENTS.md`). Public URL: `/wiki/<project>/<path>`. |
| `_glossary/` | Glossary entries — one file per term (see `_glossary/AGENTS.md`). Public URL: `/glossary/<term>`. |
| `_projects/` | Project cards — one file per project (see `_projects/AGENTS.md`). Public URL: `/projects/<project>`. |
| `_meta/` | Meta-files: `STYLE.md`, `domains.yml`, `index.md`, `log.md` (see `_meta/AGENTS.md`). Not directly user-facing. |

## For AI Agents

### Working In This Directory — CRITICAL RULES
- **Always read `_meta/STYLE.md` before writing or editing any body.** It is the single source of truth for register (격식체), term decisions, and wikilink notation. If a new term is needed mid-task, update STYLE.md *first*, then the body.
- **Faithful-translation rule is hard.** Body pages (`_wiki/`) preserve the upstream structure verbatim: no translator's notes, no reorganisation, no paraphrasing. Commentary belongs in chat, not in the body.
- **Wikilink notation is `[[wiki/<project>/<path>]]`, `[[_glossary/<term>]]`, `[[_projects/<project>]]`** — repo-root-relative, the same on every page. The `marked-wikilink` extension (`src/lib/marked-wikilink.ts`) rewrites these at build time.
- **A single ingest touches 5–10 files**: a new body, possibly new glossary entries, the project card's "번역된 페이지" list, `_meta/index.md`, `_meta/log.md` (always append an entry), and possibly `_meta/STYLE.md` (for new term decisions) and `_meta/domains.yml` (for new domains). Do them all in one pass — leaving any out will be caught by `lint`.
- **AnalogJS auto-routes every `src/content/**/*.md` file.** That's why bodies live under `_wiki/` (underscore prefix): the auto-route is `/_wiki/...` instead of `/wiki/...`, leaving `/wiki/[...path]` free as the public route handled by `src/app/pages/wiki/`. Do not rename `_wiki/` to `wiki/` — routing collides.
- **The build-lookups walker walks `_wiki/` recursively** — nested subdirectories are fine and are what the catch-all `/wiki/[...path]` was built to render.

### Page templates
See root `CLAUDE.md` ("Page templates" section) for exact frontmatter shapes for body / glossary / project pages.

### Common Patterns
- Filenames are lowercase, kebab-case, `.md` suffix.
- Frontmatter is YAML between `---` fences. Required fields per kind differ — read the templates.
- Wiki body pages typically end with a "관련 페이지" list of `[[...]]` links to glossary terms and adjacent body pages.

## Dependencies

### Internal
- Walked by `../lib/build-lookups.ts` at Vite startup.
- Read at runtime via `@analogjs/content` `injectContentFiles()` from `../app/pages/`, `../app/components/`, `../app/services/`.
- Wikilinks rewritten by `../lib/marked-wikilink.ts`.

### External
- `@analogjs/content` — markdown loader pipeline.
- `marked` + `shiki` + `marked-shiki` — rendering.
- `gray-matter` — frontmatter parsing (in `../lib/build-lookups.ts`).

<!-- MANUAL: -->

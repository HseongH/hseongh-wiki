<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-15 | Updated: 2026-05-15 -->

# _wiki

## Purpose
**Body pages** — faithful Korean translations of upstream docs, organised one subdirectory per project. The directory tree under here is allowed to mirror the upstream repo's structure (nested folders are fine). The catch-all route `/wiki/[...path]` resolves to files here.

The underscore prefix (`_wiki/` instead of `wiki/`) exists **only to dodge AnalogJS's auto-routing**: AnalogJS would otherwise generate a `/wiki/...` route per body file, colliding with `src/app/pages/wiki/[...path].page.ts`. The auto-route at `/_wiki/...` is an artefact and not meant to be browsed.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `pnpm/` | pnpm.io official docs translations (see `pnpm/AGENTS.md`) |

## For AI Agents

### Working In This Directory — CRITICAL RULES
- **Read `../_meta/STYLE.md` before writing any body.** Register, terminology, code-block rules, external-link handling — all binding.
- **Faithful translation only.** No translator's notes, no reorganisation, no paraphrasing inside the body. Preserve heading structure, paragraph order, code-example position, image position, and emphasis (bold/italic) exactly as upstream.
- **Frontmatter is required**:
  ```yaml
  ---
  source: <upstream URL>
  source_commit: <upstream GitHub commit hash>
  translated_at: YYYY-MM-DD
  project: <project-slug>
  tags: [...]
  ---
  ```
  `source_commit` is what `lint` uses to detect out-of-sync bodies.
- **Body must start with `# 한국어 제목`** — `src/lib/build-lookups.ts` reads this for the title lookup. After the H1 a parenthesised original title (`*(원제: Original Title)*`) is conventional.
- **Body must include a meta line** under the H1: `> 원문: <link> · 동기화: YYYY-MM-DD / <commit>`.
- **End with a "관련 페이지" list** of `[[...]]` wikilinks to glossary terms and adjacent body pages.

### Wikilink rules (per `CLAUDE.md`)
- `[[wiki/<project>/<path>]]` — repo-root-relative full path to another body.
- `[[_glossary/<term>]]`, `[[_projects/<project>]]` — meta references.

### Relative-link conversion (per `_meta/STYLE.md`)
- Upstream relative links: drop the `.md` (e.g., `./workspaces.md` → `./workspaces`).
- Upstream `/img/...` references: rewrite to absolute upstream URL (e.g., `/img/foo.svg` → `https://pnpm.io/img/foo.svg`). Translate alt text.
- Docusaurus admonitions (`:::tip`, `:::warning`, etc.) → keep verbatim. A future marked plugin will style them.

### Common Patterns
- One file per upstream page. Subdirectories mirror upstream structure (`pnpm/installation.md`, `pnpm/pnpm-cli.md`, …).
- `_wiki/<project>/index.md` is allowed for project landing pages (the wiki renderer in `[...path].page.ts` falls back to `<target>/index.md` if `<target>.md` is missing).

## Dependencies

### Internal
- Rendered by `../../app/pages/wiki/[...path].page.ts` (catch-all route).
- Listed by `../../app/pages/(home).page.ts` (most recent), `../../app/components/doc-nav/`, `../../app/pages/domains/[id].page.ts`, `../../app/pages/projects/[slug].page.ts`.
- Walked recursively by `../../lib/build-lookups.ts` to build `wikiLookup` (title from first `# heading`).
- Wikilinks rewritten by `../../lib/marked-wikilink.ts`.

<!-- MANUAL: -->

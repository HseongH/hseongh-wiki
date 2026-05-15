<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-15 | Updated: 2026-05-15 -->

# lib

## Purpose
Build-time and runtime utilities. Four areas: (1) the **wikilink resolver** that rewrites `[[target]]` at build time, (2) the **content-path helpers** that paper over AnalogJS's leading-slash inconsistency between `injectContentFiles()` and `injectContentFilesMap()`, (3) **Shiki / virtual-module plumbing** for the markdown pipeline, and (4) **markdown-body helpers** shared by the dynamic-route pages.

## Key Files

| File | Description |
|------|-------------|
| `build-lookups.ts` | Walks `src/content/_glossary/`, `_projects/`, `_wiki/` at startup and parses `_meta/domains.yml` (via `js-yaml`); returns `{ glossaryLookup, projectLookup, wikiLookup, domains }`. The wiki lookup pulls the page title from the first `# heading` of the markdown body. Pure Node FS — runs in the Vite config and also feeds the prerender route list. |
| `build-lookups.test.ts` | Vitest tests for the scanner. |
| `marked-wikilink.ts` | **The wikilink extension** for `marked`. Wired into AnalogJS's content options as `markedOptions.extensions: [wikilinkExtension(lookups)]`. Rewrites `[[_glossary/x]]`, `[[_projects/x]]`, `[[wiki/x]]` to `<a href="/...">Korean title</a>`. Unknown targets fall back to `/<target>` with raw target as link text. |
| `markdown-body.ts` | Helpers for the body-loading pattern shared by `wiki/[...path]`, `projects/[slug]`, `glossary/[term]` pages. Exports: `stripFrontmatter` (drop `---\n…\n---\n\n` AnalogJS leaves in front of HTML), `stripDuplicateH1` (drop body's first `<h1>` when the page chrome already renders one), `loadMarkdownBody(entrySignal, filesMap)` (reactive readonly signal — looks up the lazy loader, calls it, strips frontmatter, handles navigation-race cancellation). Must be called inside an injection context. |
| `content-paths.ts` | The **normalisation helpers** that paper over `injectContentFiles()` filenames (no leading `/`) vs `injectContentFilesMap()` keys (with leading `/`). Exports: `normalizeContentFilename`, `wikiPathFromFilename`, `wikiHrefFromFilename`, `isUnder`. Use these everywhere — a literal `f.filename.startsWith('/src/content/...')` filter silently returns 0 results. |
| `content-paths.test.ts` | Vitest tests for path helpers. |
| `shiki-config.ts` | Shiki options for AnalogJS — dual theme (github-light + github-dark), CSS variable emission via `defaultColor: false` (toggles via `html.dark` class), explicit language list, `sh`/`text`/`txt` aliases. Consumed in `vite.config.ts` as `content.shikiOptions`. |
| `wiki-titles-plugin.ts` | Vite plugin exposing the build-time `wikiLookup` / `projectLookup` / `glossaryLookup` / `domains` to client code as the virtual module `virtual:wiki-titles`. Invalidates on any `src/content/**/*.{md,yml,yaml}` change and triggers a full HMR reload. Type declarations live in `src/types/virtual.d.ts`. |

## For AI Agents

### Working In This Directory
- **The markdown pipeline is `marked`.** Edit `marked-wikilink.ts` to change wikilink behaviour. (An older remark-based reference implementation was removed — see git history if you need the AST-visitor form.)
- **`buildLookups()` is called at Vite config load (`vite.config.ts` line ~13).** It runs in Node, walks the FS synchronously. Don't add async work here or the Vite config breaks. The output also drives the `prerender.routes` list — every page slug becomes a static HTML at build.
- **Don't re-roll the body-loading pattern in pages.** Use `loadMarkdownBody(entry, filesMap)` + `stripDuplicateH1` from `markdown-body.ts`. Race-cancellation, frontmatter stripping, and effect lifecycle are already handled.
- **Title resolution rule**: `wikiLookup[path].title` comes from the first `# heading` of the body file (`/^#\s+(.+)$/m`). If a body has no `# heading`, falls back to the frontmatter `project` value, then the relative path. Body templates always lead with `# 한국어 제목` per `CLAUDE.md`, so the heading match should always hit.
- **HMR**: `wiki-titles-plugin.ts` invalidates and triggers a full reload on any `src/content/**/*.md` change. If you change the lookup shape, also update the declarations in `src/types/virtual.d.ts` so the client-side import compiles.

### Testing Requirements
- `pnpm test:unit` runs all three test files here. The `content-paths` and `build-lookups` tests should pass before any change to the markdown pipeline is committed.

### Common Patterns
- ESM `import` paths use file extensions where TS does not (`fileURLToPath(import.meta.url)` to compute `__dirname` in `build-lookups.ts`).
- Pure functions — no class wrappers around the resolver.
- Shape of lookups: `Record<string, { korean | name | title: string }>`.

## Dependencies

### Internal
- Consumed by `vite.config.ts` (`wikilinkExtension(lookups)`, `shikiOptions`, `wikiTitlesPlugin()`).
- `virtual:wiki-titles` consumed by `src/app/components/doc-nav/`, `src/app/pages/(home).page.ts`, `src/app/pages/domains/[id].page.ts`, `src/app/pages/projects/[slug].page.ts`.
- Helpers in `content-paths.ts` consumed throughout `src/app/`.

### External
- `marked@^15`
- `shiki@^1.29`, `@shikijs/rehype`
- `gray-matter`, `front-matter` — frontmatter parsing
- `js-yaml` — `domains.yml` parsing in `build-lookups.ts`
- Node built-ins: `fs`, `path`, `url`

<!-- MANUAL: -->

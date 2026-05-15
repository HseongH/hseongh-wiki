<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-15 | Updated: 2026-05-15 -->

# pages

## Purpose
**File-based routes** consumed by `provideFileRouter()` from `@analogjs/router`. Every `*.page.ts` file becomes a route; directory names become URL segments; `(name).page.ts` is a layout-route marker that does not contribute to the URL; `[param].page.ts` is a dynamic segment; `[...rest].page.ts` is a catch-all.

## Key Files

| File | Route | Description |
|------|-------|-------------|
| `(home).page.ts` | `/` | Landing page. Lists the 12 most recently translated wiki bodies as `PostCard`s, sorted by `translated_at`. Includes `DocNavComponent` sidebar. |
| `about.page.ts` | `/about` | Static about page — Korean intro + GitHub link. |

## Subdirectories

| Directory | Route | Purpose |
|-----------|-------|---------|
| `wiki/` | `/wiki/<...>` | Catch-all wiki body page (`[...path].page.ts`) — renders one translated body. |
| `projects/` | `/projects` and `/projects/:slug` | `(index).page.ts` (project grid) + `[slug].page.ts` (single project card + its pages). |
| `domains/` | `/domains/:id` | Per-domain index (`[id].page.ts`) — projects + bodies belonging to a domain. |
| `glossary/` | `/glossary` and `/glossary/:term` | `(index).page.ts` (term list) + `[term].page.ts` (single term entry). |

## For AI Agents

### Working In This Directory
- **Adding a route**: drop a new `*.page.ts` — AnalogJS picks it up. Default export must be the component class.
- **Catch-all routes (`[...path].page.ts`) compile to Angular's `**` wildcard, and `**` does NOT expose matched segments on the activated route.** Both `ActivatedRoute.url` and `route.snapshot.url` are empty arrays. Inject `Router`, read `router.url` (full URL like `/wiki/pnpm/motivation`), and strip the route prefix yourself. Make it reactive via `router.events.pipe(filter(e => e instanceof NavigationEnd))` — the catch-all component is **reused** across navigations, so `ngOnInit` only fires once. See `wiki/[...path].page.ts` for the canonical pattern.
- **`injectContent({ customFilename })` does NOT accept a function.** For dynamic routes use `injectContentFiles(filter)` + `injectContentFilesMap()` (body loader) wired through `effect()` from `toSignal(route.paramMap)` or from the Router-URL parsing above.
- **`injectContentFiles()` returns frontmatter only** — `ContentFile.content` is `undefined` at runtime even though typed `string | object`. The body lives in the `injectContentFilesMap()` lazy loaders. **Use `loadMarkdownBody(entry, filesMap)` from `src/lib/markdown-body.ts`** — it does the loader lookup, frontmatter stripping, and effect-with-cancellation pattern in one call. Pair with `stripDuplicateH1` if the page chrome already renders an `<h1>` (wiki/projects/glossary all do).
- **Filename leading-slash mismatch**: `injectContentFiles()` filenames are `src/content/...` (no leading `/`), while `injectContentFilesMap()` keys are `/src/content/...` (with leading `/`). Always use the helpers in `../../lib/content-paths.ts` (`normalizeContentFilename`, `wikiPathFromFilename`, `wikiHrefFromFilename`, `isUnder`). A literal `f.filename.startsWith('/src/content/...')` filter silently returns zero results.
- **Stripping the duplicated H1**: the rendered markdown body's first `<h1>` is duplicated by the page-level `<h1>{{ title() }}</h1>`. `stripDuplicateH1()` from `src/lib/markdown-body.ts` drops the leading occurrence — applied consistently in wiki, projects, and glossary pages.
- **Page title for wiki bodies**: use the build-time `wikiTitles[path]?.title` from `virtual:wiki-titles` rather than regex-extracting `<h1>` out of rendered HTML. The lookup is populated by `src/lib/build-lookups.ts` and never wrong.

### Common Patterns
- Default-export the page component class: `export default class HomePage {}`.
- Use `inject(ActivatedRoute)` for `[param]` pages (the param shows up in `paramMap`), and `inject(Router)` for catch-all (`**`) pages.
- Bridge route data to signals via `toSignal(route.paramMap.pipe(map(p => p.get('xxx') ?? '')), { initialValue: '' })`.
- Wrap markdown body loads in an `effect()` with `onCleanup(() => { cancelled = true; })` to avoid races across rapid navigations.

## Dependencies

### Internal
- `../components/*` — `DocNavComponent`, `PostCardComponent`, `BadgeComponent`
- `../services/domain.service.ts`
- `../../lib/content-paths.ts`
- `virtual:wiki-titles`

### External
- `@analogjs/router` (file routing)
- `@analogjs/content` (`injectContentFiles`, `injectContentFilesMap`, `MarkdownComponent`)
- `@angular/router` (`ActivatedRoute`, `Router`, `RouterLink`, `NavigationEnd`)
- `rxjs` (`filter`, `map`, `startWith`)

<!-- MANUAL: -->

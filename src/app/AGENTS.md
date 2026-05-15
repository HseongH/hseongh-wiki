<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-15 | Updated: 2026-05-15 -->

# app

## Purpose
The Angular application shell — root component, app-level config (client + server), and the three structural layers: **pages** (file-based routes), **components** (shared UI), **services** (DI singletons for theme, domain catalog).

## Key Files

| File | Description |
|------|-------------|
| `app.ts` | Root standalone component (`<app-root>`). Composes `HeaderComponent` + `<router-outlet>` + `FooterComponent`. Constructor calls `ThemeService.init()` once at boot. |
| `app.html` | Root template — `<app-header />`, `<main><router-outlet /></main>`, `<app-footer />`. |
| `app.css` | Empty placeholder (kept so `styleUrl` resolves). |
| `app.config.ts` | Client `ApplicationConfig`. Providers: `provideBrowserGlobalErrorListeners()`, `provideFileRouter(withInMemoryScrolling(...))`, `provideContent(withMarkdownRenderer())`. In-memory scrolling enables anchor scrolling + scroll position restoration. |
| `app.config.server.ts` | Server config — merges `appConfig` with `provideServerRendering()`. Currently unused (SSR off). |
| `app.spec.ts` | Vitest test for root component. |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `pages/` | File-based AnalogJS routes (`(home).page.ts`, `wiki/[...path].page.ts`, etc.) (see `pages/AGENTS.md`) |
| `components/` | Reusable UI components — header, footer, doc-nav, badge, post-card, theme-toggle, TOC, domain-sidebar (see `components/AGENTS.md`) |
| `services/` | DI-scoped services: `ThemeService`, `DomainService` (see `services/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Every component is **`standalone: true`** with explicit `imports: [...]`. There are no NgModules in this codebase.
- Use `inject()` for DI in everything except the root `App` (which uses constructor injection only because it needs to call `theme.init()` immediately).
- The root layout is fixed: header → main(router-outlet) → footer. Page templates do their own internal grid (typically `grid-cols-[14rem_1fr]` for sidebar + content).
- New top-level pages: just drop a `*.page.ts` under `pages/` — AnalogJS picks it up automatically.

### Testing Requirements
- Component specs live next to the component (`*.spec.ts`). Use `setupTestBed()` from `@analogjs/vitest-angular` (already wired in `src/test-setup.ts`).

### Common Patterns
- **Template-only components** for layout/header/footer (no logic) — declare via `template:` string.
- **`signal` for state, `computed` for derived state.** RxJS only when a stream source (router events) requires it; bridge to signals via `toSignal()`.
- **Tailwind v4 utility classes inline**, with the design tokens (`headline-xl`, `body-md`, `label-md`) defined in `src/styles/`.

## Dependencies

### Internal
- `../content/` — read at build time via `@analogjs/content` injectors.
- `../lib/content-paths.ts` — normalise filename paths from `injectContentFiles` vs `injectContentFilesMap`.
- `../lib/build-lookups.ts` (indirectly via `virtual:wiki-titles`) — Korean titles for the doc-nav sidebar.
- `../styles/global.css` — imported once from `src/main.ts`.

### External
- `@angular/core@^21.2`, `@angular/router@^21.2`, `@angular/platform-browser@^21.2`
- `@analogjs/router`, `@analogjs/content`
- `rxjs@~7.8` (for router events → signal bridging)

<!-- MANUAL: -->

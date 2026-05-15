<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-15 | Updated: 2026-05-15 -->

# src

## Purpose
All application source: the Angular 21 + AnalogJS app shell, the markdown content store (read at build time), shared lib utilities (marked plugins, wikilink resolver, build-time lookups), styles, and a stub server folder (unused while SSR is off).

## Key Files

| File | Description |
|------|-------------|
| `main.ts` | Client bootstrap. **Imports `./styles/global.css`** — this is how Tailwind enters the page (AnalogJS uses Vite and does NOT read `angular.json`'s `styles` array). |
| `main.server.ts` | Server bootstrap. Wraps `App` with `@analogjs/router/server`. Currently unused (SSR off). |
| `test-setup.ts` | Vitest setup file — calls `setupTestBed()` from `@analogjs/vitest-angular`. |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `app/` | Angular app — components, pages, services, app shell (see `app/AGENTS.md`) |
| `content/` | Markdown content store consumed at build time by `@analogjs/content` (see `content/AGENTS.md`) |
| `lib/` | Build-time and runtime utilities — marked plugins, wikilink resolver, content path helpers, Shiki config (see `lib/AGENTS.md`) |
| `styles/` | Tailwind v4 entry + design tokens (see `styles/AGENTS.md`) |
| `types/` | Ambient TypeScript declarations for virtual modules (see `types/AGENTS.md`) |
| `server/` | Server route stubs — unused while SSR is off (see `server/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- **`main.ts` MUST import `./styles/global.css`.** If you remove that import, Tailwind silently disappears in production — `angular.json`'s `styles` array is ignored by the AnalogJS Vite builder.
- The app is a **pure SPA** today. Any code that touches `window`/`document`/`localStorage` is safe at runtime (no SSR), but if SSR is ever enabled it'll break — guard with `isPlatformBrowser` if you anticipate that change.
- Content lives under `content/` and is consumed via `@analogjs/content` injectors (`injectContentFiles`, `injectContentFilesMap`). See `lib/AGENTS.md` for the path normalisation helpers — there are real gotchas around leading-slash inconsistency.

### Testing Requirements
- `pnpm test:unit` runs vitest across `**/*.spec.ts` and `**/*.test.ts` under `src/`.
- jsdom is the test environment.

### Common Patterns
- Standalone components only — no NgModules.
- Signals (`signal`, `computed`, `effect`, `toSignal`) over RxJS where signals fit.
- Inject via `inject()` function, not constructor parameters (except where lifecycle requires it, e.g. `App`).

<!-- MANUAL: -->

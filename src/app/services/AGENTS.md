<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-15 | Updated: 2026-05-15 -->

# services

## Purpose
Root-scoped Angular services. Currently two: `ThemeService` (light/dark toggle with localStorage persistence) and `DomainService` (domain catalog + translated-page counts).

## Key Files

| File | Description |
|------|-------------|
| `theme.service.ts` | `@Injectable({ providedIn: 'root' })`. Exposes `theme` (signal<'light' \| 'dark'>), `init()`, `setTheme()`, `toggle()`. Persists to `localStorage['theme']`; falls back to `prefers-color-scheme`. Toggles `html.dark` class — Tailwind v4 dark mode hooks off that. **`isPlatformBrowser(PLATFORM_ID)` guard** wraps every `localStorage` / `window` / `document` access, so it's safe under SSR / prerender (the bootstrap server pass becomes a no-op). `App.constructor` calls `init()` once. |
| `theme.service.spec.ts` | Vitest tests for theme persistence + system preference fallback. |
| `domain.service.ts` | Domain catalog + project/page counts. **Imports `domains` from `virtual:wiki-titles`** — single source of truth is `src/content/_meta/domains.yml`, parsed at build time by `src/lib/build-lookups.ts`. Reads `_projects/` and `_wiki/` content via `injectContentFiles` at construction. `listDomains()` returns `Array<DomainEntry & { count: number }>`. |

## For AI Agents

### Working In This Directory
- **Adding a domain: edit `src/content/_meta/domains.yml` only.** `DomainService` reads it through `virtual:wiki-titles` (`domains` export) which `src/lib/build-lookups.ts` populates by `yamlLoad`-ing the file at Vite startup. HMR invalidates on `.yml` changes too.
- `ThemeService` is **already SSR-safe** via `isPlatformBrowser` guards. When adding any browser-only side effect to a new service, copy the same pattern: inject `PLATFORM_ID`, capture `isPlatformBrowser(...)` once, guard each access.
- New services should follow the same `providedIn: 'root'` standalone pattern — no NgModules, no service barrels.

### Testing Requirements
- `theme.service.spec.ts` is the reference for service tests. Use jsdom (already configured in `vite.config.ts`).

### Common Patterns
- `@Injectable({ providedIn: 'root' })` — singletons.
- Public state via `readonly signal<T>(...)`; methods mutate via `.set()` / `.update()`.
- `injectContentFiles<Attrs>(filter)` directly at the property initializer when content data is needed — `@Injectable` services are constructed in the DI context, so this works.

## Dependencies

### Internal
- `../../lib/content-paths.ts` — `isUnder` filter helper.
- `../../content/_meta/domains.yml` — the **single source of truth** for the domain catalog (loaded via `virtual:wiki-titles`).
- `virtual:wiki-titles` (`domains` export) — populated by `../../lib/wiki-titles-plugin.ts` + `../../lib/build-lookups.ts`.

### External
- `@angular/core` (`Injectable`, `inject`, `PLATFORM_ID`, `signal`)
- `@angular/common` (`isPlatformBrowser`)
- `@analogjs/content` (`injectContentFiles`)

<!-- MANUAL: -->

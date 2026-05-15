<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-15 | Updated: 2026-05-15 -->

# services

## Purpose
Root-scoped Angular services. Currently two: `ThemeService` (light/dark toggle with localStorage persistence) and `DomainService` (domain catalog + translated-page counts).

## Key Files

| File | Description |
|------|-------------|
| `theme.service.ts` | `@Injectable({ providedIn: 'root' })`. Exposes `theme` (signal<'light' \| 'dark'>), `init()`, `setTheme()`, `toggle()`. Persists to `localStorage['theme']`; falls back to `prefers-color-scheme`. Toggles `html.dark` class — Tailwind v4 dark mode hooks off that. `App.constructor` calls `init()` once. |
| `theme.service.spec.ts` | Vitest tests for theme persistence + system preference fallback. |
| `domain.service.ts` | Domain catalog + project/page counts. Reads `_projects/` and `_wiki/` content via `injectContentFiles` at construction. `listDomains()` returns `Array<DomainEntry & { count: number }>`. Domain list is hardcoded — see "TODO" below. |

## For AI Agents

### Working In This Directory
- **Domain catalog is hardcoded** in `domain.service.ts` and mirrors `src/content/_meta/domains.yml`. **Both must be updated together** when adding a new domain. Long-term TODO (noted in source): load via `vite-plugin-yaml` or a build-time generator so `domains.yml` becomes the single source.
- `ThemeService` touches `localStorage`, `window.matchMedia`, and `document.documentElement` at runtime. Safe today because SSR is off. If SSR is ever turned on, gate with `isPlatformBrowser` or call only inside `effect()`.
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
- `../../content/_meta/domains.yml` — the **source of truth** the hardcoded catalog must match.

### External
- `@angular/core` (`Injectable`, `signal`)
- `@analogjs/content` (`injectContentFiles`)

<!-- MANUAL: -->

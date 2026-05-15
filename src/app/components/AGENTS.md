<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-15 | Updated: 2026-05-15 -->

# components

## Purpose
Reusable standalone UI components consumed by `pages/` and `app.ts`. Layout chrome (header/footer), atoms (badge), composite UI (post-card, doc-nav, toc, domain-sidebar), and the theme toggle.

## Subdirectories

| Directory | Files | Purpose |
|-----------|-------|---------|
| `badge/` | `badge.component.ts` | Pill / chip — `variant="primary" \| "neutral"`, `<ng-content>` slot. Used for project labels and tag chips. |
| `header/` | `header.component.ts`, `header.component.spec.ts` | Sticky top bar — site logo (Home), Glossary, About, theme toggle. Uses `routerLink` + `routerLinkActive`. |
| `footer/` | `footer.component.ts` | Bottom copyright + GitHub link. Template-only. |
| `doc-nav/` | `doc-nav.component.ts` | Left sidebar listing every project and its translated wiki pages. Pulls data from `injectContentFiles<ProjectAttrs>` + `injectContentFiles<WikiAttrs>` and Korean titles via `virtual:wiki-titles`. Sticky, scroll-friendly. |
| `post-card/` | `post-card.component.ts`, `post-card.component.spec.ts` | Card preview for a translated wiki page — exports `PostCardData` interface (`title`, `excerpt`, `project`, `translatedAt`, `href`). Wraps in `routerLink`. |
| `theme-toggle/` | `theme-toggle.component.ts` | Sun/moon button — calls `ThemeService.toggle()`. Renders ☀ in dark mode, 🌙 in light. |
| `toc/` | `toc.component.ts` | Right-side table of contents — takes `TocEntry[]` (`level`, `text`, `id`) as required input. Indents by `(level - 2) * 0.75rem`. |
| `domain-sidebar/` | `domain-sidebar.component.ts` | Category sidebar — lists every domain from `DomainService` with translated-page counts. Used on listing pages. |

## For AI Agents

### Working In This Directory
- Each component is one `.ts` file (template inline) — **no separate `.html` / `.css` files**. Stay consistent.
- Inputs use the new **`input()` signal API**: `myProp = input.required<Foo>()` or `input<Foo>(defaultValue)`. Don't use the legacy `@Input()` decorator.
- Components that need data fetch it themselves via `injectContentFiles(...)` rather than receiving it from parent — see `doc-nav` and `domain-sidebar`. The `injectContentFiles` calls are evaluated at class-field-init time, so they happen in the DI context automatically.
- All visual styling is **Tailwind v4 utility classes** plus the typography classes (`headline-xl`, `body-md`, `label-md`) defined in `src/styles/typography.css`.

### Testing Requirements
- Specs sit next to the component (`*.component.spec.ts`). Use `setupTestBed()` from `@analogjs/vitest-angular`.
- Only `header` and `post-card` have specs today; others are template-only and trivial.

### Common Patterns
- **Standalone + inline template + signal inputs.**
- **Korean labels** in templates (`목차`, `문서`, `용어집`) — match the wiki's audience.
- Reactive data: `computed()` over `injectContentFiles()` results to derive sorted/filtered views.
- Active route highlighting: `routerLinkActive="text-primary"` (sometimes with `[routerLinkActiveOptions]="{ exact: true }"` for the Home link).

### Adding a new component
1. Create `<name>/<name>.component.ts` with inline template.
2. Use `standalone: true`, explicit `imports`.
3. Inputs via `input()` / `input.required()`.
4. Import where consumed — no barrel exports.

## Dependencies

### Internal
- `../services/theme.service.ts` — read/toggle theme.
- `../services/domain.service.ts` — domain catalog with translated-page counts.
- `../../lib/content-paths.ts` — `isUnder`, `wikiHrefFromFilename`, `wikiPathFromFilename`.
- `virtual:wiki-titles` (provided by `src/lib/wiki-titles-plugin.ts`) — build-time Korean titles.

### External
- `@angular/core` (signals, `inject`, `input`, `computed`)
- `@angular/router` (`RouterLink`, `RouterLinkActive`)
- `@analogjs/content` (`injectContentFiles`)

<!-- MANUAL: -->

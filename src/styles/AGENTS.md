<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-15 | Updated: 2026-05-15 -->

# styles

## Purpose
Tailwind v4 entry point + design tokens. Tailwind v4 uses a CSS-first config — there is no `tailwind.config.js`. Tokens are CSS variables imported into the Tailwind `@theme` block; dark mode flips by toggling `html.dark` (handled by `ThemeService`).

## Key Files

| File | Description |
|------|-------------|
| `global.css` | The Tailwind entry. Imports `tailwindcss`, `./typography.css`, `./tokens.css`, `./tokens-dark.css`. Defines the `@theme` block mapping CSS variables onto Tailwind colour/font/radius/container tokens. Declares the `.prose` component layer used by markdown bodies. **MUST be imported from `src/main.ts`** — `angular.json`'s `styles` array is ignored by AnalogJS. |
| `tokens.css` | Light-mode design tokens (colours, surface levels, primary container, outline). |
| `tokens-dark.css` | Dark-mode overrides — applied when `html.dark` is set. |
| `typography.css` | Custom utility classes: `headline-xl`, `headline-md`, `body-lg`, `body-md`, `label-md`, etc. Used throughout components. |

## For AI Agents

### Working In This Directory
- **Tailwind v4 — no `tailwind.config.js`.** The vite plugin is `@tailwindcss/vite`. Configuration is the `@theme` block in `global.css`.
- **Dark mode is class-based** (`html.dark`). `ThemeService.setTheme()` toggles that class. CSS variables in `tokens.css` / `tokens-dark.css` re-bind on class flip — no JS theme switching needed.
- **`.prose` is the markdown body class** (`@tailwindcss/typography` plugin + custom overrides). All `<analog-markdown>` components are rendered with `classes="prose ..."`.
- If you add a new typography utility, define it in `typography.css` and use it consistently — don't duplicate the same `font-display text-2xl ...` strings across templates.
- The site shell uses container widths via `max-w-(--container-site)` (1200px) and article body via `max-w-(--container-article)` (720px). Both are CSS variables on `@theme`.

### Common Patterns
- Custom utilities are defined as `@layer components` (e.g. `.prose`).
- Colour utilities expand from CSS variables: `bg-surface`, `text-on-surface-variant`, `bg-primary-container`. New colour aliases go in the `@theme` block.

## Dependencies

### External
- `tailwindcss@^4.3`
- `@tailwindcss/vite` (build integration)
- `@tailwindcss/typography` (`.prose`)
- `@fontsource/{hanken-grotesk,jetbrains-mono,source-serif-4}` for the three font families referenced by `--font-display`, `--font-mono`, `--font-body`.

<!-- MANUAL: -->

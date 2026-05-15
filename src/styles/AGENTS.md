<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-15 | Updated: 2026-05-15 -->

# styles

## Purpose
Tailwind v4 entry point + design tokens implementing the **Intellectual Clarity — Editorial** design system from `design/intellectual_clarity_editorial/DESIGN.md`. Tailwind v4 uses a CSS-first config — there is no `tailwind.config.js`. Tokens are CSS variables imported into the Tailwind `@theme` block; dark mode flips by toggling `html.dark` (handled by `ThemeService`).

## Design system (one-paragraph)
Editorial magazine aesthetic: **Newsreader** (serif) for headlines / brand wordmark, **Inter** (sans) for body, **Hanken Grotesk** (sans) for labels rendered as `uppercase tracking-widest` chips. Palette is deep indigo on paper white (light) with indigo-tinted slates on dark. Cards use `shadow-editorial` (low-opacity indigo shadow). Soft radius (0.125rem default, 0.5rem lg). Source spec: `design/intellectual_clarity_editorial/DESIGN.md`.

## Key Files

| File | Description |
|------|-------------|
| `global.css` | Tailwind entry. Imports `tailwindcss`, `./typography.css`, `./tokens.css`, `./tokens-dark.css`. Defines the `@theme` block mapping CSS variables onto Tailwind colour/font/radius/container/spacing tokens. Declares the `.prose` component layer used by markdown bodies, plus utilities: `.drop-cap`, `.shadow-editorial`. **MUST be imported from `src/main.ts`** — `angular.json`'s `styles` array is ignored by AnalogJS. |
| `tokens.css` | **Light-mode** design tokens — deep indigo primary (`#1a146b`), paper-white surface (`#f9f9ff`), Material-3-style tonal surface layers, primary/secondary/tertiary `*-fixed` ramps for badges, layout / spacing / radius / editorial shadow. |
| `tokens-dark.css` | **Dark-mode** overrides — keeps editorial indigo identity (`inverse_primary = #c3c0ff` becomes `primary`), deepens surface to slate. Applied when `html.dark` is set. |
| `typography.css` | Font `@import`s + size scale utilities. **Newsreader** (display: `headline-xl/lg/md/sm`), **Inter** (body: `body-lg/md`), **Hanken Grotesk** (label: `label-sm` uppercase tracking-widest, `label-md` sentence-case), **JetBrains Mono** (code blocks). Mobile breakpoint clamps headline sizes. |

## Type scale (per DESIGN.md)

| Class | Font | Size / line-height | Weight | Notes |
|---|---|---|---|---|
| `headline-xl` | Newsreader | 56 / 1.05 | 700 | Hero headlines |
| `headline-lg` | Newsreader | 44 / 1.1 | 700 | Page H1s |
| `headline-md` | Newsreader | 32 / 1.2 | 600 | Article card headlines |
| `headline-sm` | Newsreader | 24 / 1.3 | 600 | Section H2s |
| `body-lg` | Inter | 18 / 1.8 | 400 | Article body |
| `body-md` | Inter | 16 / 1.7 | 400 | UI body |
| `label-sm` | Hanken Grotesk | 12 / 1.0 | 700 | **uppercase, tracking-widest** — metadata chips |
| `label-md` | Hanken Grotesk | 13 / 1.4 | 500 | sentence-case labels |
| `code` | JetBrains Mono | 15 / 1.5 | 400 | Inline / block code |

## For AI Agents

### Working In This Directory
- **Tailwind v4 — no `tailwind.config.js`.** The vite plugin is `@tailwindcss/vite`. Configuration is the `@theme` block in `global.css`.
- **Dark mode is class-based** (`html.dark`). `ThemeService.setTheme()` toggles that class. CSS variables in `tokens.css` / `tokens-dark.css` re-bind on class flip — no JS theme switching needed.
- **`.prose` is the markdown body class** (`@tailwindcss/typography` plugin + custom overrides). Body is Inter 18px / line-height 1.8. Headings are Newsreader. All `<analog-markdown>` components render with `classes="prose ..."`.
- **`.drop-cap` utility** (`global.css`) creates an editorial first-letter drop cap. Apply to a `<p>` you want to lead.
- **`.shadow-editorial`** is the canonical card shadow (low-opacity indigo). Use it on cards instead of inventing one.
- **Labels are uppercase tracking-widest** by default (`label-sm`). Don't override unless rendering original-language tokens or filenames — use `label-md` for sentence-case.
- New typography utility → define in `typography.css`. New colour alias → add to `@theme` block in `global.css`. Don't duplicate `font-display text-2xl ...` strings across templates.
- Site container: `max-w-(--container-site)` = **1280px** (matches `max-w-7xl` from DESIGN.md). Article container: `max-w-(--container-article)` = 720px.
- Page padding: `px-(--spacing-grid-margin)` (4vw) for the horizontal grid margin (DESIGN.md spec).

### Common Patterns
- Editorial meta row above headline: `<p class="label-sm text-outline mb-4">Eyebrow</p>` followed by `<h1 class="headline-xl">`.
- Card chrome: `bg-surface-container-lowest p-(--spacing-card-padding) shadow-editorial border border-outline-variant rounded-lg`.
- Pill badge: `<app-badge variant="primary">` (deep indigo on `primary-fixed` pale-indigo bg) or `variant="neutral"` / `variant="outline"`.
- "Read more →" CTA: `label-sm text-primary group-hover:gap-4 transition-all` on an `inline-flex items-center gap-2` anchor.

## Dependencies

### External
- `tailwindcss@^4.3`
- `@tailwindcss/vite` (build integration)
- `@tailwindcss/typography` (`.prose`)
- `@fontsource/{newsreader,inter,hanken-grotesk,jetbrains-mono}` for the four font families wired through `--font-display`, `--font-body`, `--font-label`, `--font-mono`.

<!-- MANUAL: -->

<!-- Generated: 2026-05-15 | Updated: 2026-05-15 -->

# hseongh-wiki

## Purpose
Personal Korean-language wiki of IT documentation translations, served as a static SPA built with **Angular 21 + AnalogJS 2.x + Tailwind v4** and deployed to **Cloudflare Workers Static Assets**. The bodies are faithful translations of upstream docs; an LLM agent maintains a thin meta layer on top (glossary, project cards, index, log). The full operating manual for the LLM is `CLAUDE.md` — read it before any content work.

## Live deployment
- **URL**: https://hseongh-wiki.hh4518.workers.dev/
- **Trigger**: every push to `main` rebuilds and redeploys automatically via Cloudflare Workers.
- **Repo**: `git@github.com:HseongH/hseongh-wiki.git`

## Key Files

| File | Description |
|------|-------------|
| `CLAUDE.md` | LLM operating manual — single source of truth for wiki ops (ingest / query / lint). |
| `README.md` | Human-facing project overview (Korean). |
| `package.json` | pnpm-managed dependencies, scripts (`dev`, `build`, `test:unit`). Package manager pinned to `pnpm@10.32.1`. |
| `pnpm-lock.yaml` | Lockfile — never edit by hand. |
| `angular.json` | Angular CLI workspace config. Builder is `@analogjs/platform:vite` — Angular's webpack pipeline is not used. |
| `vite.config.ts` | AnalogJS + Tailwind + Shiki + wikilink extension + virtual wiki-titles plugin. Build outputs to `dist/analog/public/`. |
| `wrangler.jsonc` | Cloudflare Workers config — static-only, SPA fallback to `index.html`. |
| `tsconfig.json` / `tsconfig.app.json` / `tsconfig.spec.json` | TypeScript compiler configs (app + spec separation). |
| `index.html` | SPA shell that loads `src/main.ts`. |
| `.editorconfig` / `.prettierrc` | Formatting. |
| `.gitignore` | Ignores `dist/`, `node_modules/`, `.angular/`, `.wrangler/`, `coverage/`. |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `src/` | All application source — Angular app, content, lib, styles (see `src/AGENTS.md`) |
| `docs/` | Design docs and implementation plans (see `docs/AGENTS.md`) |
| `public/` | Static assets bundled as-is into `dist/analog/public/` (see `public/AGENTS.md`) |
| `dist/` | Build output — gitignored. `dist/analog/public/` is what Cloudflare serves (now prerendered HTML per route). |
| `node_modules/` | pnpm-managed dependencies — gitignored. |
| `.omc/` | oh-my-claudecode runtime state — gitignored. |
| `.angular/` | Angular CLI build cache — gitignored. |
| `.vscode/` | Editor settings. |

## For AI Agents

### Working In This Directory
- **Always read `CLAUDE.md` first** before doing any content (`src/content/**`) work. The faithful-translation rule is hard.
- **Always read `src/content/_meta/STYLE.md`** before writing any body markdown — it's the single source for register, term decisions, and the canonical Korean term table.
- Run with **pnpm**, not npm/yarn. Scripts: `pnpm dev`, `pnpm build`, `pnpm test:unit` (vitest), `pnpm test` (ng test / karma).
- For Angular/AnalogJS code, consult the `/angular-developer` skill — consistent patterns are the goal.
- Commit + push every change. `main` push auto-deploys to Cloudflare Workers.

### Testing Requirements
- All tests run on **vitest** — both lib `*.test.ts` and component `*.spec.ts`.
- `pnpm test` / `pnpm test:unit` — `vitest run`. `pnpm test:watch` — interactive.
- jsdom env, include patterns `**/*.spec.ts` and `**/*.test.ts`.
- Component specs use Angular `TestBed` via `@analogjs/vitest-angular`'s `setupTestBed()` (wired in `src/test-setup.ts`).
- Karma (`ng test`) is **not** configured — no `architect.test` in `angular.json`.

### Common Patterns
- **Standalone Angular components** with `@Component({ standalone: true, ... })` — no NgModules.
- **Signals + computed** for state (`signal`, `computed`, `inject`, `effect`, `toSignal`). Avoid lifecycle hooks where possible.
- **File-based routing** via AnalogJS — every `src/app/pages/**/*.page.ts` becomes a route.
- **Markdown ingestion** via `@analogjs/content` (`injectContentFiles`, `injectContentFilesMap`, `MarkdownComponent`).
- **Tailwind v4** via `@tailwindcss/vite` — no `tailwind.config.js`; tokens live in `src/styles/`.

### Build / Run
| Command | Purpose |
|---|---|
| `pnpm dev` | Vite dev server at `http://localhost:4200` (HMR) |
| `pnpm build` | Production build → `dist/analog/public/` (prerendered SSG) |
| `pnpm test` / `pnpm test:unit` | Vitest (covers lib + component specs) |
| `pnpm test:watch` | Vitest watch mode |
| `pnpm lint` / `pnpm format` | Prettier check / fix |

### Deployment Gotcha
- `wrangler.jsonc` has no `main` field — the site is static; no Cloudflare Worker runtime is used.
- SSR is **off** (`ssr: false, static: true` in `vite.config.ts`). The site ships a SPA shell that hydrates client-side.
- If SSR is enabled later, `wrangler.jsonc` will need `main` pointing to `dist/analog/server/index.mjs`.

## Dependencies

### External (highlights)
- `@angular/core@^21.2` — Angular framework
- `@analogjs/platform@^2.5` — Vite-based Angular meta-framework (file routing + content)
- `@analogjs/content@^2.5` — markdown content pipeline
- `marked@^15` + `marked-shiki@^1.2` + `shiki@^1.29` — markdown rendering with syntax highlighting
- `tailwindcss@^4.3` (`@tailwindcss/vite`, `@tailwindcss/typography`)
- `gray-matter`, `front-matter` — frontmatter parsing
- `vitest@^4` + `jsdom` — testing
- `@fontsource/{hanken-grotesk,jetbrains-mono,source-serif-4}` — bundled fonts

<!-- MANUAL: -->

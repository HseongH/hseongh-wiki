# CLAUDE.md

This file is the operating manual for the LLM agent maintaining this wiki. It is **not** a human-facing guide — humans and Obsidian users only need to read the wiki pages themselves.

## What this folder is

**HseongH Wiki** — a personal Korean-language wiki of IT documentation translations, used only by HseongH. The bodies are kept as faithful translations of official upstream docs; the LLM maintains a thin meta layer on top (glossary, project cards, index, log).

The full concept design lives in [`docs/superpowers/specs/2026-05-14-hseongh-wiki-concept-design.md`](docs/superpowers/specs/2026-05-14-hseongh-wiki-concept-design.md). If this manual is ambiguous, that document is the single source of truth.

## Live deployment

- **Production URL**: https://hseongh-wiki.hh4518.workers.dev/
- **Hosting**: Cloudflare Workers (Static Assets binding, no server runtime). See [`wrangler.jsonc`](wrangler.jsonc).
- **Deploy trigger**: every push to `main` rebuilds and redeploys automatically.
- **Repository**: `git@github.com:HseongH/hseongh-wiki.git`. The local clone and `origin` are kept in sync via `commit` + `push`.

## Directory structure

```
hseongh-wiki/                  # project root (AnalogJS)
├── CLAUDE.md                  # this file — LLM operating manual
├── README.md                  # human-facing project overview
├── wrangler.jsonc             # Cloudflare Workers config (static + SPA fallback)
├── docs/                      # design docs, implementation plans
├── src/
│   ├── main.ts                # bootstrap entry — IMPORTS ./styles/global.css
│   ├── app/                   # Angular components, pages, services
│   │   ├── pages/             # file-based routing (AnalogJS convention)
│   │   ├── components/        # shared UI
│   │   └── services/          # ThemeService, DomainService, etc.
│   ├── content/               # all markdown content (read by AnalogJS)
│   │   ├── _meta/             # index.md, log.md, STYLE.md, domains.yml
│   │   ├── _glossary/         # term pages (globally shared across projects)
│   │   ├── _projects/         # project cards
│   │   └── wiki/              # body pages — mirrors upstream repo structure
│   │       └── <project>/
│   ├── lib/                   # marked plugins + build-time utilities
│   └── styles/                # Tailwind entry + DESIGN.md tokens
├── public/                    # static assets (fonts, favicon)
├── angular.json               # Angular CLI workspace (Vite-based via @analogjs/platform)
├── package.json
├── pnpm-lock.yaml
└── vite.config.ts             # AnalogJS + Tailwind + marked plugins
```

## Page templates

### Body page (`src/content/wiki/<project>/<path>.md`)

```markdown
---
source: <upstream URL>
source_commit: <upstream GitHub commit hash>
translated_at: YYYY-MM-DD
project: <project-slug>
tags: [...]
---

# 한국어 제목
*(원제: Original Title)*

> 원문: <link> · 동기화: YYYY-MM-DD / `<commit>`

(body — faithful Korean translation, preserving the source structure)

---

## 관련 페이지
- [[_glossary/<term>]]
- [[wiki/<project>/<adjacent-page>]]
```

### Glossary entry (`src/content/_glossary/<term>.md`)

```markdown
---
term: promise
korean: 프로미스
status: 정착어    # 정착어 | 원어유지 | 미정
domains: [language, frontend]   # optional; empty/missing = applies to all domains
---

# 프로미스 (promise)

**한국어 정착어**: 프로미스

(one or two sentence definition)

## 등장하는 문서
- [[wiki/<project>/<path>]]
```

### Project card (`src/content/_projects/<project>.md`)

```markdown
---
project: react
name: React                       # display name
summary: UI library for ...       # one-line description
domain: frontend                  # REQUIRED; must match an id in _meta/domains.yml
source_repo: <repo URL>
official_site: <site URL>
last_ingest: YYYY-MM-DD
---

# React

(one-paragraph introduction)

## 번역된 페이지
- [[wiki/<project>/<path>]] — 한국어 제목

## 번역 안 한 부분 (선택)
- (deliberately skipped areas and the reason)
```

## Tone & manner

[`src/content/_meta/STYLE.md`](src/content/_meta/STYLE.md) is the single source of truth for body writing. Every body page follows its rules for register, terminology, and abbreviations.

Highlights (full rules in STYLE.md):

- **Register**: 격식체 (`~합니다` / `~입니다`).
- **2nd person**: render upstream "you" as `여러분` consistently.
- **Technical terms**: on first occurrence in a page, write `한국어(원어)`; subsequent occurrences use Korean only. If no settled Korean term exists, keep the English (e.g., `hook`).
- **Faithful body**: no translator's notes, no reorganization, no paraphrasing inside the body. Commentary belongs outside the body (chat, or a future `_notes/` area).

## Wikilink notation

- Body page references: `[[wiki/<project>/<path>]]` (repo-root-relative full path)
- Meta references: `[[_glossary/<term>]]`, `[[_projects/<project>]]`
- The same prefix convention is used on every page.

At build time, the `marked-wikilink` extension (`src/lib/marked-wikilink.ts`) rewrites these to HTML anchors using lookups built from the content directory (`src/lib/build-lookups.ts`):

| Input | Output text comes from |
|---|---|
| `[[_glossary/promise]]` | `korean` field of the glossary entry |
| `[[_projects/pnpm]]` | `name` field of the project card |
| `[[wiki/pnpm/README]]` | first `#` heading of the target body |

Unknown targets fall back to the raw path as link text.

## Core operations

### Ingest — translate a new document

1. The user supplies the translation target (URL or GitHub repo path).
2. Read the source and briefly confirm key points with the user.
3. Write a faithful translation to `src/content/wiki/<project>/<path>.md`, following the body template.
4. For each term that appears in the page for the first time:
   - If `src/content/_glossary/<term>.md` does not exist, create it.
   - If it exists, append the current page to its "등장하는 문서" list.
   - When a new settled Korean term is decided, also append it to the term decision table in `src/content/_meta/STYLE.md`.
5. **(New-project step)** If the project belongs to a domain that is not yet in `src/content/_meta/domains.yml`, propose the new domain to the user, get confirmation, then add it. The `domain` field in the project card frontmatter is REQUIRED.
6. Update `src/content/_projects/<project>.md`: refresh the "번역된 페이지" list and bump `last_ingest`.
7. Update `src/content/_meta/index.md`: projects / glossary / "최근 작업" sections.
8. Append a `## [YYYY-MM-DD] ingest | <Project>: <Page Title>` entry to `src/content/_meta/log.md`.

A single ingest typically touches 5–10 files. Apply all updates in one pass to keep things consistent.

### Query — answer a question against the wiki

1. Receive the question.
2. Look in order: `src/content/_meta/index.md` → relevant `src/content/_projects/` or `src/content/_glossary/` → body pages.
3. Cite wiki pages in the answer (e.g., "see `[[wiki/react/learn/your-first-component]]`").
4. If the answer can be expressed inside the "faithful translation" envelope, fold it back into an existing body page or glossary entry. If it requires commentary that breaks faithfulness, keep the discussion in chat and **do not edit the bodies**.

### Lint — wiki health check

When the user requests, scan and report (do not auto-fix):

- Out-of-sync bodies: upstream has new commits but `source_commit` is stale.
- Terminology inconsistency: bodies that use a non-canonical form when the term decision table says otherwise.
- Orphan pages: pages with no inbound links.
- Thin glossary entries: definitions that need fleshing out.
- `last_ingest` mismatches: project card's `last_ingest` lags behind the actual newest body in that project.

Report only. Apply changes in a separate, user-approved batch.

## log.md format

Every entry starts with a `## [YYYY-MM-DD] <type> | <Title>` heading.
`<type>` ∈ { `ingest`, `query`, `lint`, `glossary`, `style`, `setup` }.

`grep "^## \[" src/content/_meta/log.md` produces a parseable timeline.

## Non-negotiables

- The body's faithful-translation rule is hard. If commentary is needed, it goes outside the body — chat, or a future `_notes/` area.
- `src/content/_meta/STYLE.md` is the single source for term decisions. Bodies that drift from it are caught by lint.
- The repo is connected to `git@github.com:HseongH/hseongh-wiki.git`. Every change lands as `commit` + `push`.
- Before writing any body content, **read STYLE.md first**. If a new term decision is required mid-task, update STYLE.md first, then write the body that uses it.

## Angular / AnalogJS development

The `src/` tree is an Angular 21 + AnalogJS 2.x project. When generating or modifying Angular code, use these skills:

- **`/angular-new-app`** — scaffolding new projects or major component sets
- **`/angular-developer`** — Angular best practices (signals, RxJS, routing, etc.)

Do not write Angular code without consulting these skills first. Consistent patterns are the goal.

### Build / run

| Command | Purpose |
|---|---|
| `pnpm dev` | Vite dev server at `http://localhost:4200` |
| `pnpm build` | Production build → `dist/analog/public/` (static) + `dist/analog/server/` (server stub) |
| `pnpm test:unit` | Vitest unit tests |
| `pnpm test` | Angular's Karma test runner (used by component specs) |

### Deployment

`main` pushes trigger Cloudflare Workers (Static Assets) auto-deploy. The deploy config is `wrangler.jsonc`:

- `assets.directory: ./dist/analog/public` — serves the built static files
- `assets.not_found_handling: "single-page-application"` — unknown paths fall back to `index.html` with status 200 (required for client-side routes like `/wiki/pnpm/README`)
- No `main` script field — the site is fully static; no Cloudflare Worker runtime is used.

If a future change enables AnalogJS SSR, `wrangler.jsonc` will need a `main` entry pointing to the generated `dist/analog/server/index.mjs`. Until then, keep it static-only.

### CSS injection (gotcha)

`angular.json`'s `styles` array is for Angular CLI's webpack pipeline — **AnalogJS uses Vite and does not read it**. Tailwind's entry point `src/styles/global.css` is loaded into the page by being imported from `src/main.ts`:

```ts
import './styles/global.css';
import { bootstrapApplication } from '@angular/platform-browser';
// ...
```

In dev, Vite injects styles via JS (no `<link>` in the raw HTML — this is normal). In production, Vite extracts a CSS bundle and adds `<link rel="stylesheet">` to `index.html`.

If styles ever stop applying, check this import first.

### AnalogJS content gotchas

- **`injectContentFiles()` returns frontmatter only — no body content.** AnalogJS's build-time transform (`?analog-content-list=true`) extracts only frontmatter attributes for the list. The rendered HTML body lives in **separate lazy loaders** exposed by `injectContentFilesMap()` (keyed by absolute filename like `/src/content/wiki/pnpm/motivation.md`; values are `() => Promise<string>`). The loader resolves to `---\n<frontmatter>\n---\n\n<HTML>`, so strip the frontmatter delimiters before passing to `<analog-markdown>`. `ContentFile.content` is typed `string | object`, but **at runtime it is `undefined`** when obtained from `injectContentFiles()` — never read it; use the filesMap loader instead.
- **`injectContentFiles()` filenames are missing the leading slash** — they look like `src/content/wiki/...`, while `injectContentFilesMap()` keys look like `/src/content/wiki/...`. Use the helpers in `src/lib/content-paths.ts` (`normalizeContentFilename`, `wikiPathFromFilename`, `wikiHrefFromFilename`, `isUnder`) so filters, href generation, and filesMap lookups stay consistent. A literal `f.filename.startsWith('/src/content/...')` filter silently returns 0 results.
- **`injectContent({ customFilename })` accepts a static string, not a function.** For dynamic routes use `injectContentFiles(filter)` for the entry + `injectContentFilesMap()` for the body loader, wired via `effect()` to a `toSignal(route.paramMap)` or `toSignal(route.url)` source.
- **Catch-all `[...path].page.ts` becomes Angular's `**` wildcard route.** Named param access (`paramMap.get('path')`) does not work — reconstruct the path from `route.url.map(s => s.path).join('/')`. **Use the `route.url` Observable, not `route.snapshot.url`**: Angular reuses the same component instance when navigating between catch-all paths (`ngOnInit` only fires once), so reading the snapshot once leaves the page stuck on the initial content. Wrap with `toSignal(route.url)` and drive `post`/`toc`/etc. via `computed()`.
- **Markdown pipeline is `marked`, not `remark`.** Production wikilink rewriting lives in `src/lib/marked-wikilink.ts`. `src/lib/remark-wikilink.ts` exists only as a TDD-driven reference implementation of the same resolver logic.
- **Build outputs**: client to `dist/analog/public/` (this is what Cloudflare serves), server stub to `dist/analog/server/` (unused while SSR is off). Both are gitignored.

### Out-of-scope (v2 candidates)

- Search (Pagefind or fuse.js)
- RSS feed
- Real per-route SSG (would require listing routes in `vite.config.ts`'s `analog({ prerender: { routes: [...] } })` — currently we ship a SPA shell and rely on client-side routing + the Workers SPA fallback)
- Mobile sidebar collapse
- i18n for UI strings (content is Korean by definition; UI strings are also Korean)

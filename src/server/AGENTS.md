<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-15 | Updated: 2026-05-15 -->

# server

## Purpose
Server-side route stubs scaffolded by AnalogJS's template. **Currently unused** — `vite.config.ts` sets `ssr: false, static: true`, so the site ships as a SPA with no server runtime. The stub remains as a placeholder for if/when SSR or API routes are turned on.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `routes/` | AnalogJS file-based server routes — currently just `api/v1/hello.ts`. |

## For AI Agents

### Working In This Directory
- **Treat this folder as dormant.** Touching `hello.ts` does nothing today — the file is not built or deployed (`wrangler.jsonc` has no `main` script, and AnalogJS's static mode skips the server bundle).
- Before re-activating server routes, flip `ssr: false` → `true` (or add explicit prerender routes) in `vite.config.ts` AND add `main: ./dist/analog/server/index.mjs` to `wrangler.jsonc`. See root `CLAUDE.md` for the deployment story.
- Server routes use **h3** event handlers (`defineEventHandler`).

## Dependencies

### External
- `h3` (transitively via `@analogjs/platform`)

<!-- MANUAL: -->

<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-15 | Updated: 2026-05-15 -->

# routes

## Purpose
AnalogJS file-based server routes. **Dormant** — the build is `ssr: false, static: true`, so nothing in here is bundled or served today.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `api/v1/` | API v1 stubs — currently just `hello.ts` returning `{ message: 'Hello World' }`. |

## For AI Agents

### Working In This Directory
- Edit only if you're turning SSR/server routes on. See parent `../AGENTS.md` for the prerequisite flips in `vite.config.ts` and `wrangler.jsonc`.
- Handlers use **h3** (`defineEventHandler`).

<!-- MANUAL: -->

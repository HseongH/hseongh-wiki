<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-15 | Updated: 2026-05-15 -->

# public

## Purpose
Static assets copied verbatim to the build output root. Vite serves files in this directory at the URL root in dev and copies them to `dist/analog/public/` at build time. Only files that must be served at a stable URL (favicon, robots.txt) belong here — runtime-imported assets should live next to their consumer instead.

## Key Files

| File | Description |
|------|-------------|
| `favicon.ico` | Site favicon — referenced by `index.html`. |

## For AI Agents

### Working In This Directory
- Anything dropped here is published as-is at the site root. Don't store source files or build artefacts.
- Fonts are bundled via `@fontsource/*` packages and imported through CSS — not via this folder.

<!-- MANUAL: -->

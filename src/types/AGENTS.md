<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-15 | Updated: 2026-05-15 -->

# types

## Purpose
Ambient TypeScript declarations for virtual modules and any other type plumbing that has no concrete `.ts` file backing it.

## Key Files

| File | Description |
|------|-------------|
| `virtual.d.ts` | Declares the `virtual:wiki-titles` module exposed by `src/lib/wiki-titles-plugin.ts`. Exports the types of `wikiTitles`, `projectNames`, `glossaryKorean`. |

## For AI Agents

### Working In This Directory
- If you change the shape of the lookups in `src/lib/build-lookups.ts`, **also update `virtual.d.ts`** or downstream imports will type-check against stale shapes.
- Don't put runtime code here — only ambient declarations (`declare module '…'`, `declare global { … }`).
- `tsconfig.app.json` includes `src/types/**/*.d.ts` implicitly through the `src` root — no extra config needed.

## Dependencies

### Internal
- Backs the `virtual:wiki-titles` module produced by `../lib/wiki-titles-plugin.ts`.
- Consumed by `../app/components/doc-nav/`, `../app/pages/(home).page.ts`, and the per-project / per-domain pages.

<!-- MANUAL: -->

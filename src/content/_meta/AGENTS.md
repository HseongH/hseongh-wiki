<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-15 | Updated: 2026-05-15 -->

# _meta

## Purpose
Meta-files that govern the wiki rather than serve as user-facing content. The style guide, the domain catalog, the entry-point index, and the chronological work log.

## Key Files

| File | Description |
|------|-------------|
| `STYLE.md` | **Single source of truth for body writing.** Register, terminology table, code-block rules, external-link handling. Every body translation follows it. Update FIRST when introducing a new term decision. |
| `domains.yml` | Domain catalog — id / name / summary tuples for `frontend`, `backend`, `devops`, `tooling`, `language`. Project cards reference these by id. **The hardcoded list in `src/app/services/domain.service.ts` mirrors this** — keep both in sync. |
| `index.md` | Wiki front door — projects, glossary terms, "최근 작업" list, and quick-entry links to `CLAUDE.md`, `STYLE.md`, `log.md`. Refresh on every ingest. |
| `log.md` | Append-only chronological log. Every entry starts with `## [YYYY-MM-DD] <type> \| <Title>`. `<type>` ∈ {`ingest`, `query`, `lint`, `glossary`, `style`, `setup`}. `grep "^## \[" log.md` produces a parseable timeline. |

## For AI Agents

### Working In This Directory
- **`STYLE.md` is sacred.** A term decision recorded here is binding for every body and every glossary entry. When a new term is needed:
  1. Update STYLE.md's term-decision table first.
  2. Write/update the matching `_glossary/<term>.md`.
  3. Only then write the body that uses the term.
- **`log.md` is append-only.** Never rewrite past entries — they are the audit trail. New entry per operation (ingest / lint / query / etc.).
- **`domains.yml` is the source of truth for domains, but `domain.service.ts` mirrors it.** Until a `vite-plugin-yaml` loader is wired, you must update both when adding a domain.
- **`index.md` summarises state**, not history. The "최근 작업" section is the most recent few items, mirrored from `log.md` in inverse chronological order.

### Conventions
- All meta files are written in Korean (audience is the wiki maintainer, who reads Korean).
- `log.md` entries are short — 1–3 lines per `##` block.

## Dependencies

### Internal
- `STYLE.md` cited from root `CLAUDE.md`.
- `domains.yml` mirrored by `../../app/services/domain.service.ts`.
- `index.md` linked from root `README.md` and `CLAUDE.md`.

<!-- MANUAL: -->

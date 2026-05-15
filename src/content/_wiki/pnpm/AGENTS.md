<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-15 | Updated: 2026-05-15 -->

# pnpm

## Purpose
Korean translations of pnpm.io official docs. URLs: `/wiki/pnpm/<page>`. Project card: `_projects/pnpm.md`. Domain: `tooling`.

## Key Files

| File | URL | Description |
|------|-----|-------------|
| `motivation.md` | `/wiki/pnpm/motivation` | Why pnpm exists — flat node_modules problems and content-addressable storage. |
| `installation.md` | `/wiki/pnpm/installation` | Install / upgrade / uninstall pnpm via Corepack, scripts, npm. |
| `pnpm-cli.md` | `/wiki/pnpm/pnpm-cli` | Top-level CLI flags and behaviour (`--filter`, etc.). |
| `feature-comparison.md` | `/wiki/pnpm/feature-comparison` | pnpm vs npm vs Yarn feature matrix. |
| `pnpm-vs-npm.md` | `/wiki/pnpm/pnpm-vs-npm` | Side-by-side comparison with npm. |
| `faq.md` | `/wiki/pnpm/faq` | Frequently asked questions. |

## For AI Agents

### Working In This Directory
- Every file is a faithful Korean translation of the same page on pnpm.io — no reorganisation. See `../AGENTS.md` for body rules.
- The upstream repo is `https://github.com/pnpm/pnpm` and the published docs at `https://pnpm.io/`. Frontmatter `source` should point to the canonical pnpm.io URL; `source_commit` to the pnpm repo commit.
- Adding a new page: also append it to `../../_projects/pnpm.md`'s "번역된 페이지" list and bump `last_ingest`.
- Linting: if `source_commit` is older than the upstream HEAD of the same file, the page is out-of-sync. Re-translate or annotate.

### Common Patterns
- Internal cross-references use repo-root-relative wikilinks: `[[wiki/pnpm/feature-comparison]]`, not relative paths.
- Glossary references at the bottom: e.g., `[[_glossary/content-addressable-storage]]`.

## Dependencies

### Internal
- Project card: `../../_projects/pnpm.md`.
- Glossary terms referenced: `content-addressable-storage`, `hard-link`, `symbolic-link`, `monorepo`, `lockfile`, `package`, `package-manager`, `registry`, `workspace`, `hoisting`, `dependency`. See `../../_glossary/`.

<!-- MANUAL: -->

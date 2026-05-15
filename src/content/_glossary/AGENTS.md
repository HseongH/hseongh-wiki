<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-15 | Updated: 2026-05-15 -->

# _glossary

## Purpose
Glossary entries — one file per term, globally shared across projects. Each entry defines a settled Korean translation (or marks the term as `원어유지` / `미정`), optionally tags it by domain, and lists every body page where the term appears.

URL: `/glossary/<term>`. Index page: `/glossary` (lists all terms sorted by Korean).

## File template

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

## Current entries (slugs)
`content-addressable-storage`, `dependency`, `hard-link`, `hoisting`, `lockfile`, `monorepo`, `package`, `package-manager`, `registry`, `symbolic-link`, `workspace`. (Verify against `ls _glossary/`.)

## For AI Agents

### Working In This Directory
- **One term per file.** Filename slug must match the `term:` frontmatter field, kebab-case.
- **`status` field is enum**: `정착어` (use Korean), `원어유지` (use original), `미정` (undecided, keep original pending decision). See `_meta/STYLE.md` for the binding term-decision table.
- **The "등장하는 문서" list is maintained by the LLM.** When a body uses the term for the first time, append `- [[wiki/<project>/<path>]]` here. When a body is removed, drop the corresponding entry.
- **Wikilink resolver looks up `korean` field** as the link text — `[[_glossary/promise]]` renders as `<a href="/glossary/promise">프로미스</a>`. If `korean` is missing, falls back to the slug.
- New term: update `_meta/STYLE.md` term-decision table FIRST (before writing this entry or any body that uses it).

### Common Patterns
- Definitions are short — one or two sentences. Detail belongs in the bodies; this is a lookup.
- `domains` is optional — when missing or empty, the term applies to all domains.

## Dependencies

### Internal
- Linked from bodies via `[[_glossary/<term>]]`.
- Term decisions recorded in `../_meta/STYLE.md`.
- Walked by `../../lib/build-lookups.ts` to build `glossaryLookup`.
- Indexed by `../../app/pages/glossary/(index).page.ts`; individual pages rendered by `../../app/pages/glossary/[term].page.ts`.

<!-- MANUAL: -->

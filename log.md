# Log

각 항목은 `## [YYYY-MM-DD] <type> | <Title>` 형식입니다.
타입: `ingest` | `query` | `lint` | `glossary` | `style` | `setup`

`grep "^## \[" log.md | tail -10` 으로 최근 작업을 훑을 수 있습니다.

---

## [2026-05-14] setup | 위키 초기화

초기 디렉토리 구조 생성. `llm-wiki` 스펙 패턴의 부분 차용 (미러 + 가벼운 위키 레이어).

- 컨셉 설계: [docs/superpowers/specs/2026-05-14-hseongh-wiki-concept-design.md](docs/superpowers/specs/2026-05-14-hseongh-wiki-concept-design.md)
- 초기 파일: `CLAUDE.md`, `index.md`, `log.md`, `STYLE.md`, `README.md`, `.gitignore`
- 빈 디렉토리: `_glossary/`, `_projects/`, `wiki/`
- 원격: `git@github.com:HseongH/hseongh-wiki.git`

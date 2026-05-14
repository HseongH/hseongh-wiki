# Log

각 항목은 `## [YYYY-MM-DD] <type> | <Title>` 형식입니다.
타입: `ingest` | `query` | `lint` | `glossary` | `style` | `setup`

`grep "^## \[" log.md | tail -10` 으로 최근 작업을 훑을 수 있습니다.

---

## [2026-05-14] setup | AnalogJS 사이트 v1 구현

위키 콘텐츠를 렌더링하는 AnalogJS 정적 사이트 v1 구현 완료. Cloudflare Pages 연결은 별도 사용자 작업.

- **스택**: Angular 21 + AnalogJS 2.5.1 + Tailwind v4 + Shiki + pnpm
- **레이아웃**: 7개 페이지 타입 (`/`, `/about`, `/wiki/:project/*`, `/projects/:slug`, `/domains/:id`, `/glossary`, `/glossary/:term`)
- **기능**: 다크 모드 (localStorage 유지), 위키링크 빌드 타임 변환 (`[[...]]` → `<a>` 한국어 정착어 자동), Shiki 코드 하이라이트 (dual theme)
- **빌드 산출**: `app/dist/analog/public/` (SPA shell + 클라이언트 라우팅)
- **구현 계획**: [docs/superpowers/plans/2026-05-14-angular-blog-implementation.md](../../../docs/superpowers/plans/2026-05-14-angular-blog-implementation.md)
- **사이트 설계**: [docs/superpowers/specs/2026-05-14-angular-blog-design.md](../../../docs/superpowers/specs/2026-05-14-angular-blog-design.md)
- **남은 작업**: Cloudflare Pages 대시보드 연결 (수동), 배포 후 Lighthouse 측정

## [2026-05-14] ingest | pnpm: README

원문: [github.com/pnpm/pnpm/blob/main/README.md](https://github.com/pnpm/pnpm/blob/main/README.md) / commit `94240bc`
번역 페이지: [[wiki/pnpm/README]]

신규 페이지:
- [[wiki/pnpm/README]]
- [[_projects/pnpm]]
- [[_glossary/package-manager]], [[_glossary/package]], [[_glossary/dependency]], [[_glossary/monorepo]], [[_glossary/lockfile]], [[_glossary/content-addressable-storage]]

영향받은 페이지:
- `index.md` (프로젝트/용어집/최근 작업 갱신)
- `STYLE.md` (용어 결정 표 6개 + 부차 용어 3개 추가)

## [2026-05-14] setup | 위키 초기화

초기 디렉토리 구조 생성. `llm-wiki` 스펙 패턴의 부분 차용 (미러 + 가벼운 위키 레이어).

- 컨셉 설계: [docs/superpowers/specs/2026-05-14-hseongh-wiki-concept-design.md](docs/superpowers/specs/2026-05-14-hseongh-wiki-concept-design.md)
- 초기 파일: `CLAUDE.md`, `index.md`, `log.md`, `STYLE.md`, `README.md`, `.gitignore`
- 빈 디렉토리: `_glossary/`, `_projects/`, `wiki/`
- 원격: `git@github.com:HseongH/hseongh-wiki.git`

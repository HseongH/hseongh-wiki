# Log

각 항목은 `## [YYYY-MM-DD] <type> | <Title>` 형식입니다.
타입: `ingest` | `query` | `lint` | `glossary` | `style` | `setup` | `fix`

## [2026-05-14] fix | wiki catch-all 라우트 콘텐츠 갱신 + README 정리

증상: 한 wiki 페이지에서 다른 wiki 페이지(예: 인덱스 → motivation)로 링크 이동 시 콘텐츠가 갱신되지 않음.

원인: `src/app/pages/wiki/[...path].page.ts` 가 `ActivatedRoute.snapshot.url` 을 `ngOnInit` 에서 1회만 읽음. AnalogJS 의 catch-all (`**`) 은 라우트 변경 시 동일 컴포넌트를 재사용 → ngOnInit 미실행 → 이전 페이지 콘텐츠 잔존.

수정: `snapshot.url` 을 `toSignal(route.url)` 기반 반응형으로 전환. `post` / `toc` / `markdown` / `title` 모두 `computed` 로 도출. 다른 동적 페이지(`[slug]`, `[term]`, `[id]`) 의 패턴과 통일.

부수 정리: 직전 커밋(517ded9)에서 삭제된 `wiki/pnpm/README.md` 의 잔여 참조 15곳 제거 — 본문 6개·용어집 6개·프로젝트 카드·`index.md`. `log.md` 의 과거 ingest 항목 2곳은 역사 기록으로 보존 (위키링크 미해석 시 raw path 로 폴백). 용어집 6개는 새 pnpm.io 페이지 등장처로 재연결.

`grep "^## \[" log.md | tail -10` 으로 최근 작업을 훑을 수 있습니다.

---

## [2026-05-14] ingest | pnpm.io docs 1차 (foundational)

원문: [github.com/pnpm/pnpm.io](https://github.com/pnpm/pnpm.io) / commit `5b4b807`

번역 페이지 (6):
- [[wiki/pnpm/motivation]] — 동기
- [[wiki/pnpm/installation]] — 설치
- [[wiki/pnpm/pnpm-cli]] — pnpm CLI 개요
- [[wiki/pnpm/feature-comparison]] — npm/Yarn 과의 기능 비교
- [[wiki/pnpm/faq]] — 자주 묻는 질문
- [[wiki/pnpm/pnpm-vs-npm]] — pnpm vs npm

신규 용어집 (5): [[_glossary/symbolic-link]], [[_glossary/hoisting]], [[_glossary/registry]], [[_glossary/workspace]], [[_glossary/hard-link]] (이전엔 STYLE.md 결정만 있고 페이지 없음 → 페이지 생성)

영향받은 페이지:
- `_meta/index.md` (프로젝트/용어집/최근 작업 갱신)
- `_meta/STYLE.md` (용어 결정 표에 신규 항목 + 외부 docs 처리 규칙 추가: 상대 경로 `.md` 제거, 이미지 절대 URL, admonition 유지)
- `_projects/pnpm.md` (번역된 페이지 목록에 6개 추가, docs_repo 필드 신규)

## [2026-05-14] setup | AnalogJS 사이트 v1 배포

위키 콘텐츠를 렌더링하는 AnalogJS 정적 사이트 v1 구현 + Cloudflare Workers 배포 완료.

- **라이브 URL**: https://hseongh-wiki.hh4518.workers.dev/
- **스택**: Angular 21 + AnalogJS 2.5.1 + Tailwind v4 + Shiki + pnpm
- **레이아웃**: 7개 페이지 타입 (`/`, `/about`, `/wiki/:project/*`, `/projects/:slug`, `/domains/:id`, `/glossary`, `/glossary/:term`)
- **기능**: 다크 모드 (localStorage 유지), 위키링크 빌드 타임 변환 (`[[...]]` → `<a>` 한국어 정착어 자동), Shiki 코드 하이라이트 (dual theme)
- **배포**: Cloudflare Workers Static Assets (`wrangler.jsonc`, SPA fallback). `main` 푸시 시 자동 재배포.
- **구현 계획**: [docs/superpowers/plans/2026-05-14-angular-blog-implementation.md](../../../docs/superpowers/plans/2026-05-14-angular-blog-implementation.md)
- **사이트 설계**: [docs/superpowers/specs/2026-05-14-angular-blog-design.md](../../../docs/superpowers/specs/2026-05-14-angular-blog-design.md)
- **남은 작업**: Lighthouse 측정 (라이브 URL 기반), 커스텀 도메인 (선택)

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

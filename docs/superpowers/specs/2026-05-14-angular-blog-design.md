# HseongH 위키 — Angular (AnalogJS) 사이트 설계

**작성일**: 2026-05-14
**상태**: 컨셉 확정. 구현 계획은 후속 단계 (writing-plans) 에서 작성.
**선행 spec**: [2026-05-14-hseongh-wiki-concept-design.md](2026-05-14-hseongh-wiki-concept-design.md) (위키 콘텐츠 모델)

## 한 줄 정의

HseongH 위키의 markdown 콘텐츠를 렌더링하는 **AnalogJS 기반의 정적 사이트**. Cloudflare Pages 에 배포되며, 위키의 본문/용어집/프로젝트 카드를 도메인별로 탐색하고 충실히 읽을 수 있는 개인용 호스팅 인터페이스.

## 핵심 결정 사항

| 항목 | 결정 |
|---|---|
| 스택 | AnalogJS (latest stable) + Angular 21 (호환 안 되면 20 fallback) |
| 스타일링 | TailwindCSS v4 (호환 이슈 시 v3 fallback) + Tailwind Typography |
| 코드 하이라이트 | Shiki (dual-theme light/dark) |
| 폰트 | 셀프 호스트 — Hanken Grotesk · Source Serif 4 · JetBrains Mono |
| 다크 모드 | v1 포함 (`html.dark` 클래스 + Tailwind `dark:` variant + localStorage) |
| 저장소 레이아웃 | 단일 repo, AnalogJS 프로젝트가 루트, 콘텐츠는 `src/content/` |
| 콘텐츠 카테고리 | 도메인 기반 (`_meta/domains.yml`) — 프로젝트가 도메인에 속함 |
| 배포 타깃 | Cloudflare Pages (`main` 푸시 시 자동 빌드) |
| 패키지 매니저 | pnpm (위키 콘텐츠와 일치, 학습 효과) |
| 스캐폴드 | `ng new app [options]` → `ng add @analogjs/platform` |
| 구현 단계 스킬 | `/angular-new-app`, `/angular-developer` 적극 활용 |

## 저장소 구조

```
hseongh-wiki/                          ← AnalogJS 프로젝트 루트
├── src/
│   ├── app/
│   │   ├── pages/                    ← 파일 기반 라우팅
│   │   │   ├── (home).page.ts
│   │   │   ├── about.page.ts
│   │   │   ├── domains/[id].page.ts
│   │   │   ├── projects/[slug].page.ts
│   │   │   ├── wiki/[...path].page.ts
│   │   │   ├── glossary/(index).page.ts
│   │   │   └── glossary/[term].page.ts
│   │   └── components/               ← UI 컴포넌트 (Header, Footer, TOC, PostCard, DomainSidebar, ...)
│   ├── content/                      ← ★ 위키 콘텐츠
│   │   ├── wiki/
│   │   │   └── pnpm/
│   │   │       └── README.md
│   │   ├── _glossary/*.md
│   │   ├── _projects/*.md            ← 각 파일에 domain 필드
│   │   └── _meta/
│   │       ├── domains.yml
│   │       ├── index.md
│   │       ├── log.md
│   │       └── STYLE.md
│   ├── styles/                       ← Tailwind 진입점 + 커스텀 레이어
│   └── main.ts
├── public/
│   └── fonts/                        ← woff2 셀프 호스트
├── angular.json
├── package.json
├── vite.config.ts
├── index.html
├── docs/                              ← spec/plan
├── stitch_visual_study_archive/       ← 디자인 참고자료
├── CLAUDE.md
├── README.md
└── .gitignore
```

## 콘텐츠 모델

### 도메인 카탈로그

`src/content/_meta/domains.yml`:

```yaml
domains:
  - id: frontend
    name: Frontend
    summary: UI 프레임워크, CSS, 브라우저
  - id: backend
    name: Backend
    summary: 서버 런타임, API
  - id: devops
    name: DevOps
    summary: 컨테이너, CI/CD, 인프라
  - id: tooling
    name: Tooling
    summary: 빌드 도구, 패키지 매니저, 에디터
  - id: language
    name: Languages
    summary: 프로그래밍 언어 자체
```

처음 5개로 시작. 새 도메인이 필요해지면 항목 추가. 사이드바는 이 yml 의 순서대로 렌더링.

### 프론트매터 변경

**프로젝트 카드** (`_projects/<project>.md`) — `domain` 신규 필드:

```yaml
---
project: pnpm
name: pnpm
summary: 디스크 효율적인 Node.js 패키지 매니저
domain: tooling           # ★ 신규 — domains.yml 의 id 참조
source_repo: https://github.com/pnpm/pnpm
official_site: https://pnpm.io
last_ingest: 2026-05-14
---
```

**본문 페이지** (`wiki/<project>/<path>.md`) — 기존 그대로. 도메인은 프로젝트에서 상속.

**용어집** (`_glossary/<term>.md`) — 선택적 `domains` 배열:

```yaml
---
term: promise
korean: 프로미스
status: 정착어
domains: [frontend, language]   # ★ 신규 (선택). 비우면 모든 도메인 취급.
---
```

### URL 구조

| 경로 | 페이지 | 데이터 소스 |
|---|---|---|
| `/` | 홈 (디스커버리) | `wiki/**` (translated_at 정렬) + `_meta/domains.yml` + `_meta/log.md` |
| `/domains/:id` | 도메인 페이지 | `_projects/*` (domain 필터) + 해당 프로젝트의 `wiki/*` |
| `/projects/:slug` | 프로젝트 카드 | `_projects/<slug>.md` + `wiki/<slug>/**` |
| `/wiki/:project/*` | 아티클 페이지 | `wiki/<project>/<path>.md` + `_projects/<project>.md` |
| `/glossary` | 용어집 인덱스 | `_glossary/*` |
| `/glossary/:term` | 용어 페이지 | `_glossary/<term>.md` + 역참조 인덱스 |
| `/about` | 위키 소개 | 정적 콘텐츠 (운영 매뉴얼 링크 포함) |

### 본문 위키링크 변환

빌드 시 remark 플러그인이 처리:

| 원본 | 변환 결과 |
|---|---|
| `[[_glossary/promise]]` | `<a href="/glossary/promise">프로미스</a>` (한국어 정착어 자동 텍스트) |
| `[[wiki/pnpm/README]]` | `<a href="/wiki/pnpm/README">pnpm</a>` (페이지 한국어 제목 자동 텍스트) |
| `[[_projects/pnpm]]` | `<a href="/projects/pnpm">pnpm</a>` |

### URL 케이싱 컨벤션

- **파일명·디렉토리명은 원본 그대로**: `wiki/pnpm/README.md` 는 원본 GitHub 의 케이싱(`README.md`)을 유지. 충실한 미러링 원칙과 일치.
- **URL 도 케이스 보존**: 파일 경로가 그대로 URL 이 됨 (예: `/wiki/pnpm/README`). lowercase 강제 변환 ❌.
- **메타 페이지 (`_glossary/`, `_projects/`)** 의 파일명은 모두 lowercase + kebab-case (예: `content-addressable-storage.md`) — 이미 그 컨벤션을 따르고 있음.

## 페이지별 UX

### 글로벌 레이아웃

- **Header (sticky)**: 로고 `HseongH` (홈 링크) · 메인 nav (`Wiki` / `Glossary` / `Projects` / `About`) · 다크 모드 토글 (🌓) · 검색 아이콘 (v2 placeholder)
- **Footer (minimal)**: `© 2026 HseongH` · GitHub repo 링크

### 1. `/` — 홈

- **좌측 사이드바**: 도메인 카탈로그 (이름 + 본문 페이지 카운트). 클릭 시 `/domains/:id`.
- **메인**: "최근 게시글" 헤더 + 카드 그리드 (최근 8–12개 본문 페이지). 카드 = 프로젝트 배지 + 한국어 제목 + 짧은 발췌 + 날짜.
- **하단 사이드바 위젯**: "최근 작업 로그" (뉴스레터 자리 대체) — `_meta/log.md` 의 최근 5개 항목.

### 2. `/domains/:id` — 도메인 페이지

- 도메인 이름 + summary + 소속 프로젝트 카드 그리드 + 그 도메인의 본문 페이지 리스트.

### 3. `/projects/:slug` — 프로젝트 카드

- 프로젝트 이름 + 도메인 배지 + summary + 공식 사이트/repo 링크 + 번역된 페이지 리스트.

### 4. `/wiki/:project/*` — 아티클 페이지 (`_2` 디자인)

- **좌측 TOC 사이드바 (sticky, scroll-spy)**: 본문 헤딩에서 자동 생성.
- **메인 (720px max-width)**: 한국어 제목 · 원제 부제 · 원문 메타 (출처/동기화) · 본문 (Source Serif 4) · 하단 태그 배지 · "관련 페이지" 블록.
- **우측 사이드바**: 프로젝트 정보 카드 (이름 + 도메인 배지 + 한 줄 소개) + 인접 페이지 (같은 프로젝트 내).

### 5. `/glossary` — 용어집 인덱스

- 가나다/알파벳 순 리스트. 항목당: 한국어 + (원어) + 도메인 배지.
- 상단 도메인 필터 토글.

### 6. `/glossary/:term` — 용어 페이지

- 한국어 용어 + 원어 + status (정착어/원어유지) + 짧은 정의 + "등장하는 문서" 리스트.

### 7. `/about` — 위키 소개

- HseongH 위키의 정체성, 충실한 번역 원칙, 운영 매뉴얼 (CLAUDE.md) 링크.

## 비주얼 시스템

### 토큰 소스

[`stitch_visual_study_archive/intellectual_clarity/DESIGN.md`](../../stitch_visual_study_archive/intellectual_clarity/DESIGN.md) 가 단일 진실 소스. Tailwind 테마로 매핑:

- **색상**: light 토큰 그대로 + 다크 변형 도출.
- **타이포**: `font-display` (Hanken Grotesk, UI/헤더), `font-body` (Source Serif 4, 본문), `font-mono` (JetBrains Mono, 코드).
- **스페이싱**: 8px 기반.
- **둥글기**: 기본 4px, 카드는 8px.

### 다크 모드 도출 원칙

DESIGN.md 의 light 만 정의됨. dark 는 다음 원칙으로 파생:

| 카테고리 | light | dark |
|---|---|---|
| surface | `#faf8ff`, `#ffffff` 흰 계조 | `#0F1428`, `#1A1F35` indigo-tinted 슬레이트 |
| on-surface | `#131b2e` dark slate | `#EEF0FF` 거의 흰색 |
| primary | `#3730A3` deep Indigo | `#C3C0FF` 밝은 Indigo (light 의 `inverse-primary` 활용) |
| outline | `#777584` 중간 그레이 | 더 어둡고 채도 낮은 슬레이트 |

상세 매핑 표는 구현 시점에 Tailwind theme 으로 코드화.

### 폰트 로딩

- woff2 셀프 호스트 → `public/fonts/`
- `@font-face` 정의 + `font-display: swap`
- 외부 CDN 의존 제거, CLS 통제

## v1 기능 스코프

**포함**:

| 기능 | 비고 |
|---|---|
| 7개 페이지 타입 | 핵심 |
| 도메인 사이드바 + 카운트 | 홈/도메인 페이지 |
| 최근 작업 로그 위젯 | 뉴스레터 자리 대체 |
| 본문 TOC (sticky, scroll-spy) | 아티클 페이지 |
| 위키링크 변환 + 글로서리 자동 텍스트 | 빌드 타임 remark 플러그인 |
| 다크 모드 | CSS variable + Tailwind `dark:` + localStorage |
| 태그/도메인 배지, 관련 페이지 | 본문/카드 |
| 코드 syntax highlight | Shiki (dual-theme) |
| SSG 빌드 + Cloudflare Pages 자동 배포 | `main` 푸시 → 빌드 |
| 셀프 호스트 폰트 | woff2 |

**제외 (v2 이후)**:

| 기능 | 이유 |
|---|---|
| 검색 (Pagefind/fuse.js) | 콘텐츠 규모 보고 도입 |
| RSS 피드 | 개인용 우선순위 낮음 |
| 댓글 / 소셜 공유 | 개인용, 의미 없음 |
| 이미지 최적화 (responsive srcset) | AnalogJS 기본 처리로 시작 |
| 다국어 (i18n) | UI 한국어 단일 |
| 사이트맵 / robots.txt | 비공식 공개라 우선 안 만듦 |

## 접근성 / 성능 가드레일

- **Lighthouse 90+** 모든 페이지 (Performance / Accessibility / Best Practices / SEO).
- **WCAG**: 본문 색상 대비 4.5:1 이상.
- **이미지**: alt 텍스트 필수. 빌드 시 누락 경고.
- **키보드 내비**: 헤더 nav, TOC 링크, 다크 토글 모두 접근 가능.

## 구현 단계 개략

상세는 implementation plan (writing-plans 스킬) 에서 다룸.

1. **스캐폴드** (`/angular-new-app` 스킬 활용):
   ```
   ng new app --routing --style=css --strict --package-manager=pnpm --skip-git
   
   ng add @analogjs/platform
   ```
   Angular 21 호환성 검증. 미지원 시 Angular 20 으로 내림.
2. **TailwindCSS 설정**: v4 (CSS-first) 또는 v3 (config 파일). DESIGN.md 토큰 → 테마 매핑.
3. **폰트 다운로드**: Hanken Grotesk / Source Serif 4 / JetBrains Mono woff2 → `public/fonts/`.
4. **콘텐츠 이주**: 루트의 `wiki/`, `_glossary/`, `_projects/`, `index.md`/`log.md`/`STYLE.md` → `src/content/` 안으로. `_meta/domains.yml` 신규 작성. `_projects/pnpm.md` 에 `domain: tooling` 추가.
5. **페이지 컴포넌트 작성** (`/angular-developer` 스킬 활용): 7개 라우트.
6. **remark 플러그인 체인**: 위키링크 변환, 글로서리 자동 텍스트, Shiki 코드 하이라이트, TOC 데이터 추출.
7. **다크 모드 토글**: 헤더 컴포넌트 + localStorage.
8. **Cloudflare Pages 연결**: 빌드 명령 (`pnpm build`), 출력 디렉토리 (`dist/analog/public/`), Node 버전 설정.
9. **첫 배포 + 검증**: Lighthouse, 다크 모드, 모바일 반응형, 위키링크 동작.

## 워크플로 변경 (CLAUDE.md 갱신)

콘텐츠 이주 후 CLAUDE.md 의 ingest 절차에서 경로만 변경:

- 이전: `wiki/<project>/<path>.md` (루트)
- 이후: `src/content/wiki/<project>/<path>.md`

핵심 흐름(번역 → 용어집 갱신 → 프로젝트 카드 갱신 → index/log)은 동일. 새로 추가될 단계:

- 새 프로젝트의 도메인이 `_meta/domains.yml` 에 없으면 LLM 이 새 도메인 항목을 제안하고 사용자 확인 후 추가.

또한 CLAUDE.md 에 `/angular-new-app`, `/angular-developer` 스킬 활용 지침을 추가 — Angular 코드 변경 시 일관된 best practice 유지.

## 검증 필요 / 알려진 리스크

| 항목 | 검증 / 대응 |
|---|---|
| Angular 21 + AnalogJS peerDependency | `ng add @analogjs/platform` 시 호환성 확인. 미지원 시 Angular 20. |
| Tailwind v4 + AnalogJS Vite 통합 | 알려진 이슈 없음. 첫 빌드에서 확인, 문제 시 v3. |
| 위키링크 변환 lookup 정확도 | 기존 remark wiki-link 또는 custom plugin. 첫 구현 후 unit-test. |
| Cloudflare Pages Node 버전 | AnalogJS 권장 Node 버전과 Cloudflare 설정 매칭. |
| pnpm + Angular CLI | `--package-manager=pnpm` 옵션이 정상 동작하는지 첫 빌드에서 확인. |
| 다크 모드 토큰 도출 | DESIGN.md 의 light 토큰만 정의되어 있어 dark 는 도출. 실제 사용 시 색상 대비 재검증. |

## 명시적으로 spec 의 범위 밖

후속 implementation plan 에서 다룰 것:

- 실제 파일 생성/이동 명령 순서
- 각 페이지 컴포넌트의 props/state 정의
- remark 플러그인의 구체적 코드 구조
- Cloudflare Pages 의 환경 변수, 빌드 설정 화면 세부
- 다크 모드 토큰의 정확한 값 표
- Lighthouse 측정 결과별 튜닝 전략

## 향후 변경 가능성

- **검색 도입**: 콘텐츠가 50+ 페이지로 늘면 Pagefind 도입 (빌드 시 인덱스 생성, 클라이언트 사이드 검색).
- **이미지 처리**: 위키에 이미지가 늘어나면 AnalogJS 의 이미지 최적화 또는 Cloudflare Images 도입.
- **다국어**: 본 위키는 한국어 단일. 만약 영문 원문 병기 모드를 추가하려면 페이지 컴포넌트에 토글 추가.
- **i18n**: UI 다국어는 우선순위 매우 낮음. 본문 자체가 한국어 번역이라 일관성 유지.

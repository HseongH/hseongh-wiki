# HseongH 위키 — Angular (AnalogJS) 사이트 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** AnalogJS 기반 정적 사이트로 HseongH 위키 콘텐츠를 렌더링하고 Cloudflare Pages 에 자동 배포한다.

**Architecture:** Angular CLI 워크스페이스를 `` 서브폴더에 스캐폴드 후 `ng add @analogjs/platform` 으로 AnalogJS 추가. 위키 콘텐츠는 `src/content/` 로 이주. Tailwind v4 로 DESIGN.md 토큰을 매핑하고 remark 플러그인 체인으로 위키링크·글로서리·코드 하이라이트를 빌드 타임에 처리. `main` 브랜치 푸시 시 Cloudflare Pages 가 SSG 빌드 후 정적 호스팅.

**Tech Stack:** Angular 21 · AnalogJS · Tailwind v4 · Shiki · pnpm · Cloudflare Pages

**Selected Spec:** [`docs/superpowers/specs/2026-05-14-angular-blog-design.md`](../specs/2026-05-14-angular-blog-design.md)

---

## File Structure

```
hseongh-wiki/                              # 프로젝트 루트 (AnalogJS)
├── angular.json
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts                         # AnalogJS Vite 설정 + remark 플러그인 체인
├── tailwind.config.ts                     # Tailwind v4 (or @theme inline)
├── public/
│   └── fonts/                             # 셀프 호스트 woff2
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles/
│   │   ├── tokens.css                     # light 토큰 (DESIGN.md → CSS vars)
│   │   ├── tokens-dark.css                # dark 토큰 도출
│   │   ├── typography.css                 # @font-face 정의
│   │   └── global.css                     # Tailwind 진입점 + reset
│   ├── content/                           # 위키 콘텐츠 이주 (Phase 2)
│   │   ├── wiki/pnpm/README.md
│   │   ├── _glossary/*.md
│   │   ├── _projects/*.md                 # 각 파일에 domain 필드 추가
│   │   └── _meta/
│   │       ├── domains.yml
│   │       ├── index.md
│   │       ├── log.md
│   │       └── STYLE.md
│   ├── app/
│   │   ├── app.component.ts               # Root layout (Header + Outlet + Footer)
│   │   ├── app.config.ts                  # AnalogJS providers + content config
│   │   ├── app.routes.ts                  # 자동 라우트 (file-based)
│   │   ├── pages/                         # 파일 기반 라우팅 (Phase 5)
│   │   │   ├── (home).page.ts
│   │   │   ├── about.page.ts
│   │   │   ├── domains/[id].page.ts
│   │   │   ├── projects/[slug].page.ts
│   │   │   ├── wiki/[...path].page.ts
│   │   │   ├── glossary/(index).page.ts
│   │   │   └── glossary/[term].page.ts
│   │   ├── components/                    # 공유 UI (Phase 4)
│   │   │   ├── header/header.component.ts
│   │   │   ├── footer/footer.component.ts
│   │   │   ├── domain-sidebar/domain-sidebar.component.ts
│   │   │   ├── post-card/post-card.component.ts
│   │   │   ├── recent-log/recent-log.component.ts
│   │   │   ├── toc/toc.component.ts
│   │   │   ├── theme-toggle/theme-toggle.component.ts
│   │   │   └── badge/badge.component.ts
│   │   └── services/
│   │       ├── theme.service.ts           # 다크 모드 관리 (Phase 6)
│   │       ├── domain.service.ts          # _meta/domains.yml 로드
│   │       └── content-index.service.ts   # 콘텐츠 카운트/필터
│   └── lib/                               # remark 플러그인 + 유틸 (Phase 3)
│       ├── remark-wikilink.ts
│       ├── remark-glossary-text.ts
│       ├── remark-toc.ts
│       └── shiki-config.ts
└── README.md                              #  개발 셋업 안내

docs/superpowers/                          # 기존
└── specs/2026-05-14-angular-blog-design.md
└── plans/2026-05-14-angular-blog-implementation.md  # this file

CLAUDE.md                                  # 갱신 (Phase 7)
README.md                                  # 갱신 (Phase 7)
.gitignore                                 # node_modules/, dist/, .DS_Store 추가
```

---

## Phase 1 — 스캐폴드 & 기반 설정

### Task 1: Angular CLI 워크스페이스 스캐폴드

**Files:**
- Create: `` 전체 (Angular CLI 자동 생성)

- [ ] **Step 1: pnpm 과 Angular CLI 확인**

Run:
```bash
pnpm --version
npx -y @angular/cli@21 version
```
Expected: pnpm v8+ 출력. Angular CLI 가 21.x 로 표시.

만약 pnpm 미설치: `npm install -g pnpm` 으로 설치 후 재시도.

- [ ] **Step 2: Angular 21 워크스페이스 스캐폴드**

Run (저장소 루트 `/home/hh4518/dev/hseongh-wiki` 에서):
```bash
npx -y @angular/cli@21 new app \
  --routing \
  --style=css \
  --strict \
  --package-manager=pnpm \
  --skip-git \
  --ssr=false \
  --defaults
```

Expected:
- `` 디렉토리가 새로 생성됨
- `package.json`, `angular.json`, `src/` 등 구조 생성
- `pnpm install` 자동 실행되어 `node_modules/` 가 채워짐

검증:
```bash
ls -la 
cat package.json | grep "@angular/core"
```
Expected: `@angular/core` 가 `^21.x.x` 표시.

만약 Angular 21 이 아직 stable 이 아니면 fallback:
```bash
npx -y @angular/cli@20 new app --routing --style=css --strict --package-manager=pnpm --skip-git --ssr=false --defaults
```

- [ ] **Step 3: dev server 가 동작하는지 확인**

Run:
```bash
pnpm start
```
Expected: `http://localhost:4200` 에서 Angular default 시작 페이지가 떠야 함.

확인 후 Ctrl+C 로 종료.

- [ ] **Step 4: .gitignore 에 app 빌드 산출물 추가**

Edit `/home/hh4518/dev/hseongh-wiki/.gitignore`, 다음 라인 추가:

```
# Angular / AnalogJS app
node_modules/
dist/
.angular/
.nx/
.vite/

# OS
.DS_Store
```

- [ ] **Step 5: 커밋**

```bash
git -C /home/hh4518/dev/hseongh-wiki add  .gitignore
git -C /home/hh4518/dev/hseongh-wiki commit -m "feat(app): Angular 21 workspace scaffold"
```

---

### Task 2: AnalogJS 플랫폼 추가

**Files:**
- Modify: `angular.json` (자동)
- Modify: `vite.config.ts` (자동 생성)
- Modify: `package.json` (자동)

- [ ] **Step 1: @analogjs/platform schematic 실행**

Run:
```bash
cd /home/hh4518/dev/hseongh-wiki
pnpm exec ng add @analogjs/platform
```

대화형 질문이 나오면 다음과 같이 답합니다:
- "Would you like to install Tailwind?" → **No** (별도 Task 에서 설정)
- "Would you like to add the analog-welcome?" → No (별도 페이지로 시작)

Expected:
- `vite.config.ts` 생성
- `angular.json` 의 builder 가 `@analogjs/platform:vite` 로 변경
- `package.json` 에 `@analogjs/platform`, `@analogjs/content` 추가

- [ ] **Step 2: dev server 가 여전히 동작하는지 확인**

Run:
```bash
pnpm dev
```
Expected: AnalogJS 가 Vite 로 dev server 를 시작. `http://localhost:5173` (또는 AnalogJS 가 지정한 포트) 에서 응답.

종료 후 다음 단계로.

- [ ] **Step 3: pnpm 락파일 + 의존성 변경 커밋**

```bash
git -C /home/hh4518/dev/hseongh-wiki add 
git -C /home/hh4518/dev/hseongh-wiki commit -m "feat(app): add AnalogJS platform"
```

---

### Task 3: Tailwind v4 설치 및 설정

**Files:**
- Create: `src/styles/global.css`
- Create: `tailwind.config.ts` (v3 의 경우) 또는 `src/styles/theme.css` (v4 CSS-first)
- Modify: `angular.json` (styles 배열에 global.css 추가)

- [ ] **Step 1: Tailwind v4 설치 (또는 호환 안 되면 v3 fallback)**

Run:
```bash
cd /home/hh4518/dev/hseongh-wiki
pnpm add -D tailwindcss@^4 @tailwindcss/postcss
pnpm add -D @tailwindcss/typography
```

호환성 검증:
```bash
pnpm exec tailwindcss --help
```
Expected: tailwindcss v4 의 help 출력.

만약 AnalogJS 와 호환 안 되면 v3 으로 변경:
```bash
pnpm remove tailwindcss @tailwindcss/postcss
pnpm add -D tailwindcss@^3 postcss autoprefixer
pnpm exec tailwindcss init -p
```

- [ ] **Step 2: global.css 생성 (Tailwind 진입점)**

Create `src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  /* DESIGN.md 토큰 매핑은 Task 4 에서 채움 */
}

/* 추후 reset / 기본 typography 가 들어갈 자리 */
html, body {
  height: 100%;
  margin: 0;
}
```

- [ ] **Step 3: angular.json 의 styles 에 등록**

Edit `angular.json`, `projects.app.architect.build.options.styles` 배열에 `src/styles/global.css` 를 추가합니다 (기존 `src/styles.css` 옆에 또는 대체):

```json
"styles": [
  "src/styles/global.css"
]
```

기존 `src/styles.css` 가 있으면 삭제:
```bash
rm -f src/styles.css
```

- [ ] **Step 4: 한 컴포넌트에서 Tailwind 클래스가 동작하는지 확인**

Edit `src/app/app.component.html` (또는 AnalogJS 의 동등한 파일), 임시로:

```html
<div class="bg-indigo-600 text-white p-4 m-4 rounded">Tailwind works</div>
<router-outlet />
```

Run:
```bash
pnpm dev
```
브라우저에서 위 div 가 인디고 배경 + 흰 텍스트로 렌더되는지 확인.

확인 후 임시 div 제거, dev server 종료.

- [ ] **Step 5: 커밋**

```bash
git -C /home/hh4518/dev/hseongh-wiki add 
git -C /home/hh4518/dev/hseongh-wiki commit -m "feat(app): Tailwind v4 + Typography plugin 설치"
```

---

### Task 4: DESIGN.md 토큰 → Tailwind 테마 매핑

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/tokens-dark.css`
- Modify: `src/styles/global.css`

- [ ] **Step 1: tokens.css 작성 (DESIGN.md 의 light 토큰)**

Create `src/styles/tokens.css`:

```css
:root {
  /* Surface */
  --color-surface: #faf8ff;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #f2f3ff;
  --color-surface-container: #eaedff;
  --color-surface-container-high: #e2e7ff;
  --color-surface-container-highest: #dae2fd;
  --color-on-surface: #131b2e;
  --color-on-surface-variant: #464553;
  --color-inverse-surface: #283044;
  --color-inverse-on-surface: #eef0ff;

  /* Primary */
  --color-primary: #3730A3;
  --color-on-primary: #ffffff;
  --color-primary-container: #3730a3;
  --color-on-primary-container: #a9a7ff;
  --color-inverse-primary: #c3c0ff;

  /* Secondary / Tertiary / Error */
  --color-secondary: #4648d4;
  --color-on-secondary: #ffffff;
  --color-tertiary: #511c00;
  --color-on-tertiary: #ffffff;
  --color-error: #ba1a1a;
  --color-on-error: #ffffff;

  /* Outline / Borders */
  --color-outline: #777584;
  --color-outline-variant: #c8c4d5;

  /* Layout */
  --max-width-article: 720px;
  --max-width-site: 1200px;
  --spacing-gutter: 24px;

  /* Radius */
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
}
```

- [ ] **Step 2: tokens-dark.css 작성 (dark 도출)**

Create `src/styles/tokens-dark.css`:

```css
html.dark {
  /* Surface — light 의 흰 계조 → indigo-tinted 슬레이트 */
  --color-surface: #0F1428;
  --color-surface-container-lowest: #0a0f20;
  --color-surface-container-low: #131934;
  --color-surface-container: #1A1F35;
  --color-surface-container-high: #232847;
  --color-surface-container-highest: #2c3158;
  --color-on-surface: #EEF0FF;
  --color-on-surface-variant: #c8c4d5;
  --color-inverse-surface: #eef0ff;
  --color-inverse-on-surface: #131b2e;

  /* Primary — light 의 inverse-primary 활용 */
  --color-primary: #c3c0ff;
  --color-on-primary: #1f108e;
  --color-primary-container: #3b35a7;
  --color-on-primary-container: #e2dfff;
  --color-inverse-primary: #3730A3;

  /* Outline */
  --color-outline: #5a5868;
  --color-outline-variant: #3b3a48;
}
```

- [ ] **Step 3: global.css 에서 토큰을 Tailwind theme 으로 등록**

Edit `src/styles/global.css`:

```css
@import "tailwindcss";
@import "./tokens.css";
@import "./tokens-dark.css";

@theme {
  /* 색상 — CSS variable 로 dark 모드 자동 전환 */
  --color-surface: var(--color-surface);
  --color-surface-low: var(--color-surface-container-low);
  --color-surface-high: var(--color-surface-container-high);
  --color-on-surface: var(--color-on-surface);
  --color-on-surface-variant: var(--color-on-surface-variant);
  --color-primary: var(--color-primary);
  --color-on-primary: var(--color-on-primary);
  --color-outline: var(--color-outline);
  --color-outline-variant: var(--color-outline-variant);

  /* 폰트 — Task 5 에서 woff2 로 정의 */
  --font-display: "Hanken Grotesk", system-ui, sans-serif;
  --font-body: "Source Serif 4", Georgia, serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  /* 둥글기 */
  --radius-sm: 0.125rem;
  --radius: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;

  /* 최대 너비 */
  --container-article: 720px;
  --container-site: 1200px;
}

html, body { height: 100%; margin: 0; }
body {
  background: var(--color-surface);
  color: var(--color-on-surface);
  font-family: var(--font-body);
}
```

Tailwind v3 의 경우는 `tailwind.config.ts` 의 `theme.extend.colors` / `fontFamily` 로 등록.

- [ ] **Step 4: dark 모드 토글 수동 검증**

dev server 띄우고 브라우저 콘솔에서:
```js
document.documentElement.classList.add('dark')
```
실행 시 배경/텍스트 색이 다크 변형으로 바뀌는지 확인.
```js
document.documentElement.classList.remove('dark')
```
로 원복 확인. (자동 토글은 Phase 6.)

- [ ] **Step 5: 커밋**

```bash
git -C /home/hh4518/dev/hseongh-wiki add 
git -C /home/hh4518/dev/hseongh-wiki commit -m "feat(style): DESIGN.md tokens → Tailwind theme 매핑 (light + dark)"
```

---

### Task 5: 폰트 셀프 호스트

**Files:**
- Create: `public/fonts/` (woff2 파일들)
- Create: `src/styles/typography.css`
- Modify: `src/styles/global.css`

- [ ] **Step 1: woff2 다운로드**

다음 폰트를 google-webfonts-helper (https://gwfh.mranftl.com/fonts) 등에서 woff2 형식으로 다운로드합니다. 또는 npm 패키지(`@fontsource/hanken-grotesk`, `@fontsource/source-serif-4`, `@fontsource/jetbrains-mono`)를 활용해 빠르게 처리할 수 있습니다.

권장: `@fontsource` 사용. Run:
```bash
cd /home/hh4518/dev/hseongh-wiki
pnpm add @fontsource/hanken-grotesk @fontsource/source-serif-4 @fontsource/jetbrains-mono
```

이 경우 woff2 는 `node_modules` 에서 import 됩니다. `public/fonts/` 사용은 생략 가능.

- [ ] **Step 2: typography.css 작성**

Create `src/styles/typography.css`:

```css
/* Hanken Grotesk — UI/Display */
@import '@fontsource/hanken-grotesk/400.css';
@import '@fontsource/hanken-grotesk/500.css';
@import '@fontsource/hanken-grotesk/600.css';
@import '@fontsource/hanken-grotesk/700.css';

/* Source Serif 4 — Body */
@import '@fontsource/source-serif-4/400.css';
@import '@fontsource/source-serif-4/600.css';

/* JetBrains Mono — Code */
@import '@fontsource/jetbrains-mono/400.css';
@import '@fontsource/jetbrains-mono/500.css';

/* 기본 typography 스케일 — DESIGN.md 의 headline / body / label / code 매핑 */
.headline-xl { font-family: var(--font-display); font-size: 48px; font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; }
.headline-lg { font-family: var(--font-display); font-size: 32px; font-weight: 600; line-height: 1.2; }
.headline-md { font-family: var(--font-display); font-size: 24px; font-weight: 600; line-height: 1.3; }
.body-lg { font-family: var(--font-body); font-size: 20px; line-height: 1.7; }
.body-md { font-family: var(--font-body); font-size: 18px; line-height: 1.6; }
.label-md { font-family: var(--font-display); font-size: 14px; font-weight: 500; line-height: 1.4; letter-spacing: 0.02em; }
.code { font-family: var(--font-mono); font-size: 15px; line-height: 1.5; }

@media (max-width: 768px) {
  .headline-xl { font-size: 36px; line-height: 1.2; letter-spacing: -0.01em; }
}
```

- [ ] **Step 3: global.css 에서 import**

Edit `src/styles/global.css`, 상단에 추가:

```css
@import "./typography.css";
```

- [ ] **Step 4: 시각 검증**

`src/app/app.component.html` 에 임시 마크업 추가:

```html
<div class="m-8">
  <h1 class="headline-xl">Headline XL — Hanken Grotesk</h1>
  <p class="body-lg">Body Large — Source Serif 4</p>
  <code class="code">console.log("JetBrains Mono")</code>
</div>
<router-outlet />
```

`pnpm dev` 로 확인. 세 폰트가 모두 적용되는지.

확인 후 임시 마크업 제거.

- [ ] **Step 5: 커밋**

```bash
git -C /home/hh4518/dev/hseongh-wiki add 
git -C /home/hh4518/dev/hseongh-wiki commit -m "feat(style): self-host 폰트 (Hanken Grotesk, Source Serif 4, JetBrains Mono)"
```

---

## Phase 2 — 콘텐츠 이주

### Task 6: 콘텐츠 디렉토리 이주

**Files:**
- Move: 루트의 `wiki/`, `_glossary/`, `_projects/`, `index.md`, `log.md`, `STYLE.md` → `src/content/`

- [ ] **Step 1: src/content/ 디렉토리 생성**

```bash
cd /home/hh4518/dev/hseongh-wiki
mkdir -p src/content/_meta
```

- [ ] **Step 2: 콘텐츠 파일 이동**

```bash
git mv wiki src/content/wiki
git mv _glossary src/content/_glossary
git mv _projects src/content/_projects
git mv index.md src/content/_meta/index.md
git mv log.md src/content/_meta/log.md
git mv STYLE.md src/content/_meta/STYLE.md
```

확인:
```bash
ls src/content/
ls src/content/_meta/
```
Expected: `wiki/`, `_glossary/`, `_projects/`, `_meta/` 가 보이고 _meta 에 index.md / log.md / STYLE.md 가 있어야 함.

- [ ] **Step 3: 기존 .gitkeep 제거 (실제 콘텐츠로 채워졌으므로)**

```bash
rm -f src/content/_glossary/.gitkeep
rm -f src/content/_projects/.gitkeep
rm -f src/content/wiki/.gitkeep
```

- [ ] **Step 4: 커밋**

```bash
git -C /home/hh4518/dev/hseongh-wiki add -A src/content/
git -C /home/hh4518/dev/hseongh-wiki commit -m "refactor: 위키 콘텐츠를 src/content/ 로 이주"
```

---

### Task 7: domains.yml 작성 + 프로젝트에 domain 추가

**Files:**
- Create: `src/content/_meta/domains.yml`
- Modify: `src/content/_projects/pnpm.md`

- [ ] **Step 1: domains.yml 작성**

Create `src/content/_meta/domains.yml`:

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

- [ ] **Step 2: pnpm 프로젝트 카드에 domain 추가**

Edit `src/content/_projects/pnpm.md`, frontmatter 의 `last_ingest` 위에 추가:

```yaml
---
project: pnpm
name: pnpm
summary: 디스크 효율적인 Node.js 패키지 매니저
domain: tooling
source_repo: https://github.com/pnpm/pnpm
official_site: https://pnpm.io
last_ingest: 2026-05-14
---
```

`name` 과 `summary` 필드도 신규로 추가합니다 (디자인의 카드/페이지에서 사용).

- [ ] **Step 3: 커밋**

```bash
git -C /home/hh4518/dev/hseongh-wiki add src/content/_meta/domains.yml src/content/_projects/pnpm.md
git -C /home/hh4518/dev/hseongh-wiki commit -m "feat(content): 도메인 카탈로그 + 프로젝트 카드 domain 필드"
```

---

### Task 8: AnalogJS content config (콘텐츠 경로 등록)

**Files:**
- Modify: `vite.config.ts`
- Modify: `src/app/app.config.ts`

- [ ] **Step 1: vite.config.ts 에 content 경로 명시**

Edit `vite.config.ts`, `@analogjs/platform` 설정에 `content` 옵션을 추가합니다:

```typescript
import { defineConfig } from 'vite';
import analog from '@analogjs/platform';

export default defineConfig(({ mode }) => ({
  plugins: [
    analog({
      content: {
        prismatic: false,  // Shiki 를 별도로 쓸 것
      },
      static: true,
    }),
  ],
}));
```

기본값으로 `src/content/` 를 읽기 때문에 별도 path 설정 불필요.

- [ ] **Step 2: app.config.ts 에 provideContent 등록**

Edit `src/app/app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { withInMemoryScrolling } from '@angular/router';
import { provideFileRouter } from '@analogjs/router';
import { provideContent, withMarkdownRenderer } from '@analogjs/content';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFileRouter(
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })
    ),
    provideContent(withMarkdownRenderer()),
  ],
};
```

- [ ] **Step 3: dev server 로 동작 확인**

```bash
cd /home/hh4518/dev/hseongh-wiki
pnpm dev
```
Expected: 에러 없이 시작. (페이지 컴포넌트는 아직이지만 빌드는 통과해야 함.)

- [ ] **Step 4: 커밋**

```bash
git -C /home/hh4518/dev/hseongh-wiki add vite.config.ts src/app/app.config.ts
git -C /home/hh4518/dev/hseongh-wiki commit -m "feat(app): AnalogJS content + file-based router 등록"
```

---

## Phase 3 — Markdown 처리 파이프라인 (remark 플러그인)

### Task 9: remark-wikilink 플러그인

**Files:**
- Create: `src/lib/remark-wikilink.ts`
- Test: `src/lib/remark-wikilink.test.ts`

- [ ] **Step 1: vitest 설치 (없으면)**

```bash
cd /home/hh4518/dev/hseongh-wiki
pnpm add -D vitest @vitest/ui unified remark-parse remark-stringify
```

- [ ] **Step 2: 실패하는 테스트 작성**

Create `src/lib/remark-wikilink.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { remarkWikilink } from './remark-wikilink';

const transform = async (markdown: string) => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkWikilink, {
      glossaryLookup: { promise: { korean: '프로미스' } },
      wikiLookup: { 'pnpm/README': { title: 'pnpm' } },
      projectLookup: { pnpm: { name: 'pnpm' } },
    })
    .use(remarkStringify)
    .process(markdown);
  return String(result);
};

describe('remark-wikilink', () => {
  it('글로서리 위키링크는 한국어 정착어 텍스트로 변환', async () => {
    const out = await transform('See [[_glossary/promise]] for details.');
    expect(out).toContain('[프로미스](/glossary/promise)');
  });

  it('본문 위키링크는 페이지 제목 텍스트로 변환', async () => {
    const out = await transform('See [[wiki/pnpm/README]].');
    expect(out).toContain('[pnpm](/wiki/pnpm/README)');
  });

  it('프로젝트 위키링크는 프로젝트 이름 텍스트로 변환', async () => {
    const out = await transform('See [[_projects/pnpm]].');
    expect(out).toContain('[pnpm](/projects/pnpm)');
  });

  it('알 수 없는 위키링크는 raw 경로를 텍스트로 사용', async () => {
    const out = await transform('See [[unknown/target]].');
    expect(out).toContain('[unknown/target](/unknown/target)');
  });
});
```

- [ ] **Step 3: 테스트 실행하여 실패 확인**

```bash
pnpm exec vitest run src/lib/remark-wikilink.test.ts
```
Expected: FAIL — `remark-wikilink` 모듈을 찾을 수 없음.

- [ ] **Step 4: remark-wikilink.ts 구현**

Create `src/lib/remark-wikilink.ts`:

```typescript
import type { Plugin } from 'unified';
import type { Root, Text } from 'mdast';
import { visit } from 'unist-util-visit';

export interface WikilinkOptions {
  glossaryLookup: Record<string, { korean: string }>;
  wikiLookup: Record<string, { title: string }>;
  projectLookup: Record<string, { name: string }>;
}

const WIKILINK_PATTERN = /\[\[([^\]]+)\]\]/g;

export const remarkWikilink: Plugin<[WikilinkOptions], Root> = (options) => {
  return (tree) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || index == null) return;
      const matches = [...node.value.matchAll(WIKILINK_PATTERN)];
      if (matches.length === 0) return;

      const newNodes: any[] = [];
      let lastEnd = 0;

      for (const match of matches) {
        const start = match.index!;
        const end = start + match[0].length;
        const target = match[1];

        if (start > lastEnd) {
          newNodes.push({ type: 'text', value: node.value.slice(lastEnd, start) });
        }

        const { url, text } = resolveTarget(target, options);
        newNodes.push({
          type: 'link',
          url,
          children: [{ type: 'text', value: text }],
        });

        lastEnd = end;
      }

      if (lastEnd < node.value.length) {
        newNodes.push({ type: 'text', value: node.value.slice(lastEnd) });
      }

      parent.children.splice(index, 1, ...newNodes);
    });
  };
};

function resolveTarget(
  target: string,
  options: WikilinkOptions
): { url: string; text: string } {
  // _glossary/<term>
  if (target.startsWith('_glossary/')) {
    const term = target.slice('_glossary/'.length);
    const entry = options.glossaryLookup[term];
    return {
      url: `/glossary/${term}`,
      text: entry?.korean ?? term,
    };
  }

  // _projects/<slug>
  if (target.startsWith('_projects/')) {
    const slug = target.slice('_projects/'.length);
    const entry = options.projectLookup[slug];
    return {
      url: `/projects/${slug}`,
      text: entry?.name ?? slug,
    };
  }

  // wiki/<project>/<path>
  if (target.startsWith('wiki/')) {
    const path = target.slice('wiki/'.length);
    const entry = options.wikiLookup[path];
    return {
      url: `/wiki/${path}`,
      text: entry?.title ?? path,
    };
  }

  // unknown
  return { url: `/${target}`, text: target };
}
```

- [ ] **Step 5: 테스트 통과 확인**

```bash
pnpm exec vitest run src/lib/remark-wikilink.test.ts
```
Expected: PASS — 4개 테스트 모두 통과.

- [ ] **Step 6: 커밋**

```bash
git -C /home/hh4518/dev/hseongh-wiki add src/lib/remark-wikilink.ts src/lib/remark-wikilink.test.ts package.json pnpm-lock.yaml
git -C /home/hh4518/dev/hseongh-wiki commit -m "feat(lib): remark-wikilink 플러그인"
```

---

### Task 10: Shiki 코드 하이라이트 설정

**Files:**
- Create: `src/lib/shiki-config.ts`
- Modify: `vite.config.ts`

- [ ] **Step 1: Shiki 와 rehype-shiki 설치**

```bash
cd /home/hh4518/dev/hseongh-wiki
pnpm add shiki @shikijs/rehype
```

- [ ] **Step 2: shiki-config.ts 작성**

Create `src/lib/shiki-config.ts`:

```typescript
import rehypeShiki from '@shikijs/rehype';

export const shikiPlugin = [
  rehypeShiki,
  {
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    defaultColor: false, // CSS 변수로 light/dark 토글 (html.dark 클래스 기반)
  },
] as const;
```

- [ ] **Step 3: vite.config.ts 에 적용**

Edit `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import { remarkWikilink } from './src/lib/remark-wikilink';
import { shikiPlugin } from './src/lib/shiki-config';
import { buildLookups } from './src/lib/build-lookups';

export default defineConfig(({ mode }) => {
  const lookups = buildLookups();  // Task 11 에서 구현
  return {
    plugins: [
      analog({
        content: {
          prismatic: false,
        },
        markdown: {
          remarkPlugins: [
            [remarkWikilink, lookups],
          ],
          rehypePlugins: [
            shikiPlugin,
          ],
        },
        static: true,
      }),
    ],
  };
});
```

- [ ] **Step 4: dev server 로 빌드 통과 확인**

```bash
pnpm dev
```
Expected: 에러 없이 시작. (`buildLookups` 가 미구현이면 임시로 빈 객체 리턴.)

임시 stub `src/lib/build-lookups.ts`:
```typescript
export function buildLookups() {
  return {
    glossaryLookup: {},
    wikiLookup: {},
    projectLookup: {},
  };
}
```

- [ ] **Step 5: 커밋**

```bash
git -C /home/hh4518/dev/hseongh-wiki add 
git -C /home/hh4518/dev/hseongh-wiki commit -m "feat(lib): Shiki 코드 하이라이터 + remark/rehype 체인 연결"
```

---

### Task 11: build-lookups — 콘텐츠 인덱스 빌드 시 생성

**Files:**
- Create: `src/lib/build-lookups.ts`
- Test: `src/lib/build-lookups.test.ts`

- [ ] **Step 1: gray-matter 설치 (frontmatter 파싱)**

```bash
pnpm add gray-matter
```

- [ ] **Step 2: 실패하는 테스트 작성**

Create `src/lib/build-lookups.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { buildLookups } from './build-lookups';

describe('buildLookups', () => {
  it('실제 src/content/ 로부터 lookup 을 생성한다', () => {
    const lookups = buildLookups();
    expect(lookups.projectLookup['pnpm']).toBeDefined();
    expect(lookups.projectLookup['pnpm'].name).toBe('pnpm');
    expect(lookups.glossaryLookup['promise']).toBeDefined();
    expect(lookups.glossaryLookup['promise'].korean).toBe('프로미스');
    expect(lookups.wikiLookup['pnpm/README']).toBeDefined();
  });
});
```

- [ ] **Step 3: 테스트 실행하여 실패 확인**

```bash
pnpm exec vitest run src/lib/build-lookups.test.ts
```
Expected: FAIL — `buildLookups` 가 빈 객체 리턴.

- [ ] **Step 4: build-lookups.ts 구현**

Replace `src/lib/build-lookups.ts` with:

```typescript
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import matter from 'gray-matter';

const CONTENT_ROOT = join(__dirname, '../content');

export interface Lookups {
  glossaryLookup: Record<string, { korean: string }>;
  wikiLookup: Record<string, { title: string }>;
  projectLookup: Record<string, { name: string }>;
}

export function buildLookups(): Lookups {
  return {
    glossaryLookup: scanGlossary(),
    wikiLookup: scanWiki(),
    projectLookup: scanProjects(),
  };
}

function scanGlossary(): Lookups['glossaryLookup'] {
  const dir = join(CONTENT_ROOT, '_glossary');
  const out: Lookups['glossaryLookup'] = {};
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const slug = file.replace(/\.md$/, '');
    const { data } = matter(readFileSync(join(dir, file), 'utf8'));
    out[slug] = { korean: data.korean ?? slug };
  }
  return out;
}

function scanProjects(): Lookups['projectLookup'] {
  const dir = join(CONTENT_ROOT, '_projects');
  const out: Lookups['projectLookup'] = {};
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const slug = file.replace(/\.md$/, '');
    const { data } = matter(readFileSync(join(dir, file), 'utf8'));
    out[slug] = { name: data.name ?? slug };
  }
  return out;
}

function scanWiki(): Lookups['wikiLookup'] {
  const dir = join(CONTENT_ROOT, 'wiki');
  const out: Lookups['wikiLookup'] = {};
  walk(dir, (filePath) => {
    if (!filePath.endsWith('.md')) return;
    const rel = relative(dir, filePath).replace(/\.md$/, '');
    const { data, content } = matter(readFileSync(filePath, 'utf8'));
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch?.[1]?.trim() ?? data.project ?? rel;
    out[rel] = { title };
  });
  return out;
}

function walk(dir: string, cb: (path: string) => void) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, cb);
    else cb(full);
  }
}
```

- [ ] **Step 5: 테스트 통과 확인**

```bash
pnpm exec vitest run src/lib/build-lookups.test.ts
```
Expected: PASS.

- [ ] **Step 6: 커밋**

```bash
git -C /home/hh4518/dev/hseongh-wiki add src/lib/build-lookups.ts src/lib/build-lookups.test.ts package.json pnpm-lock.yaml
git -C /home/hh4518/dev/hseongh-wiki commit -m "feat(lib): 빌드 타임 콘텐츠 lookup 인덱스"
```

---

## Phase 4 — 공유 UI 컴포넌트

### Task 12: Theme service + theme toggle

**Files:**
- Create: `src/app/services/theme.service.ts`
- Test: `src/app/services/theme.service.spec.ts`
- Create: `src/app/components/theme-toggle/theme-toggle.component.ts`

- [ ] **Step 1: 실패하는 테스트 작성 (ThemeService)**

Create `src/app/services/theme.service.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    TestBed.configureTestingModule({});
  });

  it('초기에 localStorage 가 비어있고 prefers-color-scheme dark 면 dark 적용', () => {
    const service = TestBed.inject(ThemeService);
    service.init();
    // jsdom 은 prefers-color-scheme 시뮬레이션이 제한적 — 직접 setTheme 으로 검증
    service.setTheme('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggle 은 dark <-> light 를 전환한다', () => {
    const service = TestBed.inject(ThemeService);
    service.setTheme('light');
    service.toggle();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    service.toggle();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('setTheme 은 localStorage 에 저장한다', () => {
    const service = TestBed.inject(ThemeService);
    service.setTheme('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
```

- [ ] **Step 2: 테스트 실행하여 실패 확인**

```bash
pnpm exec ng test --watch=false
```
Expected: FAIL — `ThemeService` 미구현.

- [ ] **Step 3: ThemeService 구현**

Create `src/app/services/theme.service.ts`:

```typescript
import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>('light');

  init(): void {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      this.setTheme(stored);
      return;
    }
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    this.setTheme(prefersDark ? 'dark' : 'light');
  }

  setTheme(t: Theme): void {
    this.theme.set(t);
    localStorage.setItem('theme', t);
    document.documentElement.classList.toggle('dark', t === 'dark');
  }

  toggle(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
pnpm exec ng test --watch=false
```
Expected: PASS.

- [ ] **Step 5: ThemeToggle 컴포넌트 작성**

Create `src/app/components/theme-toggle/theme-toggle.component.ts`:

```typescript
import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button
      type="button"
      class="rounded p-2 hover:bg-surface-high focus:outline focus:outline-2 focus:outline-primary"
      [attr.aria-label]="theme.theme() === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'"
      (click)="theme.toggle()"
    >
      @if (theme.theme() === 'dark') {
        <span>☀</span>
      } @else {
        <span>🌙</span>
      }
    </button>
  `,
})
export class ThemeToggleComponent {
  theme = inject(ThemeService);
}
```

- [ ] **Step 6: 앱 시작 시 ThemeService.init() 호출**

Edit `src/main.ts` (또는 app.component.ts 의 constructor):

```typescript
// main.ts 또는 app initializer 영역에서
import { ThemeService } from './app/services/theme.service';

// bootstrapApplication 직후
inject(ThemeService).init();
```

또는 `app.component.ts` 의 `constructor` 에서:
```typescript
constructor(theme: ThemeService) {
  theme.init();
}
```

- [ ] **Step 7: 커밋**

```bash
git -C /home/hh4518/dev/hseongh-wiki add src/app/services/theme.service.ts src/app/services/theme.service.spec.ts src/app/components/theme-toggle/ src/main.ts src/app/app.component.ts
git -C /home/hh4518/dev/hseongh-wiki commit -m "feat(ui): ThemeService + ThemeToggle 컴포넌트"
```

---

### Task 13: Header 컴포넌트

**Files:**
- Create: `src/app/components/header/header.component.ts`

- [ ] **Step 1: Header 컴포넌트 작성**

Create `src/app/components/header/header.component.ts`:

```typescript
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ThemeToggleComponent],
  template: `
    <header class="sticky top-0 z-50 border-b border-outline-variant bg-surface/95 backdrop-blur">
      <div class="mx-auto flex max-w-(--container-site) items-center justify-between px-6 py-4">
        <a routerLink="/" class="font-display text-xl font-bold tracking-tight">HseongH</a>
        <nav class="flex items-center gap-6">
          <a routerLink="/" routerLinkActive="text-primary" [routerLinkActiveOptions]="{ exact: true }" class="label-md hover:text-primary">Home</a>
          <a routerLink="/glossary" routerLinkActive="text-primary" class="label-md hover:text-primary">Glossary</a>
          <a routerLink="/about" routerLinkActive="text-primary" class="label-md hover:text-primary">About</a>
          <app-theme-toggle />
        </nav>
      </div>
    </header>
  `,
})
export class HeaderComponent {}
```

- [ ] **Step 2: 컴포넌트 sanity test (Karma)**

Create `src/app/components/header/header.component.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  it('렌더 시 로고 HseongH 가 보인다', async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('HseongH');
  });
});
```

- [ ] **Step 3: 테스트 실행**

```bash
pnpm exec ng test --watch=false
```
Expected: PASS.

- [ ] **Step 4: app.component.html 에 Header 통합**

Edit `src/app/app.component.ts`:

```typescript
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header />
    <router-outlet />
  `,
})
export class AppComponent {
  constructor(theme: ThemeService) {
    theme.init();
  }
}
```

- [ ] **Step 5: dev 로 시각 검증**

```bash
pnpm dev
```
헤더가 보이고 다크 모드 토글이 동작하는지 확인.

- [ ] **Step 6: 커밋**

```bash
git -C /home/hh4518/dev/hseongh-wiki add src/app/components/header/ src/app/app.component.ts
git -C /home/hh4518/dev/hseongh-wiki commit -m "feat(ui): Header 컴포넌트 + 다크 토글 통합"
```

---

### Task 14: Footer 컴포넌트

**Files:**
- Create: `src/app/components/footer/footer.component.ts`

- [ ] **Step 1: Footer 작성**

Create `src/app/components/footer/footer.component.ts`:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="mt-16 border-t border-outline-variant py-8 text-on-surface-variant">
      <div class="mx-auto flex max-w-(--container-site) items-center justify-between px-6 label-md">
        <span>© 2026 HseongH</span>
        <a href="https://github.com/HseongH/hseongh-wiki" target="_blank" rel="noopener" class="hover:text-primary">GitHub</a>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
```

- [ ] **Step 2: AppComponent 에 통합**

Edit `src/app/app.component.ts`, `imports` 와 template 갱신:

```typescript
imports: [RouterOutlet, HeaderComponent, FooterComponent],
template: `
  <app-header />
  <main class="min-h-[60vh]"><router-outlet /></main>
  <app-footer />
`,
```

- [ ] **Step 3: 시각 검증 후 커밋**

```bash
pnpm dev   # 푸터 보이는지 확인
git -C /home/hh4518/dev/hseongh-wiki add src/app/components/footer/ src/app/app.component.ts
git -C /home/hh4518/dev/hseongh-wiki commit -m "feat(ui): Footer 컴포넌트"
```

---

### Task 15: Badge + PostCard 컴포넌트

**Files:**
- Create: `src/app/components/badge/badge.component.ts`
- Create: `src/app/components/post-card/post-card.component.ts`

- [ ] **Step 1: Badge 컴포넌트 (재사용 가능한 작은 라벨)**

Create `src/app/components/badge/badge.component.ts`:

```typescript
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span
      class="inline-flex items-center rounded px-2 py-0.5 text-xs uppercase tracking-wide"
      [class.bg-primary-container]="variant() === 'primary'"
      [class.text-on-primary-container]="variant() === 'primary'"
      [class.bg-surface-high]="variant() === 'neutral'"
      [class.text-on-surface-variant]="variant() === 'neutral'"
    >
      <ng-content />
    </span>
  `,
})
export class BadgeComponent {
  variant = input<'primary' | 'neutral'>('neutral');
}
```

- [ ] **Step 2: PostCard 컴포넌트**

Create `src/app/components/post-card/post-card.component.ts`:

```typescript
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../badge/badge.component';

export interface PostCardData {
  title: string;
  excerpt: string;
  project: string;
  translatedAt: string;
  href: string;
}

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [RouterLink, BadgeComponent],
  template: `
    <a
      [routerLink]="post().href"
      class="block rounded-lg border border-outline-variant bg-surface-lowest p-6 transition hover:shadow-[0px_4px_20px_rgba(15,23,42,0.05)]"
    >
      <app-badge variant="primary">{{ post().project }}</app-badge>
      <h3 class="headline-md mt-3 line-clamp-2">{{ post().title }}</h3>
      <p class="body-md mt-2 line-clamp-3 text-on-surface-variant">{{ post().excerpt }}</p>
      <time class="label-md mt-4 block text-on-surface-variant">{{ post().translatedAt }}</time>
    </a>
  `,
})
export class PostCardComponent {
  post = input.required<PostCardData>();
}
```

- [ ] **Step 3: 두 컴포넌트 sanity test**

Create `src/app/components/post-card/post-card.component.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PostCardComponent } from './post-card.component';

describe('PostCardComponent', () => {
  it('post 데이터의 title, excerpt, project 를 렌더한다', async () => {
    await TestBed.configureTestingModule({
      imports: [PostCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(PostCardComponent);
    fixture.componentRef.setInput('post', {
      title: '테스트 제목',
      excerpt: '테스트 본문',
      project: 'pnpm',
      translatedAt: '2026-05-14',
      href: '/wiki/pnpm/README',
    });
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('테스트 제목');
    expect(text).toContain('테스트 본문');
    expect(text).toContain('pnpm');
  });
});
```

Run `pnpm exec ng test --watch=false` → PASS.

- [ ] **Step 4: 커밋**

```bash
git -C /home/hh4518/dev/hseongh-wiki add src/app/components/badge/ src/app/components/post-card/
git -C /home/hh4518/dev/hseongh-wiki commit -m "feat(ui): Badge + PostCard 컴포넌트"
```

---

### Task 16: DomainSidebar 컴포넌트 + DomainService

**Files:**
- Create: `src/app/services/domain.service.ts`
- Create: `src/app/components/domain-sidebar/domain-sidebar.component.ts`

- [ ] **Step 1: DomainService 작성**

Create `src/app/services/domain.service.ts`:

```typescript
import { Injectable, inject } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';

export interface DomainEntry {
  id: string;
  name: string;
  summary: string;
}

export interface ProjectAttributes {
  project: string;
  name: string;
  summary?: string;
  domain: string;
}

export interface WikiAttributes {
  project: string;
  translated_at: string;
}

@Injectable({ providedIn: 'root' })
export class DomainService {
  private projects = injectContentFiles<ProjectAttributes>((f) =>
    f.filename.startsWith('/src/content/_projects/')
  );
  private wikiPages = injectContentFiles<WikiAttributes>((f) =>
    f.filename.startsWith('/src/content/wiki/')
  );

  // domains.yml 은 빌드 타임 import 또는 vite-plugin-yaml 로 처리
  // 여기서는 정적 import 가정
  private readonly domainCatalog: DomainEntry[] = [
    { id: 'frontend', name: 'Frontend', summary: 'UI 프레임워크, CSS, 브라우저' },
    { id: 'backend', name: 'Backend', summary: '서버 런타임, API' },
    { id: 'devops', name: 'DevOps', summary: '컨테이너, CI/CD, 인프라' },
    { id: 'tooling', name: 'Tooling', summary: '빌드 도구, 패키지 매니저, 에디터' },
    { id: 'language', name: 'Languages', summary: '프로그래밍 언어 자체' },
  ];

  listDomains(): Array<DomainEntry & { count: number }> {
    return this.domainCatalog.map((d) => {
      const projectSlugs = this.projects
        .filter((p) => p.attributes.domain === d.id)
        .map((p) => p.attributes.project);
      const count = this.wikiPages.filter((w) =>
        projectSlugs.includes(w.attributes.project)
      ).length;
      return { ...d, count };
    });
  }
}
```

> 주의: `domains.yml` 의 정적 import 방식은 후속 작업에서 vite-plugin-yaml 도입으로 개선 가능. 지금은 하드코딩으로 시작 (yml 과 동기화 필요).

- [ ] **Step 2: DomainSidebar 컴포넌트**

Create `src/app/components/domain-sidebar/domain-sidebar.component.ts`:

```typescript
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DomainService } from '../../services/domain.service';

@Component({
  selector: 'app-domain-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="w-56">
      <h2 class="label-md mb-3 text-on-surface-variant uppercase tracking-wide">Categories</h2>
      <ul class="space-y-1">
        @for (d of domains; track d.id) {
          <li>
            <a
              [routerLink]="['/domains', d.id]"
              routerLinkActive="bg-surface-high text-primary"
              class="flex items-center justify-between rounded px-3 py-2 hover:bg-surface-low"
            >
              <span class="label-md">{{ d.name }}</span>
              <span class="label-md text-on-surface-variant">{{ d.count }}</span>
            </a>
          </li>
        }
      </ul>
    </aside>
  `,
})
export class DomainSidebarComponent {
  domains = inject(DomainService).listDomains();
}
```

- [ ] **Step 3: 커밋**

```bash
git -C /home/hh4518/dev/hseongh-wiki add src/app/services/domain.service.ts src/app/components/domain-sidebar/
git -C /home/hh4518/dev/hseongh-wiki commit -m "feat(ui): DomainService + DomainSidebar 컴포넌트"
```

---

## Phase 5 — 페이지 컴포넌트

### Task 17: 홈 페이지

**Files:**
- Create: `src/app/pages/(home).page.ts`

- [ ] **Step 1: 홈 페이지 작성**

Create `src/app/pages/(home).page.ts`:

```typescript
import { Component, inject } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import { DomainSidebarComponent } from '../components/domain-sidebar/domain-sidebar.component';
import { PostCardComponent, PostCardData } from '../components/post-card/post-card.component';

interface WikiAttrs {
  project: string;
  translated_at: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [DomainSidebarComponent, PostCardComponent],
  template: `
    <section class="mx-auto grid max-w-(--container-site) grid-cols-[14rem_1fr] gap-8 px-6 py-12">
      <app-domain-sidebar />
      <div>
        <h1 class="headline-lg mb-6">최근 게시글</h1>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          @for (p of posts; track p.href) {
            <app-post-card [post]="p" />
          }
        </div>
      </div>
    </section>
  `,
})
export default class HomePage {
  private files = injectContentFiles<WikiAttrs>((f) =>
    f.filename.startsWith('/src/content/wiki/')
  );

  posts: PostCardData[] = this.files
    .sort((a, b) =>
      (b.attributes.translated_at ?? '').localeCompare(a.attributes.translated_at ?? '')
    )
    .slice(0, 12)
    .map((f) => ({
      title: this.extractTitle(f.content),
      excerpt: this.extractExcerpt(f.content),
      project: f.attributes.project,
      translatedAt: f.attributes.translated_at,
      href: f.slug?.replace(/^\/src\/content/, '') ?? '/',
    }));

  private extractTitle(md: string): string {
    return md.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? '제목 없음';
  }

  private extractExcerpt(md: string): string {
    const para = md
      .split('\n\n')
      .find((b) => b.trim() && !b.startsWith('#') && !b.startsWith('---') && !b.startsWith('>'));
    return (para ?? '').replace(/\s+/g, ' ').slice(0, 160);
  }
}
```

- [ ] **Step 2: dev 로 확인**

```bash
pnpm dev
```
`http://localhost:5173` 에서:
- 헤더 / 푸터
- 좌측에 도메인 사이드바 (Tooling 카운트=1)
- 메인에 pnpm README 카드 1개

- [ ] **Step 3: 커밋**

```bash
git -C /home/hh4518/dev/hseongh-wiki add src/app/pages/
git -C /home/hh4518/dev/hseongh-wiki commit -m "feat(page): 홈 페이지 (최근 게시글 + 도메인 사이드바)"
```

---

### Task 18: 아티클 페이지 (`/wiki/:project/*`)

**Files:**
- Create: `src/app/pages/wiki/[...path].page.ts`
- Create: `src/app/components/toc/toc.component.ts`

- [ ] **Step 1: TOC 컴포넌트 작성**

Create `src/app/components/toc/toc.component.ts`:

```typescript
import { Component, input } from '@angular/core';

export interface TocEntry {
  level: number;
  text: string;
  id: string;
}

@Component({
  selector: 'app-toc',
  standalone: true,
  template: `
    <nav class="sticky top-20 w-56" aria-label="목차">
      <h2 class="label-md mb-3 text-on-surface-variant uppercase tracking-wide">목차</h2>
      <ul class="space-y-2 border-l border-outline-variant pl-4">
        @for (e of entries(); track e.id) {
          <li [style.padding-left.rem]="(e.level - 2) * 0.75">
            <a [href]="'#' + e.id" class="label-md hover:text-primary">{{ e.text }}</a>
          </li>
        }
      </ul>
    </nav>
  `,
})
export class TocComponent {
  entries = input.required<TocEntry[]>();
}
```

- [ ] **Step 2: 아티클 페이지 컴포넌트**

Create `src/app/pages/wiki/[...path].page.ts`:

```typescript
import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { injectContent, MarkdownComponent } from '@analogjs/content';
import { TocComponent, TocEntry } from '../../components/toc/toc.component';
import { BadgeComponent } from '../../components/badge/badge.component';

interface WikiAttrs {
  source: string;
  source_commit: string;
  translated_at: string;
  project: string;
  tags?: string[];
}

@Component({
  selector: 'app-wiki-article',
  standalone: true,
  imports: [AsyncPipe, MarkdownComponent, TocComponent, BadgeComponent],
  template: `
    @if (post$ | async; as post) {
      <div class="mx-auto grid max-w-(--container-site) grid-cols-[14rem_minmax(0,720px)_14rem] gap-8 px-6 py-12">
        <app-toc [entries]="extractToc(post.content)" />

        <article class="body-md">
          <h1 class="headline-xl mb-2">{{ extractTitle(post.content) }}</h1>
          <p class="label-md mb-6 text-on-surface-variant">
            원문: <a [href]="post.attributes.source" class="hover:text-primary">{{ post.attributes.source }}</a>
            · 동기화: {{ post.attributes.translated_at }} / {{ post.attributes.source_commit.slice(0, 7) }}
          </p>
          <analog-markdown [content]="post.content" classes="prose prose-lg max-w-none" />

          <div class="mt-12 flex flex-wrap gap-2">
            @for (t of post.attributes.tags ?? []; track t) {
              <app-badge variant="neutral">{{ t }}</app-badge>
            }
          </div>
        </article>

        <aside class="space-y-4">
          <app-badge variant="primary">{{ post.attributes.project }}</app-badge>
          <!-- 인접 페이지 등은 후속 -->
        </aside>
      </div>
    }
  `,
})
export default class WikiArticlePage {
  // catch-all 라우트 (`[...path].page.ts`) 의 path 파라미터 사용.
  // 만약 AnalogJS 현재 버전에서 시그니처가 다르면 `param: 'path'` 또는 `subdirectory: 'wiki'`
  // 옵션 중 동작하는 것으로 조정.
  post$ = injectContent<WikiAttrs>({
    param: 'path',
    customFilename: (params) => `wiki/${params['path']}`,
  });

  extractTitle(md: string): string {
    return md.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? '';
  }

  extractToc(md: string): TocEntry[] {
    const entries: TocEntry[] = [];
    for (const line of md.split('\n')) {
      const m = line.match(/^(#{2,4})\s+(.+)$/);
      if (!m) continue;
      const level = m[1].length;
      const text = m[2].trim();
      const id = text.toLowerCase().replace(/[^\w가-힣\s-]/g, '').replace(/\s+/g, '-');
      entries.push({ level, text, id });
    }
    return entries;
  }
}
```

- [ ] **Step 3: dev 로 확인**

`http://localhost:5173/wiki/pnpm/README` 접속.
Expected: 좌측 TOC, 중앙 본문 (한국어 + 720px), 우측 프로젝트 배지.

- [ ] **Step 4: 커밋**

```bash
git -C /home/hh4518/dev/hseongh-wiki add src/app/pages/wiki/ src/app/components/toc/
git -C /home/hh4518/dev/hseongh-wiki commit -m "feat(page): 아티클 페이지 (TOC + 본문 + 프로젝트 사이드바)"
```

---

### Task 19: 프로젝트 페이지 (`/projects/:slug`)

**Files:**
- Create: `src/app/pages/projects/[slug].page.ts`

- [ ] **Step 1: 프로젝트 페이지**

Create `src/app/pages/projects/[slug].page.ts`:

```typescript
import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { injectContent, injectContentFiles, MarkdownComponent } from '@analogjs/content';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../../components/badge/badge.component';

interface ProjectAttrs {
  project: string;
  name: string;
  summary?: string;
  domain: string;
  source_repo?: string;
  official_site?: string;
  last_ingest?: string;
}

interface WikiAttrs {
  project: string;
  translated_at: string;
}

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [AsyncPipe, MarkdownComponent, RouterLink, BadgeComponent],
  template: `
    @if (project$ | async; as p) {
      <section class="mx-auto max-w-(--container-article) px-6 py-12">
        <app-badge variant="primary">{{ p.attributes.domain }}</app-badge>
        <h1 class="headline-xl mt-3">{{ p.attributes.name }}</h1>
        <p class="body-lg mt-2 text-on-surface-variant">{{ p.attributes.summary }}</p>

        <div class="my-6 flex gap-4 label-md">
          @if (p.attributes.source_repo) {
            <a [href]="p.attributes.source_repo" target="_blank" class="hover:text-primary">Source repo →</a>
          }
          @if (p.attributes.official_site) {
            <a [href]="p.attributes.official_site" target="_blank" class="hover:text-primary">Official site →</a>
          }
        </div>

        <analog-markdown [content]="p.content" classes="prose max-w-none" />

        <h2 class="headline-md mt-12 mb-4">번역된 페이지</h2>
        <ul class="space-y-2">
          @for (page of pagesForProject(p.attributes.project); track page.href) {
            <li>
              <a [routerLink]="page.href" class="hover:text-primary">{{ page.title }}</a>
              <span class="label-md text-on-surface-variant"> · {{ page.translated_at }}</span>
            </li>
          }
        </ul>
      </section>
    }
  `,
})
export default class ProjectPage {
  project$ = injectContent<ProjectAttrs>({
    customFilename: ({ slug }) => `_projects/${slug}`,
  });

  private wikiFiles = injectContentFiles<WikiAttrs>((f) =>
    f.filename.startsWith('/src/content/wiki/')
  );

  pagesForProject(project: string) {
    return this.wikiFiles
      .filter((f) => f.attributes.project === project)
      .map((f) => ({
        title: (f.content.match(/^#\s+(.+)$/m)?.[1] ?? f.slug ?? '').trim(),
        href: f.slug?.replace(/^\/src\/content/, '') ?? '/',
        translated_at: f.attributes.translated_at,
      }));
  }
}
```

- [ ] **Step 2: 확인 + 커밋**

`pnpm dev` → `/projects/pnpm` 접속 확인.

```bash
git -C /home/hh4518/dev/hseongh-wiki add src/app/pages/projects/
git -C /home/hh4518/dev/hseongh-wiki commit -m "feat(page): 프로젝트 페이지"
```

---

### Task 20: 도메인 페이지 (`/domains/:id`)

**Files:**
- Create: `src/app/pages/domains/[id].page.ts`

- [ ] **Step 1: 도메인 페이지**

Create `src/app/pages/domains/[id].page.ts`:

```typescript
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { injectContentFiles } from '@analogjs/content';
import { DomainService } from '../../services/domain.service';
import { PostCardComponent, PostCardData } from '../../components/post-card/post-card.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

interface ProjectAttrs {
  project: string;
  name: string;
  summary?: string;
  domain: string;
}

interface WikiAttrs {
  project: string;
  translated_at: string;
}

@Component({
  selector: 'app-domain-page',
  standalone: true,
  imports: [RouterLink, PostCardComponent],
  template: `
    @if (domain(); as d) {
      <section class="mx-auto max-w-(--container-site) px-6 py-12">
        <h1 class="headline-xl">{{ d.name }}</h1>
        <p class="body-lg mt-2 text-on-surface-variant">{{ d.summary }}</p>

        <h2 class="headline-md mt-12 mb-4">프로젝트</h2>
        <ul class="grid grid-cols-1 gap-4 md:grid-cols-2">
          @for (p of projectsInDomain(); track p.project) {
            <li>
              <a [routerLink]="['/projects', p.project]" class="block rounded-lg border border-outline-variant p-4 hover:bg-surface-low">
                <h3 class="headline-md">{{ p.name }}</h3>
                <p class="body-md text-on-surface-variant mt-2">{{ p.summary }}</p>
              </a>
            </li>
          }
        </ul>

        <h2 class="headline-md mt-12 mb-4">본문</h2>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          @for (post of postsInDomain(); track post.href) {
            <app-post-card [post]="post" />
          }
        </div>
      </section>
    } @else {
      <p class="mx-auto max-w-(--container-article) px-6 py-12">도메인을 찾을 수 없습니다.</p>
    }
  `,
})
export default class DomainPage {
  private route = inject(ActivatedRoute);
  private domainService = inject(DomainService);
  private id = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), { initialValue: '' });

  private projects = injectContentFiles<ProjectAttrs>((f) =>
    f.filename.startsWith('/src/content/_projects/')
  );
  private wikiFiles = injectContentFiles<WikiAttrs>((f) =>
    f.filename.startsWith('/src/content/wiki/')
  );

  domain = computed(() => this.domainService.listDomains().find((d) => d.id === this.id()));

  projectsInDomain = computed(() =>
    this.projects.filter((p) => p.attributes.domain === this.id()).map((p) => p.attributes)
  );

  postsInDomain = computed<PostCardData[]>(() => {
    const projects = this.projectsInDomain().map((p) => p.project);
    return this.wikiFiles
      .filter((f) => projects.includes(f.attributes.project))
      .map((f) => ({
        title: (f.content.match(/^#\s+(.+)$/m)?.[1] ?? '').trim(),
        excerpt: '',
        project: f.attributes.project,
        translatedAt: f.attributes.translated_at,
        href: f.slug?.replace(/^\/src\/content/, '') ?? '/',
      }));
  });
}
```

- [ ] **Step 2: 커밋**

```bash
pnpm dev   # /domains/tooling 확인
git -C /home/hh4518/dev/hseongh-wiki add src/app/pages/domains/
git -C /home/hh4518/dev/hseongh-wiki commit -m "feat(page): 도메인 페이지"
```

---

### Task 21: 글로서리 인덱스 + 용어 페이지

**Files:**
- Create: `src/app/pages/glossary/(index).page.ts`
- Create: `src/app/pages/glossary/[term].page.ts`

- [ ] **Step 1: 인덱스 페이지**

Create `src/app/pages/glossary/(index).page.ts`:

```typescript
import { Component } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../../components/badge/badge.component';

interface GlossaryAttrs {
  term: string;
  korean: string;
  status: '정착어' | '원어유지' | '미정';
  domains?: string[];
}

@Component({
  selector: 'app-glossary-index',
  standalone: true,
  imports: [RouterLink, BadgeComponent],
  template: `
    <section class="mx-auto max-w-(--container-article) px-6 py-12">
      <h1 class="headline-xl mb-8">용어집</h1>
      <ul class="space-y-3">
        @for (t of terms; track t.term) {
          <li>
            <a [routerLink]="['/glossary', t.term]" class="flex items-center justify-between rounded p-3 hover:bg-surface-low">
              <span>
                <span class="body-md">{{ t.korean }}</span>
                <span class="label-md text-on-surface-variant"> ({{ t.term }})</span>
              </span>
              <span class="flex gap-2">
                @for (d of t.domains ?? []; track d) {
                  <app-badge variant="neutral">{{ d }}</app-badge>
                }
              </span>
            </a>
          </li>
        }
      </ul>
    </section>
  `,
})
export default class GlossaryIndexPage {
  private files = injectContentFiles<GlossaryAttrs>((f) =>
    f.filename.startsWith('/src/content/_glossary/')
  );

  terms = this.files
    .map((f) => f.attributes)
    .sort((a, b) => a.korean.localeCompare(b.korean, 'ko'));
}
```

- [ ] **Step 2: 용어 페이지**

Create `src/app/pages/glossary/[term].page.ts`:

```typescript
import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { injectContent, injectContentFiles, MarkdownComponent } from '@analogjs/content';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../../components/badge/badge.component';

interface GlossaryAttrs {
  term: string;
  korean: string;
  status: string;
  domains?: string[];
}

interface WikiAttrs {
  project: string;
  translated_at: string;
}

@Component({
  selector: 'app-glossary-term-page',
  standalone: true,
  imports: [AsyncPipe, MarkdownComponent, RouterLink, BadgeComponent],
  template: `
    @if (term$ | async; as t) {
      <section class="mx-auto max-w-(--container-article) px-6 py-12">
        <h1 class="headline-xl">{{ t.attributes.korean }} <span class="label-md text-on-surface-variant">({{ t.attributes.term }})</span></h1>
        <div class="my-4 flex gap-2">
          <app-badge variant="primary">{{ t.attributes.status }}</app-badge>
          @for (d of t.attributes.domains ?? []; track d) {
            <app-badge variant="neutral">{{ d }}</app-badge>
          }
        </div>
        <analog-markdown [content]="t.content" classes="prose" />
      </section>
    }
  `,
})
export default class GlossaryTermPage {
  term$ = injectContent<GlossaryAttrs>({
    customFilename: ({ slug }) => `_glossary/${slug}`,
  });
}
```

- [ ] **Step 3: 커밋**

```bash
pnpm dev   # /glossary 와 /glossary/promise 확인
git -C /home/hh4518/dev/hseongh-wiki add src/app/pages/glossary/
git -C /home/hh4518/dev/hseongh-wiki commit -m "feat(page): 글로서리 인덱스 + 용어 페이지"
```

---

### Task 22: About 페이지

**Files:**
- Create: `src/app/pages/about.page.ts`

- [ ] **Step 1: About 페이지**

Create `src/app/pages/about.page.ts`:

```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="mx-auto max-w-(--container-article) px-6 py-12 body-md">
      <h1 class="headline-xl mb-6">HseongH — 학습 위키</h1>
      <p>
        IT 공식문서 한국어 번역을 모아두는 개인 학습 위키입니다. 본문은 충실한 번역으로 유지하며,
        그 위에 LLM 이 용어집·프로젝트 카드·로그를 자동으로 관리합니다.
      </p>
      <h2 class="headline-md mt-8 mb-3">원칙</h2>
      <ul class="list-disc pl-6 space-y-1">
        <li>본문은 의역·주석·재구성을 하지 않는 <strong>충실한 번역</strong>.</li>
        <li>모든 본문은 <a routerLink="/" class="text-primary hover:underline">STYLE.md</a> 의 톤 앤 매너를 따릅니다.</li>
        <li>새 용어가 등장하면 즉시 용어집에 정리하고 첫 등장 시 원어 병기.</li>
      </ul>
      <h2 class="headline-md mt-8 mb-3">소스</h2>
      <p>
        <a href="https://github.com/HseongH/hseongh-wiki" target="_blank" class="text-primary hover:underline">github.com/HseongH/hseongh-wiki</a>
      </p>
    </section>
  `,
})
export default class AboutPage {}
```

- [ ] **Step 2: 커밋**

```bash
pnpm dev   # /about 확인
git -C /home/hh4518/dev/hseongh-wiki add src/app/pages/about.page.ts
git -C /home/hh4518/dev/hseongh-wiki commit -m "feat(page): About 페이지"
```

---

## Phase 6 — 마무리 통합 & 검증

### Task 23: prose 스타일 (Tailwind Typography 커스터마이즈)

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: prose 클래스 커스터마이즈**

Edit `src/styles/global.css`, 기존 내용 아래에 추가:

```css
@plugin "@tailwindcss/typography";

@layer components {
  .prose {
    color: var(--color-on-surface);
    max-width: var(--container-article);
    font-family: var(--font-body);
  }
  .prose h1, .prose h2, .prose h3, .prose h4 {
    font-family: var(--font-display);
    color: var(--color-on-surface);
  }
  .prose code {
    font-family: var(--font-mono);
    background: var(--color-surface-container);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
  }
  .prose pre {
    background: var(--color-surface-container-low);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-md);
    padding: 1rem;
    overflow-x: auto;
  }
  .prose pre code {
    background: transparent;
    padding: 0;
  }
  .prose a {
    color: var(--color-primary);
    text-decoration: none;
  }
  .prose a:hover { text-decoration: underline; }

  html.dark .prose pre {
    background: var(--color-surface-container-high);
  }
}
```

- [ ] **Step 2: 시각 검증 + 커밋**

```bash
pnpm dev   # /wiki/pnpm/README 의 본문 스타일 확인
git -C /home/hh4518/dev/hseongh-wiki add src/styles/global.css
git -C /home/hh4518/dev/hseongh-wiki commit -m "feat(style): prose 스타일 커스터마이즈"
```

---

### Task 24: 위키링크 lookup 을 vite 빌드에 연동

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: build-lookups 결과를 remark-wikilink 에 주입**

Edit `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import { remarkWikilink } from './src/lib/remark-wikilink';
import { shikiPlugin } from './src/lib/shiki-config';
import { buildLookups } from './src/lib/build-lookups';

export default defineConfig(() => {
  const lookups = buildLookups();
  return {
    plugins: [
      analog({
        content: { prismatic: false },
        markdown: {
          remarkPlugins: [
            [remarkWikilink, lookups],
          ],
          rehypePlugins: [shikiPlugin],
        },
        static: true,
      }),
    ],
  };
});
```

- [ ] **Step 2: 빌드 + dev 로 위키링크 검증**

```bash
pnpm dev
```
임의의 본문 페이지에서 `[[wiki/pnpm/README]]` 같은 표현이 한국어 텍스트 링크로 렌더되는지 확인. (현재 pnpm README 본문 끝에 `[[_glossary/package-manager]]` 등이 있음.)

- [ ] **Step 3: 커밋**

```bash
git -C /home/hh4518/dev/hseongh-wiki add vite.config.ts
git -C /home/hh4518/dev/hseongh-wiki commit -m "feat(build): 위키링크 lookup 을 remark 체인에 주입"
```

---

### Task 25: SSG 빌드 검증

**Files:** N/A (빌드 명령 검증만)

- [ ] **Step 1: 프로덕션 빌드 실행**

```bash
cd /home/hh4518/dev/hseongh-wiki
pnpm build
```

Expected:
- 빌드 성공
- `dist/analog/public/` 디렉토리에 정적 HTML/CSS/JS 산출물

- [ ] **Step 2: 정적 산출물 미리보기**

```bash
pnpm exec serve dist/analog/public -p 4173
```

또는 `pnpm dlx serve dist/analog/public -p 4173`.

브라우저에서 `http://localhost:4173` 접속, 다음 라우트 확인:
- `/`
- `/wiki/pnpm/README`
- `/projects/pnpm`
- `/domains/tooling`
- `/glossary`
- `/glossary/promise`
- `/about`

모두 200 응답해야 함.

- [ ] **Step 3: 빌드 산출물은 커밋하지 않음 (gitignore 됨)**

별도 커밋 없음. 이미 .gitignore 에서 처리.

---

## Phase 7 — 배포 & 워크플로 갱신

### Task 26: Cloudflare Pages 연결

**Files:** N/A (Cloudflare 대시보드 작업)

- [ ] **Step 1: Cloudflare 대시보드에서 Pages 프로젝트 생성**

브라우저:
1. https://dash.cloudflare.com 로그인
2. Workers & Pages → Create application → Pages → Connect to Git
3. GitHub `HseongH/hseongh-wiki` 저장소 선택
4. 빌드 설정:
   - **Framework preset**: None (수동)
   - **Build command**: `pnpm install && pnpm build`
   - **Build output directory**: `dist/analog/public`
   - **Root directory**: (비워둠)
   - **Environment variables**:
     - `NODE_VERSION` = `20` (또는 AnalogJS 권장 버전)
     - `PNPM_VERSION` = `9` (또는 최신)
5. Save and Deploy

- [ ] **Step 2: 첫 빌드 로그 확인**

빌드가 끝나면 `https://hseongh-wiki.pages.dev` (또는 Cloudflare 가 생성한 URL) 접속. 모든 라우트가 정상 동작 확인.

- [ ] **Step 3: Cloudflare 가 push 마다 자동 빌드하는지 확인**

작은 변경 (예: README.md 의 줄바꿈) 을 commit + push 후 Cloudflare 대시보드의 Deployments 에서 새 빌드가 트리거되는지 확인.

---

### Task 27: CLAUDE.md 갱신 (경로 변경 + 도메인 단계 + 스킬 활용)

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: 경로 변경**

Edit `CLAUDE.md`, 다음 경로 패턴을 일괄 치환:

- `wiki/<project>/<path>.md` → `src/content/wiki/<project>/<path>.md`
- `_glossary/<term>.md` → `src/content/_glossary/<term>.md`
- `_projects/<project>.md` → `src/content/_projects/<project>.md`
- `index.md`, `log.md`, `STYLE.md` 의 위치 → `src/content/_meta/` 하위

- [ ] **Step 2: Ingest 절차에 도메인 단계 추가**

`## 핵심 Operations` 의 `### Ingest` 섹션에 새 단계를 4번과 5번 사이에 추가:

```
4-1. 새 프로젝트가 새 도메인에 속하는데 _meta/domains.yml 에 없으면 사용자에게 도메인 항목을 제안하고 확인 후 추가합니다.
```

또한 프로젝트 카드 frontmatter 의 `domain` 필드를 필수로 명시.

- [ ] **Step 3: Angular 스킬 활용 지침 추가**

CLAUDE.md 의 맨 아래 (또는 적절한 위치) 에 새 섹션:

```markdown
## Angular / AnalogJS 작업 시

이 저장소의 `` 은 Angular 21 + AnalogJS 기반입니다. Angular 코드를 생성·수정할 때는 다음 스킬을 적극 활용합니다:

- **`/angular-new-app`** — 새 프로젝트나 컴포넌트 스캐폴드가 필요할 때
- **`/angular-developer`** — Angular 베스트 프랙티스, 시그널/RxJS/라우팅 등 아키텍처 결정이 필요할 때

스킬을 호출하지 않고 임의로 코드를 작성하지 않습니다. 일관된 패턴을 유지하기 위함.
```

- [ ] **Step 4: 커밋**

```bash
git -C /home/hh4518/dev/hseongh-wiki add CLAUDE.md
git -C /home/hh4518/dev/hseongh-wiki commit -m "docs(claude): 콘텐츠 경로 갱신 + 도메인 단계 + Angular 스킬 지침"
```

---

### Task 28: README.md 갱신 (위키 + 사이트 진입점)

**Files:**
- Modify: `README.md`
- Create: `README.md`

- [ ] **Step 1: 루트 README.md 갱신**

Edit `/home/hh4518/dev/hseongh-wiki/README.md`:

```markdown
# HseongH — 학습 위키

IT 공식문서 한국어 번역을 모아두는 개인 학습 위키 + 정적 사이트.

## 구성

- **콘텐츠** (마크다운): `src/content/`
  - `wiki/<project>/...` — 본문 번역
  - `_glossary/` — 용어집
  - `_projects/` — 프로젝트 카드
  - `_meta/` — `domains.yml`, `index.md`, `log.md`, `STYLE.md`
- **사이트** (AnalogJS): ``
- **운영 매뉴얼**: [`CLAUDE.md`](CLAUDE.md)
- **컨셉 설계**: [`docs/superpowers/specs/2026-05-14-hseongh-wiki-concept-design.md`](docs/superpowers/specs/2026-05-14-hseongh-wiki-concept-design.md)
- **사이트 설계**: [`docs/superpowers/specs/2026-05-14-angular-blog-design.md`](docs/superpowers/specs/2026-05-14-angular-blog-design.md)

## 배포

`main` 브랜치 푸시 시 Cloudflare Pages 가 `` 을 자동 빌드 + 배포합니다.

## 로컬 개발

```bash

pnpm install
pnpm dev      # → http://localhost:5173
pnpm build    # → dist/analog/public/
```
```

- [ ] **Step 2: README.md 작성**

Create `README.md`:

```markdown
# app — HseongH 위키 사이트

AnalogJS + Angular 21 + Tailwind v4.

## 개발

```bash
pnpm install
pnpm dev          # 개발 서버
pnpm build        # 프로덕션 빌드 → dist/analog/public/
pnpm test         # 단위 테스트 (vitest + Karma)
```

## 구조

- `src/content/` — 위키 콘텐츠 (마크다운). 자세한 모델은 루트의 `CLAUDE.md` 참조.
- `src/app/pages/` — 파일 기반 라우팅 (AnalogJS)
- `src/app/components/` — 공유 UI
- `src/lib/` — remark 플러그인 + 빌드 타임 유틸
- `src/styles/` — Tailwind 진입점 + DESIGN.md 토큰
```

- [ ] **Step 3: 커밋 + 배포 트리거**

```bash
git -C /home/hh4518/dev/hseongh-wiki add README.md README.md
git -C /home/hh4518/dev/hseongh-wiki commit -m "docs: README 갱신 (위키 + 사이트 진입점)"
git -C /home/hh4518/dev/hseongh-wiki push
```

푸시 후 Cloudflare 가 자동 빌드 + 배포 → 라이브 URL 에서 검증.

---

### Task 29: 최종 검증 — Lighthouse + 핵심 라우트 점검

**Files:** N/A (검증)

- [ ] **Step 1: 라이브 URL 의 모든 페이지 응답 확인**

배포된 URL (예: `https://hseongh-wiki.pages.dev`) 에서 다음 라우트가 200 응답 + 콘텐츠 정상 표시:

- [ ] `/`
- [ ] `/about`
- [ ] `/wiki/pnpm/README`
- [ ] `/projects/pnpm`
- [ ] `/domains/tooling`
- [ ] `/domains/frontend` (빈 상태이지만 페이지는 렌더)
- [ ] `/glossary`
- [ ] `/glossary/promise`

- [ ] **Step 2: 다크 모드 토글 확인**

헤더의 토글로 light ↔ dark 전환되고, 새로고침 후에도 선택이 유지되는지 확인.

- [ ] **Step 3: Lighthouse 측정 (Chrome DevTools)**

각 페이지 타입(`/`, `/wiki/pnpm/README`, `/glossary`)에 대해 Lighthouse 실행. 목표:

- Performance ≥ 90
- Accessibility ≥ 90
- Best Practices ≥ 90
- SEO ≥ 90

미달 시 가장 큰 문제를 식별 (LCP, CLS, contrast, alt text 등) 후 후속 작업으로 기록.

- [ ] **Step 4: 모바일 반응형 확인 (개발자도구 모바일 시뮬레이션)**

특히 아티클 페이지의 사이드바가 모바일에서 어떻게 동작하는지 확인. 현재 plan 은 데스크탑 우선이며, 모바일 사이드바 collapse 는 v2 로 미루었습니다. 모바일에서도 본문이 읽기 가능한지만 확인.

- [ ] **Step 5: 로그 항목 추가**

Edit `src/content/_meta/log.md`, 최상단에 추가:

```markdown
## [2026-05-14] setup | AnalogJS 사이트 v1 배포

- 스택: Angular 21 + AnalogJS + Tailwind v4 + Shiki + Cloudflare Pages
- 7개 페이지 타입 구현, 다크 모드 v1, 위키링크 빌드 타임 변환
- 배포 URL: <URL 기입>
- Lighthouse: Performance/Accessibility/Best Practices/SEO 점수 기입
- 구현 계획: docs/superpowers/plans/2026-05-14-angular-blog-implementation.md
```

```bash
git -C /home/hh4518/dev/hseongh-wiki add src/content/_meta/log.md
git -C /home/hh4518/dev/hseongh-wiki commit -m "docs(log): v1 사이트 배포 항목"
git -C /home/hh4518/dev/hseongh-wiki push
```

---

## 완료 정의

- ✅ Cloudflare Pages 에서 `https://...pages.dev` URL 로 접속 가능
- ✅ 7개 페이지 타입 모두 정상 응답
- ✅ 다크 모드 동작 + localStorage 유지
- ✅ 본문 위키링크 / 글로서리 텍스트 자동 변환 동작
- ✅ 코드 블록 Shiki 하이라이트 (light/dark)
- ✅ Lighthouse 4개 지표 90 이상 (현실적 목표; 미달 시 후속 plan)
- ✅ CLAUDE.md, README.md 가 새 구조 반영
- ✅ `main` 푸시 시 Cloudflare 자동 재빌드

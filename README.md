# HseongH — 학습 위키

IT 공식문서 한국어 번역을 모아두는 개인 학습 위키 + 정적 사이트 (Angular 21 + AnalogJS + Tailwind v4).

## 구성

- **콘텐츠** (마크다운): `src/content/`
  - `wiki/<project>/...` — 본문 번역
  - `_glossary/` — 용어집
  - `_projects/` — 프로젝트 카드
  - `_meta/` — `domains.yml`, `index.md`, `log.md`, `STYLE.md`
- **사이트** (AnalogJS) 소스: `src/`
  - `src/app/pages/` — 파일 기반 라우팅 (AnalogJS)
  - `src/app/components/` — 공유 UI
  - `src/app/services/` — 도메인 / 테마 등 서비스
  - `src/lib/` — marked 플러그인 + 빌드 타임 유틸
  - `src/styles/` — Tailwind 진입점 + DESIGN.md 토큰
- **운영 매뉴얼 (LLM)**: [`CLAUDE.md`](CLAUDE.md)
- **컨셉 설계**: [`docs/superpowers/specs/2026-05-14-hseongh-wiki-concept-design.md`](docs/superpowers/specs/2026-05-14-hseongh-wiki-concept-design.md)
- **사이트 설계**: [`docs/superpowers/specs/2026-05-14-angular-blog-design.md`](docs/superpowers/specs/2026-05-14-angular-blog-design.md)
- **구현 계획**: [`docs/superpowers/plans/2026-05-14-angular-blog-implementation.md`](docs/superpowers/plans/2026-05-14-angular-blog-implementation.md)

## 배포

`main` 브랜치 푸시 시 Cloudflare Pages 가 자동 빌드 + 배포합니다.

빌드 명령: `pnpm install && pnpm build`  
출력 디렉토리: `dist/analog/public/`

## 로컬 개발

```bash
pnpm install
pnpm dev          # 개발 서버 (http://localhost:4200)
pnpm build        # 프로덕션 빌드 → dist/analog/public/
pnpm test:unit    # vitest 단위 테스트
```

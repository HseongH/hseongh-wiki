# HseongH — 학습 위키

IT 공식문서 한국어 번역을 모아두는 개인 학습 위키 + 정적 사이트.

## 구성

- **콘텐츠** (마크다운): `app/src/content/`
  - `wiki/<project>/...` — 본문 번역
  - `_glossary/` — 용어집
  - `_projects/` — 프로젝트 카드
  - `_meta/` — `domains.yml`, `index.md`, `log.md`, `STYLE.md`
- **사이트** (AnalogJS): `app/`
- **운영 매뉴얼 (LLM)**: [`CLAUDE.md`](CLAUDE.md)
- **컨셉 설계**: [`docs/superpowers/specs/2026-05-14-hseongh-wiki-concept-design.md`](docs/superpowers/specs/2026-05-14-hseongh-wiki-concept-design.md)
- **사이트 설계**: [`docs/superpowers/specs/2026-05-14-angular-blog-design.md`](docs/superpowers/specs/2026-05-14-angular-blog-design.md)
- **구현 계획**: [`docs/superpowers/plans/2026-05-14-angular-blog-implementation.md`](docs/superpowers/plans/2026-05-14-angular-blog-implementation.md)

## 배포

`main` 브랜치 푸시 시 Cloudflare Pages 가 `app/` 을 자동 빌드 + 배포합니다.

## 로컬 개발

```bash
cd app
pnpm install
pnpm dev          # http://localhost:4200
pnpm build        # → dist/analog/public/
pnpm test:unit    # vitest 단위 테스트
```

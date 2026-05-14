# app — HseongH 위키 사이트

AnalogJS + Angular 21 + Tailwind v4.

## 개발

```bash
pnpm install
pnpm dev          # 개발 서버 (http://localhost:4200)
pnpm build        # 프로덕션 빌드 → dist/analog/public/
pnpm test:unit    # vitest 단위 테스트
```

## 구조

- `src/content/` — 위키 콘텐츠 (마크다운). 자세한 모델은 루트의 `CLAUDE.md` 참조.
- `src/app/pages/` — 파일 기반 라우팅 (AnalogJS)
- `src/app/components/` — 공유 UI
- `src/app/services/` — 도메인 / 테마 등 서비스
- `src/lib/` — remark/marked 플러그인 + 빌드 타임 유틸
- `src/styles/` — Tailwind 진입점 + DESIGN.md 토큰

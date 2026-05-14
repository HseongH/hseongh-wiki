---
project: pnpm
name: pnpm
summary: 디스크 효율적인 Node.js 패키지 매니저
domain: tooling
source_repo: https://github.com/pnpm/pnpm
docs_repo: https://github.com/pnpm/pnpm.io
official_site: https://pnpm.io
last_ingest: 2026-05-14
---

# pnpm

빠르고 디스크 공간 효율이 뛰어난 Node.js 패키지 매니저. 콘텐츠 주소화 저장소에 같은 파일을 한 번만 저장하고 링크로 참조하는 방식이 핵심 차별점입니다.

## 번역된 페이지

소스: `pnpm/pnpm` repo

- [[wiki/pnpm/README]] — pnpm 저장소 README

소스: `pnpm/pnpm.io` repo (공식 docs 사이트)

- [[wiki/pnpm/motivation]] — 동기 (왜 pnpm 인가)
- [[wiki/pnpm/installation]] — 설치
- [[wiki/pnpm/pnpm-cli]] — pnpm CLI 개요
- [[wiki/pnpm/feature-comparison]] — npm/Yarn 과의 기능 비교
- [[wiki/pnpm/faq]] — 자주 묻는 질문
- [[wiki/pnpm/pnpm-vs-npm]] — pnpm vs npm

## 번역 안 한 부분 (선택)

- `pnpm/pnpm.io` 의 docs 중 다음 영역은 후속 ingest 대상:
  - 핵심 개념: `workspaces`, `filtering`, `global-virtual-store`, `symlinked-node-modules-structure`, `how-peers-are-resolved`
  - 설정: `configuring`, `settings`, `npmrc`, `package_json`, `pnpm-workspace_yaml`, `pnpmfile`
  - CI/운영: `continuous-integration`, `production`, `docker`, `podman`
  - 기능: `catalogs`, `aliases`, `git`, `using-changesets`, ...
  - CLI 레퍼런스 (`cli/*.md`, 75 페이지)
  - 기타 심화: `typescript`, `errors`, `migration`, `limitations`, `supply-chain-security`, ...
- 내부 코드 주석, 기여 가이드 — 사용자용 문서가 아님

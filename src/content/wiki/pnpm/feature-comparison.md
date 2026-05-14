---
source: https://github.com/pnpm/pnpm.io/blob/main/docs/feature-comparison.md
source_commit: 5b4b807c29689bb1d039778c5ba076bd16e6adb5
translated_at: 2026-05-14
project: pnpm
tags: [pnpm, feature-comparison, yarn, npm, workspace, catalog, sbom]
---

# 기능 비교
*(원제: Feature Comparison)*

> 원문: [github.com/pnpm/pnpm.io/blob/main/docs/feature-comparison.md](https://github.com/pnpm/pnpm.io/blob/main/docs/feature-comparison.md) · 동기화: 2026-05-14 / `5b4b807`

| 기능                               |pnpm              |Yarn              |npm               | 비고 |
| ---                                |:--:              |:--:              |:--:              | ---   |
| [워크스페이스 지원][Workspace support]              |:white_check_mark:|:white_check_mark:|:white_check_mark:|
| 격리된 `node_modules`              |:white_check_mark:|:white_check_mark:|:white_check_mark:| pnpm 기본값. |
| [호이스팅된 `node_modules`][Hoisted `node_modules`]         |:white_check_mark:|:white_check_mark:|:white_check_mark:| npm 기본값. |
| Plug'n'Play                        |:white_check_mark:|:white_check_mark:|:x:               | Yarn 기본값. |
| [피어 자동 설치][Autoinstalling peers]           |:white_check_mark:|:x:               |:white_check_mark:|
| Zero-Installs                      |:x:               |:white_check_mark:|:x:               |
| [의존성 패치][Patching dependencies]          |:white_check_mark:|:white_check_mark:|:x:               |
| [런타임 관리][Managing runtimes]              |:white_check_mark:|:x:               |:x:               |
| [자체 버전 관리][Managing versions of itself]    |:white_check_mark:|:white_check_mark:|:x:               |
| 락 파일 보유                        |:white_check_mark:|:white_check_mark:|:white_check_mark:| `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`. |
| [오버라이드 지원][Overrides support]              |:white_check_mark:|:white_check_mark:|:white_check_mark:| Yarn 에서는 "resolutions" 라고 부릅니다. |
| 콘텐츠 주소화 저장소               |:white_check_mark:|:white_check_mark:|:x:               | `nodeLinker` 를 `pnpm` 으로 설정하면 Yarn 도 CAS 를 사용합니다. |
| [동적 패키지 실행][Dynamic package execution]      |:white_check_mark:|:white_check_mark:|:white_check_mark:| `pnpm dlx`, `yarn dlx`, `npx`. |
| [사이드 이펙트 캐시][Side-effects cache]             |:white_check_mark:|:x:               |:x:               |
| [카탈로그][Catalogs]                       |:white_check_mark:|:x:               |:x:               |
| [설정 의존성][Config dependencies]            |:white_check_mark:|:x:               |:x:               |
| [JSR 레지스트리 지원][JSR registry support]           |:white_check_mark:|:white_check_mark:|:x:               |
| [스크립트 실행 전 자동 설치][Auto-install before script run] |:white_check_mark:|:x:               |:x:               | Yarn 에서는 Plug'n'Play 가 의존성이 항상 최신 상태임을 보장합니다. |
| [Hook][Hooks]                          |:white_check_mark:|:white_check_mark:|:x:               |
| [빌드 스크립트 보안][Build script security]          |:white_check_mark:|:x:               |:x:               |
| [SBOM 생성][SBOM generation]                |:white_check_mark:|:x:               |:white_check_mark:| `pnpm sbom`, `npm sbom`. |
| [라이선스 목록][Listing licenses]               |:white_check_mark:|:white_check_mark:|:x:               | pnpm 은 `pnpm licenses list` 로 지원합니다. Yarn 은 플러그인으로 지원합니다. |

[Auto-install before script run]: ./settings#verifydepsbeforerun
[Autoinstalling peers]: ./settings#autoinstallpeers
[Catalogs]: ./catalogs
[Config dependencies]: ./config-dependencies
[Dynamic package execution]: ./cli/pnx
[Hoisted `node_modules`]: ./settings#nodelinker
[JSR registry support]: ./cli/add#install-from-the-jsr-registry
[Listing licenses]: ./cli/licenses
[Build script security]: ./settings#allowbuilds
[Managing runtimes]: ./cli/runtime
[Managing versions of itself]: ./settings#managepackagemanagerversions
[Overrides support]: ./settings#overrides
[Patching dependencies]: ./cli/patch
[SBOM generation]: ./cli/sbom
[Side-effects cache]: ./settings#sideeffectscache
[Workspace support]: ./workspaces
[Hooks]: ./pnpmfile

**참고:** 비교표를 간결하게 유지하기 위해 자주 사용될 가능성이 높은 기능만 포함했습니다.

---

## 관련 페이지
- [[_glossary/workspace]]
- [[_glossary/hoisting]]
- [[_glossary/registry]]
- [[_glossary/content-addressable-storage]]
- [[_glossary/lockfile]]
- [[wiki/pnpm/README]]
- [[wiki/pnpm/motivation]]
- [[wiki/pnpm/pnpm-vs-npm]]

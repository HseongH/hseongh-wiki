---
source: https://github.com/pnpm/pnpm.io/blob/main/docs/motivation.md
source_commit: 5b4b807c29689bb1d039778c5ba076bd16e6adb5
translated_at: 2026-05-14
project: pnpm
tags: [pnpm, motivation, disk-space, node_modules, symlink]
---

# 동기
*(원제: Motivation)*

> 원문: [github.com/pnpm/pnpm.io/blob/main/docs/motivation.md](https://github.com/pnpm/pnpm.io/blob/main/docs/motivation.md) · 동기화: 2026-05-14 / `5b4b807`

## 디스크 공간 절약

![pnpm 콘텐츠 주소화 저장소 도식. node_modules 를 가진 두 프로젝트가 있으며, node_modules 안의 파일들은 콘텐츠 주소화 저장소의 동일한 파일로 향하는 하드 링크입니다.](https://pnpm.io/img/pnpm-store.svg)

npm 을 사용할 때 100 개의 프로젝트가 동일한 의존성(dependency)에 의존한다면, 해당 의존성이 디스크에 100 개 복사되어 저장됩니다. pnpm 을 사용하면 의존성은 콘텐츠 주소화 저장소(content-addressable store)에 저장되므로:

1. 의존성의 서로 다른 버전에 의존하더라도, 차이가 나는 파일만 저장소에 추가됩니다. 예를 들어 100 개의 파일이 있고 새 버전에서 그 중 하나만 변경되었다면, `pnpm update` 는 단 1 개의 새 파일만 저장소에 추가합니다. 단 하나의 변경을 위해 의존성 전체를 복제하지 않습니다.
1. 모든 파일은 디스크의 단일 장소에 저장됩니다. 패키지(package)가 설치될 때 파일들은 그 단일 장소에서 하드 링크(hard link)되어 추가적인 디스크 공간을 소비하지 않습니다. 이를 통해 동일한 버전의 의존성을 여러 프로젝트에서 공유할 수 있습니다.

그 결과, 프로젝트와 의존성의 수에 비례해 디스크 공간을 크게 절약할 수 있으며, 설치 속도도 훨씬 빨라집니다!

## 설치 속도 향상

pnpm 은 세 단계에 걸쳐 설치를 수행합니다:

1. 의존성 분석. 필요한 모든 의존성을 파악하고 저장소로 가져옵니다.
1. 디렉터리 구조 계산. 의존성을 기반으로 `node_modules` 디렉터리 구조를 계산합니다.
1. 의존성 링크. 남은 의존성을 모두 가져와 저장소에서 `node_modules` 로 하드 링크합니다.

![pnpm 설치 과정 도식. 패키지는 가능한 한 빨리 분석·가져오기·하드 링크 처리됩니다.](https://pnpm.io/img/installation-stages-of-pnpm.svg)

이 방식은 모든 의존성에 대해 분석·가져오기·쓰기를 순차적으로 수행하는 기존의 3단계 설치 방식보다 훨씬 빠릅니다.

![Yarn Classic 이나 npm 같은 패키지 매니저의 의존성 설치 방식 도식.](https://pnpm.io/img/installation-stages-of-other-pms.svg)

## 비평탄 node_modules 디렉터리 생성

npm 이나 Yarn Classic 으로 의존성을 설치하면 모든 패키지가 모듈 디렉터리의 루트로 호이스팅(hoisted)됩니다. 그 결과, 소스 코드에서 프로젝트의 의존성으로 명시되지 않은 패키지에도 접근할 수 있게 됩니다.

pnpm 은 기본적으로 심볼릭 링크(symbolic link)를 사용해 프로젝트의 직접 의존성만 모듈 디렉터리 루트에 추가합니다.

![pnpm 이 생성한 node_modules 디렉터리 도식. node_modules 루트의 패키지들은 node_modules/.pnpm 디렉터리 내부 디렉터리를 가리키는 심볼릭 링크입니다.](https://pnpm.io/img/isolated-node-modules.svg)

pnpm 이 생성하는 고유한 `node_modules` 구조와 그것이 Node.js 생태계에서 문제없이 동작하는 이유에 대한 자세한 내용은 다음 글을 참고합니다:
- [Flat node_modules is not the only way](/blog/2020/05/27/flat-node-modules-is-not-the-only-way)
- [심볼릭 링크 기반 node_modules 구조](./symlinked-node-modules-structure)

:::tip

도구가 심볼릭 링크와 잘 동작하지 않는 경우에도 pnpm 을 사용할 수 있습니다. [nodeLinker](./settings#nodeLinker) 설정을 `hoisted` 로 지정하면 npm 이나 Yarn Classic 이 생성하는 것과 유사한 node_modules 디렉터리를 생성하도록 pnpm 에 지시할 수 있습니다.

:::

---

## 관련 페이지
- [[_glossary/hard-link]]
- [[_glossary/symbolic-link]]
- [[_glossary/hoisting]]
- [[_glossary/content-addressable-storage]]
- [[_glossary/package]]
- [[_glossary/dependency]]
- [[wiki/pnpm/feature-comparison]]
- [[wiki/pnpm/pnpm-vs-npm]]

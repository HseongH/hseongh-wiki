---
source: https://github.com/pnpm/pnpm.io/blob/main/docs/pnpm-vs-npm.md
source_commit: 5b4b807c29689bb1d039778c5ba076bd16e6adb5
translated_at: 2026-05-14
project: pnpm
tags: [pnpm, npm, comparison, node_modules, flat-tree, hard-link, symlink]
---

# pnpm vs npm
*(원제: pnpm vs npm)*

> 원문: [github.com/pnpm/pnpm.io/blob/main/docs/pnpm-vs-npm.md](https://github.com/pnpm/pnpm.io/blob/main/docs/pnpm-vs-npm.md) · 동기화: 2026-05-14 / `5b4b807`

## npm 의 평탄 트리

npm 은 버전 3 부터 [평탄화된 의존성 트리][flattened dependency tree]를 유지합니다. 이로 인해 디스크 공간 낭비는 줄었지만, `node_modules` 디렉터리가 복잡해지는 부작용이 생겼습니다.

반면 pnpm 은 하드 링크(hard link)와 심볼릭 링크(symbolic link)를 사용해 전역 온디스크 콘텐츠 주소화 저장소(content-addressable store)로 `node_modules` 를 관리합니다. 이를 통해 훨씬 적은 디스크 공간을 사용하면서도 `node_modules` 를 깔끔하게 유지할 수 있습니다. [저장소 레이아웃][store layout] 문서에서 자세한 내용을 확인할 수 있습니다.

pnpm 의 올바른 `node_modules` 구조가 갖는 장점은 프로젝트의 `package.json` 에 명시되지 않은 모듈을 사용하는 것을 불가능하게 만들어 "[어리석은 버그를 방지하는 데 도움이 된다][helps to avoid silly bugs]"는 점입니다.

[flattened dependency tree]: https://github.com/npm/npm/issues/6912
[store layout]: ./symlinked-node-modules-structure
[helps to avoid silly bugs]: https://www.kochan.io/nodejs/pnpms-strictness-helps-to-avoid-silly-bugs.html

## 설치

pnpm 은 `package.json` 에 저장하지 않고 패키지(package)를 설치하는 것을 허용하지 않습니다. `pnpm add` 에 아무 매개변수도 전달되지 않으면 패키지는 일반 의존성(dependency)으로 저장됩니다. npm 과 마찬가지로 `--save-dev` 와 `--save-optional` 을 사용해 개발 또는 선택적 의존성으로 설치할 수 있습니다.

이 제약의 결과로, pnpm 을 사용하는 프로젝트는 의존성을 제거하고 고아 상태로 남겨두지 않는 한 불필요한 패키지가 존재하지 않습니다. 그렇기 때문에 pnpm 의 [prune 명령어][prune command] 구현은 제거할 패키지를 지정할 수 없습니다. 불필요한(extraneous) 패키지와 고아 패키지를 항상 모두 제거합니다.

[prune command]: ./cli/prune

## 디렉터리 의존성

디렉터리 의존성은 `file:` 접두사로 시작하며 파일 시스템의 디렉터리를 가리킵니다. npm 과 마찬가지로 pnpm 도 이러한 의존성을 심볼릭 링크합니다. npm 과 달리 pnpm 은 파일 의존성에 대해 설치를 수행하지 않습니다.

즉, `bar@file:../bar` 를 의존성으로 갖는 `foo` 패키지(`<root>/foo`)가 있을 때, `foo` 에서 `pnpm install` 을 실행해도 pnpm 은 `<root>/bar` 에 대한 설치를 수행하지 않습니다.

여러 패키지에서 동시에 설치를 실행해야 하는 경우(예: 모노레포(monorepo)), [`pnpm -r`][`pnpm -r`] 문서를 참조합니다.

[`pnpm -r`]: ./cli/recursive

---

## 관련 페이지
- [[_glossary/hard-link]]
- [[_glossary/symbolic-link]]
- [[_glossary/hoisting]]
- [[_glossary/content-addressable-storage]]
- [[_glossary/dependency]]
- [[_glossary/monorepo]]
- [[wiki/pnpm/README]]
- [[wiki/pnpm/motivation]]
- [[wiki/pnpm/feature-comparison]]
- [[wiki/pnpm/faq]]

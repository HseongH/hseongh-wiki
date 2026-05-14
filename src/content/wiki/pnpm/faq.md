---
source: https://github.com/pnpm/pnpm.io/blob/main/docs/faq.md
source_commit: 5b4b807c29689bb1d039778c5ba076bd16e6adb5
translated_at: 2026-05-14
project: pnpm
tags: [pnpm, faq, hard-link, symlink, windows, btrfs, filesystem]
---

# 자주 묻는 질문
*(원제: Frequently Asked Questions)*

> 원문: [github.com/pnpm/pnpm.io/blob/main/docs/faq.md](https://github.com/pnpm/pnpm.io/blob/main/docs/faq.md) · 동기화: 2026-05-14 / `5b4b807`

## 패키지가 전역 저장소에 저장되는데 `node_modules` 폴더가 디스크 공간을 사용하는 이유는 무엇입니까?

pnpm 은 전역 저장소에서 프로젝트의 `node_modules` 폴더로 하드 링크(hard link)를 생성합니다. 하드 링크는 원본 파일이 존재하는 디스크의 동일한 위치를 가리킵니다. 예를 들어 프로젝트의 의존성(dependency)으로 `foo` 가 있고 1MB 를 차지한다면, 프로젝트의 `node_modules` 폴더에서도 1MB 를 차지하는 것처럼 보이고 전역 저장소에서도 동일한 크기를 차지하는 것처럼 보입니다. 그러나 그 1MB 는 두 위치에서 접근되는 *동일한 디스크 공간*입니다. 따라서 `foo` 는 총 2MB 가 아닌 1MB 만 차지합니다.

[hard links]: https://en.wikipedia.org/wiki/Hard_link

자세한 내용은 다음을 참조합니다:

* [하드 링크는 왜 원본과 같은 공간을 차지하는 것처럼 보이는가?](https://unix.stackexchange.com/questions/88423/why-do-hard-links-seem-to-take-the-same-space-as-the-originals)
* [pnpm 채팅방 스레드](https://gist.github.com/zkochan/106cfef49f8476b753a9cbbf9c65aff1)
* [pnpm 저장소 이슈](https://github.com/pnpm/pnpm/issues/794)

## Windows 에서 동작합니까?

간단히 답하면: 예.
자세히 설명하면: Windows 에서 심볼릭 링크(symbolic link) 사용은 여러 문제가 있습니다. 그러나 pnpm 은 이에 대한 해결책을 갖고 있습니다. Windows 에서는 심볼릭 링크 대신 [정션(junction)][junctions] 을 사용합니다.

[junctions]: https://docs.microsoft.com/en-us/windows/win32/fileio/hard-links-and-junctions

## 중첩된 `node_modules` 방식은 Windows 와 호환되지 않습니까?

초기 버전의 npm 은 모든 `node_modules` 를 중첩하는 방식 때문에 문제가 있었습니다([해당 이슈][this issue] 참조). 그러나 pnpm 은 깊은 폴더 구조를 만들지 않습니다. 모든 패키지(package)를 평탄하게 저장하고 심볼릭 링크를 사용해 의존성 트리 구조를 생성합니다.

[this issue]: https://github.com/nodejs/node-v0.x-archive/issues/6960

## 순환 심볼릭 링크는 어떻게 처리됩니까?

pnpm 은 `node_modules` 폴더에 의존성을 배치하기 위해 링크를 사용하지만, 부모 패키지가 자신의 의존성과 동일한 `node_modules` 폴더에 배치되기 때문에 순환 심볼릭 링크가 발생하지 않습니다. 따라서 `foo` 의 의존성은 `foo/node_modules` 안에 있는 것이 아니라, `foo` 자신과 함께 `node_modules` 에 함께 존재합니다.

## 전역 저장소로 바로 심볼릭 링크하지 않고 하드 링크를 사용하는 이유는 무엇입니까?

한 머신에서도 패키지(package)는 서로 다른 의존성 집합을 가질 수 있습니다.

프로젝트 **A** 에서 `foo@1.0.0` 이 `bar@1.0.0` 에 의존하도록 분석될 수 있지만, 프로젝트 **B** 에서는 동일한 `foo` 의 의존성이 `bar@1.1.0` 으로 분석될 수 있습니다. 따라서 pnpm 은 `foo@1.0.0` 을 사용하는 모든 프로젝트에 하드 링크하여 각각 서로 다른 의존성 집합을 생성합니다.

Node 의 `--preserve-symlinks` 플래그를 사용하면 전역 저장소로 직접 심볼릭 링크하는 방식도 동작하지만, 그 방식은 다른 많은 문제를 유발합니다. 이 결정의 자세한 이유는 [해당 이슈][eps-issue] 를 참조합니다.

[eps-issue]: https://github.com/nodejs/node-eps/issues/46

## pnpm 은 하나의 Btrfs 파티션 내 서로 다른 서브볼륨에서도 동작합니까?

Btrfs 는 단일 파티션 내 서로 다른 서브볼륨 간의 크로스 디바이스 하드 링크를 허용하지 않지만, reflink 는 허용합니다. 따라서 pnpm 은 이 서브볼륨들 사이에서 데이터를 공유하기 위해 reflink 를 활용합니다.

## pnpm 은 여러 드라이브나 파일 시스템에 걸쳐 동작합니까?

패키지 저장소는 설치 위치와 동일한 드라이브 및 파일 시스템에 있어야 합니다. 그렇지 않으면 패키지가 링크되지 않고 복사됩니다. 이는 하드 링크의 동작 방식 때문입니다. 한 파일 시스템의 파일은 다른 파일 시스템의 위치를 참조할 수 없습니다. 자세한 내용은 [이슈 #712][Issue #712] 을 참조합니다.

pnpm 은 아래 두 가지 경우에 다르게 동작합니다:

[Issue #712]: https://github.com/pnpm/pnpm/issues/712

### 저장소 경로가 지정된 경우

[저장소 설정](./configuring) 을 통해 저장소 경로가 지정된 경우, 저장소와 다른 디스크에 있는 프로젝트 간에는 복사가 발생합니다.

디스크 `A` 에서 `pnpm install` 을 실행하면 pnpm 저장소는 디스크 `A` 에 있어야 합니다. pnpm 저장소가 디스크 `B` 에 있다면, 필요한 모든 패키지는 링크 대신 프로젝트 위치로 직접 복사됩니다. 이는 pnpm 의 저장 공간 및 성능 이점을 크게 저하시킵니다.

### 저장소 경로가 지정되지 않은 경우

저장소 경로가 설정되지 않은 경우, 드라이브 또는 파일 시스템마다 여러 저장소가 생성됩니다.

디스크 `A` 에서 설치를 실행하면 파일 시스템 루트 하위 `.pnpm-store` 에 저장소가 생성됩니다. 이후 디스크 `B` 에서 설치를 실행하면 `B` 의 `.pnpm-store` 에 독립적인 저장소가 생성됩니다. 각 프로젝트는 여전히 pnpm 의 이점을 유지하지만, 드라이브마다 중복 패키지가 존재할 수 있습니다.

## `pnpm` 은 무엇의 약자입니까?

`pnpm` 은 `performant npm` 의 약자입니다.
이름은 [@rstacruz](https://github.com/rstacruz/) 가 지었습니다.

## `pnpm` 이 &lt;여러분의 프로젝트&gt; 에서 동작하지 않습니까?

대부분의 경우 의존성 중 하나가 `package.json` 에 선언되지 않은 패키지를 필요로 한다는 의미입니다. 이는 평탄한 `node_modules` 로 인해 발생하는 흔한 실수입니다. 이 경우 의존성에 오류가 있으므로 해당 의존성이 수정되어야 합니다. 다만 시간이 걸릴 수 있으므로, pnpm 은 문제 있는 패키지가 동작하도록 하는 임시 해결 방법을 지원합니다.

### 해결 방법 1

문제가 있는 경우 [`nodeLinker: hoisted`] 설정을 사용할 수 있습니다.
이 설정은 `npm` 이 생성하는 것과 유사한 평탄한 `node_modules` 구조를 생성합니다.

[`nodeLinker: hoisted`]: ./settings#nodeLinker

### 해결 방법 2

다음 예에서 의존성이 자신의 의존성 목록에 `iterall` 모듈을 갖고 있지 않다고 가정합니다.

문제 있는 패키지의 누락된 의존성을 해결하는 가장 쉬운 방법은 **프로젝트의 `package.json` 에 `iterall` 을 의존성으로 추가**하는 것입니다.

`pnpm add iterall` 로 설치하면 프로젝트의 `package.json` 에 자동으로 추가됩니다.

```json
  "dependencies": {
    ...
    "iterall": "^1.2.2",
    ...
  }
```

### 해결 방법 3

[hook](./pnpmfile#hooks) 을 사용해 패키지의 `package.json` 에 누락된 의존성을 추가하는 방법도 있습니다.

예를 들어 [Webpack Dashboard] 는 `pnpm` 에서 동작하지 않았지만 현재는 해결되어 정상 동작합니다.

당시 다음과 같은 오류가 발생했습니다:

```console
Error: Cannot find module 'babel-traverse'
  at /node_modules/inspectpack@2.2.3/node_modules/inspectpack/lib/actions/parse
```

문제는 `webpack-dashboard` 가 사용하는 `inspectpack` 이 `babel-traverse` 를 사용하는데, `babel-traverse` 가 `inspectpack` 의 `package.json` 에 명시되지 않았기 때문입니다. `npm` 과 `yarn` 에서는 평탄한 `node_modules` 를 생성하기 때문에 동작했습니다.

해결 방법은 다음 내용으로 `.pnpmfile.mjs` 를 생성하는 것이었습니다:

```js
export const hooks = {
  readPackage: (pkg) => {
    if (pkg.name === "inspectpack") {
      pkg.dependencies['babel-traverse'] = '^6.26.0';
    }
    return pkg;
  }
}
```

`.pnpmfile.mjs` 를 생성한 후 `pnpm-lock.yaml` 만 삭제합니다. `node_modules` 는 삭제할 필요 없습니다. pnpm hook 은 모듈 분석에만 영향을 미치기 때문입니다. 이후 의존성을 다시 빌드하면 정상 동작합니다.

[Webpack Dashboard]: https://github.com/pnpm/pnpm/issues/1043

---

## 관련 페이지
- [[_glossary/hard-link]]
- [[_glossary/symbolic-link]]
- [[_glossary/hoisting]]
- [[_glossary/dependency]]
- [[_glossary/package]]
- [[wiki/pnpm/README]]
- [[wiki/pnpm/motivation]]
- [[wiki/pnpm/pnpm-vs-npm]]

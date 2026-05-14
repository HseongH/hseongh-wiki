---
source: https://github.com/pnpm/pnpm.io/blob/main/docs/pnpm-cli.md
source_commit: 5b4b807c29689bb1d039778c5ba076bd16e6adb5
translated_at: 2026-05-14
project: pnpm
tags: [pnpm, cli, commands, options, environment-variables]
---

# pnpm CLI
*(원제: pnpm CLI)*

> 원문: [github.com/pnpm/pnpm.io/blob/main/docs/pnpm-cli.md](https://github.com/pnpm/pnpm.io/blob/main/docs/pnpm-cli.md) · 동기화: 2026-05-14 / `5b4b807`

## 짧은 별칭

추가된 버전: v11.0.0

`pn` 은 `pnpm` 의 짧은 별칭으로, [`pnx`](./cli/pnx) 는 `pnpm dlx` 의 짧은 별칭으로 사용할 수 있습니다. `pnpm` 또는 `pnpx` 를 사용하는 모든 곳에서 사용 가능합니다:

```sh
pn install
pn add express
pn build
pn test
pnx create-vue my-app
```

## npm 과의 차이점

npm 과 달리 pnpm 은 모든 옵션을 검증합니다. 예를 들어 `--target_arch` 는 `pnpm install` 의 유효한 옵션이 아니므로 `pnpm install --target_arch x64` 는 실패합니다.

그러나 일부 의존성(dependency)은 CLI 옵션에서 채워지는 `npm_config_` 환경 변수를 사용할 수 있습니다. 이 경우 다음 두 가지 방법을 사용할 수 있습니다:

1. 환경 변수를 명시적으로 설정: `npm_config_target_arch=x64 pnpm install`
1. `--config.` 를 사용해 알 수 없는 옵션을 강제 적용: `pnpm install --config.target_arch=x64`

## 옵션

### -C &lt;path\>, --dir &lt;path\>

현재 작업 디렉터리 대신 `<path>` 에서 pnpm 이 시작된 것처럼 실행합니다.

### -w, --workspace-root

현재 작업 디렉터리 대신 [워크스페이스](./workspaces) 루트에서 pnpm 이 시작된 것처럼 실행합니다.

## 명령어

개별 CLI 명령어 문서를 참조하면 자세한 내용을 확인할 수 있습니다. 시작에 도움이 되도록 유용한 npm 대응 명령어 목록을 제공합니다:

| npm 명령어      | pnpm 대응 명령어    |
|-----------------|--------------------|
| `npm install`   | [`pnpm install`]     |
| `npm i <pkg>`   | [`pnpm add <pkg>`]   |
| `npm run <cmd>` | [`pnpm <cmd>`]       |
| `npx <pkg>`     | [`pnx <pkg>`]      |

알 수 없는 명령어를 사용하면 pnpm 은 해당 이름의 스크립트를 검색합니다. 따라서 `pnpm run lint` 와 `pnpm lint` 는 동일합니다. 지정한 이름의 스크립트가 없으면 pnpm 은 해당 명령어를 셸 스크립트로 실행합니다. 예를 들어 `pnpm eslint` 와 같이 사용할 수 있습니다([`pnpm exec`] 참조).

[`pnpm install`]: ./cli/install
[`pnpm add <pkg>`]: ./cli/add
[`pnpm <cmd>`]: ./cli/run
[`pnpm exec`]: ./cli/exec
[`pnx <pkg>`]: ./cli/pnx

## 환경 변수

pnpm 과 직접 관련은 없지만 pnpm 동작에 영향을 줄 수 있는 환경 변수:

* [`CI`](./cli/install#--frozen-lockfile)

pnpm 이 전역 정보를 저장하는 데 사용하는 디렉터리에 영향을 줄 수 있는 환경 변수:

* `XDG_CACHE_HOME`
* `XDG_CONFIG_HOME`
* `XDG_DATA_HOME`
* `XDG_STATE_HOME`

이 환경 변수를 활용하는 설정 항목은 문서에서 검색해 확인할 수 있습니다.

---

## 관련 페이지
- [[_glossary/dependency]]
- [[_glossary/workspace]]
- [[wiki/pnpm/README]]
- [[wiki/pnpm/installation]]
- [[wiki/pnpm/pnpm-vs-npm]]

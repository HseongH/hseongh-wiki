---
source: https://github.com/pnpm/pnpm/blob/main/README.md
source_commit: 94240bc0464196bd52f7006b97f6d9a43df34633
translated_at: 2026-05-14
project: pnpm
tags: [pnpm, package-manager, getting-started]
---

# pnpm
*(원제: pnpm)*

> 원문: [github.com/pnpm/pnpm/blob/main/README.md](https://github.com/pnpm/pnpm/blob/main/README.md) · 동기화: 2026-05-14 / `94240bc`

[简体中文](https://pnpm.io/zh/) |
[日本語](https://pnpm.io/ja/) |
[한국어](https://pnpm.io/ko/) |
[Italiano](https://pnpm.io/it/) |
[Português Brasileiro](https://pnpm.io/pt/)

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://i.imgur.com/qlW1eEG.png">
  <source media="(prefers-color-scheme: dark)"  srcset="https://i.imgur.com/qlW1eEG.png">
  <img src="https://i.imgur.com/qlW1eEG.png" alt="pnpm">
</picture>

빠르고 디스크 공간 효율이 뛰어난 패키지 매니저(package manager):

* **빠릅니다.** 다른 대안들보다 최대 2배 빠릅니다 ([벤치마크](#벤치마크) 참조).
* **효율적입니다.** `node_modules` 안의 파일들은 단일 콘텐츠 주소화 저장소(content-addressable storage)에서 링크됩니다.
* **[모노레포(monorepo)에 적합합니다](https://pnpm.io/workspaces).**
* **엄격합니다.** 패키지(package)는 자신의 `package.json` 에 명시된 의존성(dependency)에만 접근할 수 있습니다.
* **결정적입니다.** `pnpm-lock.yaml` 이라는 락 파일(lockfile)을 사용합니다.
* **Node.js 버전 매니저로도 동작합니다.** [pnpm runtime](https://pnpm.io/11.x/cli/runtime) 을 참조할 수 있습니다.
* **어디서나 동작합니다.** Windows, Linux, macOS 를 지원합니다.
* **실전 검증되었습니다.** 2016년부터 [다양한 규모의](https://pnpm.io/workspaces#usage-examples) 팀에서 프로덕션에 사용되고 있습니다.
* [npm 및 Yarn 과의 전체 기능 비교를 확인할 수 있습니다](https://pnpm.io/feature-comparison).

[Rush](https://rushjs.io/) 팀의 말을 인용하자면:

> Microsoft 는 수백 개의 프로젝트와 하루 수백 건의 PR 이 발생하는 Rush 저장소에서 pnpm 을 사용하고 있으며, 매우 빠르고 안정적임을 확인했습니다.

[![npm version](https://img.shields.io/npm/v/pnpm.svg?label=latest)](https://github.com/pnpm/pnpm/releases/latest)
[![OpenCollective](https://opencollective.com/pnpm/backers/badge.svg)](https://opencollective.com/pnpm)
[![OpenCollective](https://opencollective.com/pnpm/sponsors/badge.svg)](https://opencollective.com/pnpm)
[![X Follow](https://img.shields.io/twitter/follow/pnpmjs.svg?style=social&label=Follow)](https://x.com/intent/follow?screen_name=pnpmjs&region=follow_link)
[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://stand-with-ukraine.pp.ua)

<!-- sponsors -->

## 플래티넘 후원사

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="https://bit.cloud/?utm_source=pnpm&utm_medium=readme" target="_blank"><img src="https://pnpm.io/img/users/bit.svg" width="80" alt="Bit"></a>
      </td>
    </tr>
  </tbody>
</table>

## 골드 후원사

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="https://sanity.io/?utm_source=pnpm&utm_medium=readme" target="_blank">
          <picture>
            <source media="(prefers-color-scheme: light)" srcset="https://pnpm.io/img/users/sanity.svg" />
            <source media="(prefers-color-scheme: dark)" srcset="https://pnpm.io/img/users/sanity_light.svg" />
            <img src="https://pnpm.io/img/users/sanity.svg" width="120" alt="Sanity" />
          </picture>
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://discord.com/?utm_source=pnpm&utm_medium=readme" target="_blank">
          <picture>
            <source media="(prefers-color-scheme: light)" srcset="https://pnpm.io/img/users/discord.svg" />
            <source media="(prefers-color-scheme: dark)" srcset="https://pnpm.io/img/users/discord_light.svg" />
            <img src="https://pnpm.io/img/users/discord.svg" width="220" alt="Discord" />
          </picture>
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://vite.dev/?utm_source=pnpm&utm_medium=readme" target="_blank"><img src="https://pnpm.io/img/users/vitejs.svg" width="42" alt="Vite"></a>
      </td>
    </tr>
    <tr>
      <td align="center" valign="middle">
        <a href="https://serpapi.com/?utm_source=pnpm&utm_medium=readme" target="_blank">
          <picture>
            <source media="(prefers-color-scheme: light)" srcset="https://pnpm.io/img/users/serpapi_dark.svg" />
            <source media="(prefers-color-scheme: dark)" srcset="https://pnpm.io/img/users/serpapi_light.svg" />
            <img src="https://pnpm.io/img/users/serpapi_dark.svg" width="160" alt="SerpApi" />
          </picture>
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://coderabbit.ai/?utm_source=pnpm&utm_medium=readme" target="_blank">
          <picture>
            <source media="(prefers-color-scheme: light)" srcset="https://pnpm.io/img/users/coderabbit.svg" />
            <source media="(prefers-color-scheme: dark)" srcset="https://pnpm.io/img/users/coderabbit_light.svg" />
            <img src="https://pnpm.io/img/users/coderabbit.svg" width="220" alt="CodeRabbit" />
          </picture>
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://stackblitz.com/?utm_source=pnpm&utm_medium=readme" target="_blank">
          <picture>
            <source media="(prefers-color-scheme: light)" srcset="https://pnpm.io/img/users/stackblitz.svg" />
            <source media="(prefers-color-scheme: dark)" srcset="https://pnpm.io/img/users/stackblitz_light.svg" />
            <img src="https://pnpm.io/img/users/stackblitz.svg" width="190" alt="Stackblitz" />
          </picture>
        </a>
      </td>
    </tr>
    <tr>
      <td align="center" valign="middle">
        <a href="https://workleap.com/?utm_source=pnpm&utm_medium=readme" target="_blank">
          <picture>
            <source media="(prefers-color-scheme: light)" srcset="https://pnpm.io/img/users/workleap.svg" />
            <source media="(prefers-color-scheme: dark)" srcset="https://pnpm.io/img/users/workleap_light.svg" />
            <img src="https://pnpm.io/img/users/workleap.svg" width="190" alt="Workleap" />
          </picture>
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://nx.dev/?utm_source=pnpm&utm_medium=readme" target="_blank">
          <picture>
            <source media="(prefers-color-scheme: light)" srcset="https://pnpm.io/img/users/nx.svg" />
            <source media="(prefers-color-scheme: dark)" srcset="https://pnpm.io/img/users/nx_light.svg" />
            <img src="https://pnpm.io/img/users/nx.svg" width="50" alt="Nx" />
          </picture>
        </a>
      </td>
    </tr>
  </tbody>
</table>

## 실버 후원사

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="https://replit.com/?utm_source=pnpm&utm_medium=readme" target="_blank">
          <picture>
            <source media="(prefers-color-scheme: light)" srcset="https://pnpm.io/img/users/replit.png" />
            <source media="(prefers-color-scheme: dark)" srcset="https://pnpm.io/img/users/replit_light.png" />
            <img src="https://pnpm.io/img/users/replit.png" width="140" alt="Replit" />
          </picture>
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://cybozu.co.jp/?utm_source=pnpm&utm_medium=readme" target="_blank"><img src="https://pnpm.io/img/users/cybozu.svg" width="70" alt="Cybozu"></a>
      </td>
      <td align="center" valign="middle">
        <a href="https://devowl.io/?utm_source=pnpm&utm_medium=readme" target="_blank"><img src="https://pnpm.io/img/users/devowlio.svg" width="100" alt="devowl.io"></a>
      </td>
    </tr>
    <tr>
      <td align="center" valign="middle">
        <a href="https://uscreen.de/?utm_source=pnpm&utm_medium=readme" target="_blank">
          <picture>
            <source media="(prefers-color-scheme: light)" srcset="https://pnpm.io/img/users/uscreen.svg" />
            <source media="(prefers-color-scheme: dark)" srcset="https://pnpm.io/img/users/uscreen_light.svg" />
            <img src="https://pnpm.io/img/users/uscreen.svg" width="180" alt="u|screen" />
          </picture>
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://www.leniolabs.com/?utm_source=pnpm&utm_medium=readme" target="_blank"><img src="https://pnpm.io/img/users/leniolabs.jpg" width="40" alt="Leniolabs_"></a>
      </td>
      <td align="center" valign="middle">
        <a href="https://depot.dev/?utm_source=pnpm&utm_medium=readme" target="_blank">
          <picture>
            <source media="(prefers-color-scheme: light)" srcset="https://pnpm.io/img/users/depot.svg" />
            <source media="(prefers-color-scheme: dark)" srcset="https://pnpm.io/img/users/depot_light.svg" />
            <img src="https://pnpm.io/img/users/depot.svg" width="100" alt="Depot" />
          </picture>
        </a>
      </td>
    </tr>
    <tr>
      <td align="center" valign="middle">
        <a href="https://cerbos.dev/?utm_source=pnpm&utm_medium=readme" target="_blank">
          <picture>
            <source media="(prefers-color-scheme: light)" srcset="https://pnpm.io/img/users/cerbos.svg" />
            <source media="(prefers-color-scheme: dark)" srcset="https://pnpm.io/img/users/cerbos_light.svg" />
            <img src="https://pnpm.io/img/users/cerbos.svg" width="90" alt="Cerbos" />
          </picture>
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://time.now/?utm_source=pnpm&utm_medium=readme" target="_blank">⏱️ Time.now</a>
      </td>
    </tr>
  </tbody>
</table>

<!-- sponsors end -->

이 프로젝트를 [후원](https://opencollective.com/pnpm#sponsor)으로 지원하실 수 있습니다.

## 배경

pnpm 은 콘텐츠 주소화 파일 시스템(content-addressable filesystem)을 사용해 모든 모듈 디렉터리의 모든 파일을 디스크에 저장합니다.
npm 을 사용할 경우, 100 개의 프로젝트가 lodash 를 사용한다면 디스크에 100 개의 lodash 사본이 존재하게 됩니다.
pnpm 을 사용하면 lodash 는 콘텐츠 주소화 저장소에 저장되므로 다음과 같습니다:

1. 서로 다른 버전의 lodash 에 의존한다 하더라도, 차이가 나는 파일만 저장소에 추가됩니다.
  lodash 에 100 개의 파일이 있고 새 버전이 그 중 한 파일에만 변경 사항이 있다면, `pnpm update` 는 저장소에 단 1 개의 새 파일만 추가합니다.
1. 모든 파일은 디스크의 한 곳에 저장됩니다. 패키지가 설치될 때, 파일들은 그 단일 위치에서 링크되어 추가적인 디스크 공간을 소비하지 않습니다. 링크는 하드 링크(hard-link)나 reflink(copy-on-write)를 통해 수행됩니다.

그 결과, 여러분은 디스크에서 기가바이트 단위의 공간을 절약하면서도 훨씬 빠른 설치 속도를 얻을 수 있습니다!
pnpm 이 생성하는 고유한 `node_modules` 구조와 그것이 Node.js 생태계에서 문제없이 동작하는 이유에 대한 더 자세한 내용은 다음 짧은 글에서 확인할 수 있습니다: [Flat node_modules is not the only way](https://pnpm.io/blog/2020/05/27/flat-node-modules-is-not-the-only-way).

💖 이 프로젝트가 마음에 드시나요? [트윗](https://r.pnpm.io/tweet)으로 다른 사람들에게 알려보실 수 있습니다.

## 시작하기

- [설치](https://pnpm.io/installation)
- [사용법](https://pnpm.io/pnpm-cli)
- [자주 묻는 질문](https://pnpm.io/faq)
- [X](https://x.com/pnpmjs)
- [Bluesky](https://bsky.app/profile/pnpm.io)
- [Discord](https://r.pnpm.io/chat)

## 벤치마크

pnpm 은 npm 및 Yarn classic 보다 최대 2배 빠릅니다. 전체 벤치마크는 [여기](https://r.pnpm.io/benchmarks)에서 확인할 수 있습니다.

의존성이 많은 앱에서의 벤치마크:

![](https://pnpm.io/img/benchmarks/alotta-files.svg)

## 라이선스

[MIT](https://github.com/pnpm/pnpm/blob/main/LICENSE)

---

## 관련 페이지
- [[_glossary/package-manager]]
- [[_glossary/package]]
- [[_glossary/dependency]]
- [[_glossary/monorepo]]
- [[_glossary/lockfile]]
- [[_glossary/content-addressable-storage]]

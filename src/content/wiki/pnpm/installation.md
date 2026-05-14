---
source: https://github.com/pnpm/pnpm.io/blob/main/docs/installation.md
source_commit: 5b4b807c29689bb1d039778c5ba076bd16e6adb5
translated_at: 2026-05-14
project: pnpm
tags: [pnpm, installation, corepack, nodejs, setup]
---

# 설치
*(원제: Installation)*

> 원문: [github.com/pnpm/pnpm.io/blob/main/docs/installation.md](https://github.com/pnpm/pnpm.io/blob/main/docs/installation.md) · 동기화: 2026-05-14 / `5b4b807`

## 사전 요구 사항

독립 실행형 스크립트나 `@pnpm/exe` 를 사용하지 않고 pnpm 을 설치하려면 시스템에 Node.js(최소 v22 이상)가 설치되어 있어야 합니다.

## 독립 실행형 스크립트 사용

Node.js 가 설치되어 있지 않아도 다음 스크립트를 통해 pnpm 을 설치할 수 있습니다.

### Windows

:::warning

이 방법으로 pnpm 을 설치하면 Windows Defender 가 실행 파일을 차단할 수 있습니다.

이 문제로 인해 현재는 Windows 에서 [npm](#using-npm) 또는 [Corepack](#using-corepack) 을 사용하여 pnpm 을 설치하는 방법을 권장합니다.

:::

PowerShell 을 사용합니다:

```powershell
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

Windows 에서 Microsoft Defender 는 패키지 설치 속도를 크게 저하시킬 수 있습니다. 관리자 권한 PowerShell 창에서 다음 명령을 실행하면 Microsoft Defender 의 제외 폴더 목록에 pnpm 을 추가할 수 있습니다:

```powershell
Add-MpPreference -ExclusionPath $(pnpm store path)
```

### POSIX 시스템

:::warning Intel macOS 미지원

독립 실행형 스크립트는 Intel Mac(`darwin-x64`)에서 동작하지 않습니다. 대신 [npm](#using-npm), [Corepack](#using-corepack), 또는 [Homebrew](#using-homebrew) 를 사용합니다. 자세한 내용은 [#11423](https://github.com/pnpm/pnpm/issues/11423) 을 참조합니다.

:::

```sh
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

curl 이 설치되어 있지 않은 경우 wget 을 사용할 수 있습니다:

```sh
wget -qO- https://get.pnpm.io/install.sh | sh -
```

:::info Linux 런타임 요구 사항

설치 스크립트는 시스템의 libc 에 따라 glibc 또는 musl 빌드를 선택하며, Alpine 및 기타 musl 기반 배포판을 위한 별도 musl 빌드도 제공됩니다. glibc 빌드는 glibc 2.27 이상과 `libatomic.so.1` 이 필요합니다. 대부분의 전체 배포판에는 포함되어 있지만 최소 컨테이너 이미지에는 없을 수 있습니다. `error while loading shared libraries: libatomic.so.1` 오류가 발생하면 배포판의 패키지 매니저(package manager)로 설치합니다:

- Debian/Ubuntu: `apt-get install -y libatomic1`
- Fedora/RHEL: `dnf install -y libatomic`

:::

:::tip

이후 [pnpm runtime] 명령을 사용해 Node.js 를 설치할 수 있습니다.

:::

### Docker 컨테이너

```sh
# bash
wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -
# sh
wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -
# dash
wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.dashrc" SHELL="$(which dash)" dash -
```

### 특정 버전 설치

설치 스크립트를 실행하기 전에 환경 변수 `PNPM_VERSION` 을 설정하면 특정 버전의 pnpm 을 설치할 수 있습니다:

```sh
curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=<version> sh -
```

## Corepack 사용

[Corepack 의 오래된 서명 문제](https://github.com/nodejs/corepack/issues/612)로 인해 먼저 Corepack 을 최신 버전으로 업데이트해야 합니다:

```
npm install --global corepack@latest
```

v16.13 부터 Node.js 는 패키지 매니저 관리를 위한 [Corepack](https://nodejs.org/api/corepack.html) 을 제공합니다. 이는 실험적 기능이므로 다음을 실행해 활성화해야 합니다:

:::info

`pnpm runtime` 으로 Node.js 를 설치한 경우 Corepack 이 시스템에 설치되지 않으므로 별도로 설치해야 합니다. 자세한 내용은 [#4029](https://github.com/pnpm/pnpm/issues/4029) 를 참조합니다.

:::

```
corepack enable pnpm
```

이 명령을 실행하면 pnpm 이 자동으로 시스템에 설치됩니다.

다음 명령을 사용해 프로젝트에서 사용할 pnpm 버전을 고정할 수 있습니다:

```
corepack use pnpm@latest-11
```

이 명령은 로컬 `package.json` 에 `"packageManager"` 필드를 추가하여 Corepack 이 해당 프로젝트에서 항상 특정 버전을 사용하도록 지시합니다. 재현성이 중요한 경우에 유용하며, Corepack 을 사용하는 모든 개발자가 동일한 버전을 사용하게 됩니다. 새 버전의 pnpm 이 출시되면 위 명령을 다시 실행할 수 있습니다.

## 다른 패키지 매니저 사용

### npm 사용

pnpm CLI 는 `pnpm` 과 `@pnpm/exe` 두 가지 패키지로 제공됩니다.

- [`pnpm`](https://www.npmjs.com/package/pnpm) 은 Node.js 를 필요로 하는 일반 버전의 pnpm 입니다. v11 부터 순수 ESM 으로 배포됩니다.
- [`@pnpm/exe`](https://www.npmjs.com/package/@pnpm/exe) 는 Node.js 와 함께 실행 파일로 패키징되어 Node.js 가 없는 시스템에서도 사용할 수 있습니다. Linux 에서는 glibc 와 musl 빌드가 모두 제공되며 자동으로 선택됩니다. glibc 빌드는 glibc 2.27 이상과 `libatomic.so.1` 이 필요합니다([Linux 런타임 요구 사항](#on-posix-systems) 참조). **Intel macOS(`darwin-x64`) 미지원** — 대신 `pnpm` 을 설치합니다([#11423](https://github.com/pnpm/pnpm/issues/11423) 참조).

```sh
npx pnpm@latest-11 dlx @pnpm/exe@latest-11 setup
```

또는

```sh
npm install -g pnpm@latest-11
```

### Homebrew 사용

Homebrew 가 설치되어 있다면 다음 명령으로 pnpm 을 설치할 수 있습니다:

```
brew install pnpm
```

### winget 사용

winget 이 설치되어 있다면 다음 명령으로 pnpm 을 설치할 수 있습니다:

```
winget install -e --id pnpm.pnpm
```

### Scoop 사용

Scoop 이 설치되어 있다면 다음 명령으로 pnpm 을 설치할 수 있습니다:

```
scoop install nodejs-lts pnpm
```

### Choco 사용

Chocolatey 가 설치되어 있다면 다음 명령으로 pnpm 을 설치할 수 있습니다:

```
choco install pnpm
```

:::tip

CI 서버에서 pnpm 을 사용하려면 [지속적 통합](./continuous-integration) 문서를 참조합니다.

:::

## 호환성

아래는 과거 pnpm 버전별 Node.js 버전 지원 현황입니다.

| Node.js    | pnpm 8 | pnpm 9 | pnpm 10 | pnpm 11 |
|------------|--------|--------|---------|---------|
| Node.js 14 | ❌     | ❌     | ❌      | ❌      |
| Node.js 16 | ✔️      | ❌     | ❌      | ❌      |
| Node.js 18 | ✔️      | ✔️      | ✔️       | ❌      |
| Node.js 20 | ✔️      | ✔️      | ✔️       | ❌      |
| Node.js 22 | ✔️      | ✔️      | ✔️       | ✔️       |
| Node.js 24 | ✔️      | ✔️      | ✔️       | ✔️       |
| Node.js 26 | ✔️      | ✔️      | ✔️       | ✔️       |

## 문제 해결

pnpm 이 손상되어 재설치로 해결되지 않는 경우, PATH 에서 수동으로 제거해야 할 수 있습니다.

예를 들어 `pnpm install` 실행 시 다음 오류가 발생한다고 가정합니다:

```
C:\src>pnpm install
internal/modules/cjs/loader.js:883
  throw err;
  ^



Error: Cannot find module 'C:\Users\Bence\AppData\Roaming\npm\pnpm-global\4\node_modules\pnpm\bin\pnpm.js'
←[90m    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:880:15)←[39m
←[90m    at Function.Module._load (internal/modules/cjs/loader.js:725:27)←[39m
←[90m    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)←[39m
←[90m    at internal/main/run_main_module.js:17:47←[39m {
  code: ←[32m'MODULE_NOT_FOUND'←[39m,
  requireStack: []
}
```

먼저 `which pnpm` 을 실행해 pnpm 위치를 찾습니다. Windows 에서는 `where.exe pnpm.*` 을 실행합니다.
그러면 다음과 같이 pnpm 명령의 위치를 확인할 수 있습니다:

```
$ which pnpm
/c/Program Files/nodejs/pnpm
```

pnpm CLI 의 위치를 확인했다면 해당 디렉터리를 열고 pnpm 관련 파일(`pnpm.cmd`, `pnpx.cmd`, `pnpm` 등)을 삭제합니다.
완료 후 pnpm 을 다시 설치하면 정상 동작합니다.

## pnpm 업데이트

pnpm 을 업데이트하려면 [`self-update`] 명령을 실행합니다:

```
pnpm self-update
```

[`self-update`]: ./cli/self-update

## pnpm 제거

시스템에서 pnpm CLI 와 디스크에 기록된 파일을 제거하려면 [pnpm 제거][Uninstalling pnpm] 문서를 참조합니다.

[Uninstalling pnpm]: ./uninstall
[pnpm runtime]: ./cli/runtime

---

## 관련 페이지
- [[_glossary/package-manager]]
- [[_glossary/registry]]
- [[wiki/pnpm/README]]
- [[wiki/pnpm/pnpm-cli]]

# HseongH 위키 — 개념 설계

**작성일**: 2026-05-14
**상태**: 컨셉 확정. 구현 계획은 후속 단계에서 작성.

## 한 줄 정의

**HseongH 위키**는 사용자 본인만 보는, 위키형으로 구조화된 IT 공식문서 한국어 번역 모음이다. 본문은 충실한 번역으로 유지하고, 그 위에 LLM이 가벼운 메타 레이어(용어집, 프로젝트 카드, 인덱스, 로그)를 유지한다.

## 핵심 결정 사항

| 항목 | 결정 |
|---|---|
| 독자 | 사용자 본인 단독 (공개 의도 없음) |
| 형식 | 위키형 (시간순 블로그 ❌, 주제별 레퍼런스 ⭕) |
| 번역 성격 | **충실한 번역** — 본문은 원문 구조/순서/의미를 보존. 주석·재구성·의역 ❌ |
| 패턴 | 미러 + 가벼운 위키 레이어 (llm-wiki 패턴의 부분 차용) |
| 이름 | **HseongH** |
| 부제 (index 상단) | `HseongH — 학습 위키` |
| 폴더명 | `~/dev/hseongh-wiki` (`llm-wiki`에서 변경) |

## 페이지 템플릿 & 톤 앤 매너

### 본문 페이지 템플릿

```markdown
---
source: <원문 URL>
source_commit: <원문 GitHub commit hash>
translated_at: YYYY-MM-DD
project: <project-slug>
tags: [...]
---

# 한국어 제목
*(원제: Original Title)*

> 원문: <링크> · 동기화: YYYY-MM-DD / `<commit>`

(본문 — 원문 구조 그대로의 한국어 번역)

---

## 관련 페이지
- [[_glossary/<term>]]
- [[wiki/<project>/<adjacent-page>]]
```

### 구조 원칙

- **순서 보존**: 원문의 헤딩 구조, 단락 순서, 코드 예시, 이미지 위치, 강조 위치를 그대로 유지.
- **코드 블록**: 원문 그대로. 인라인 주석은 번역, 다중 줄 설명 주석은 원어 유지 + 번역 병기.
- **관련 페이지 블록**: 페이지 맨 아래. LLM이 ingest 시 자동으로 다음을 채움:
  1. 본문에서 처음 등장한 모든 용어집 항목 (`_glossary/*`) 링크
  2. 원본 repo에서 같은 디렉토리 내 직전/직후 페이지 (있을 경우)
  3. 사용자가 명시적으로 지정한 cross-link (선택)

### 위키링크 표기 규칙

- 본문 페이지 참조: `[[wiki/<project>/<path>]]` (저장소 루트 기준 전체 경로)
- 메타 페이지 참조: `[[_glossary/<term>]]`, `[[_projects/<project>]]`
- 같은 prefix 규칙을 모든 페이지에서 일관 적용

### 톤 앤 매너 규칙

| 항목 | 규칙 |
|---|---|
| 문체 | 격식체 (`~합니다`, `~입니다`) |
| 2인칭 | `여러분` 으로 통일 (원문 "you" 처리) |
| 전문용어 | 첫 등장 시 `한국어(원어)`, 이후 한국어만. 정착어가 없으면 원어 유지 (예: hook) |
| 약어 | 그대로 유지 (API, REST, HTTP 등) |
| 명령형 | "~하세요" → "~합니다" / "~해야 합니다" (가이드형 명령을 서술로) |

용어 결정은 한 번 정하면 `STYLE.md`에 기록되어 이후 모든 페이지에 적용된다. 새 용어가 등장하면 LLM이 `STYLE.md` 항목 추가 후 본문 작성.

## 폴더 구조

```
hseongh-wiki/
├── index.md          # 글로벌 1개. 첫 진입점
├── log.md            # 글로벌 1개. 시간순 작업 기록
├── STYLE.md          # 글로벌 1개. 톤 앤 매너 + 용어 결정 표
├── _glossary/        # 글로벌 공유. 용어 페이지들
│   ├── promise.md
│   ├── component.md
│   └── ...
├── _projects/        # 프로젝트 카드들
│   ├── react.md
│   └── kubernetes.md
└── wiki/
    ├── react/        # 본문 — 원본 repo 구조를 따라감
    │   └── learn/
    │       └── your-first-component.md
    └── kubernetes/
        └── concepts/
            └── ...
```

### 스코프 원칙

- **메타 정보는 글로벌**: `index.md`, `log.md`, `STYLE.md`, `_glossary/` 는 모든 프로젝트가 공유.
  - 이유: "promise"는 JS든 Node든 같은 개념. 공유 페이지 하나가 양쪽을 가리키면 중복 없고 다시 찾아보기 쉽다.
- **본문은 프로젝트별**: `wiki/<project>/...` 는 원본 GitHub repo 구조를 그대로 미러링.

## 보조 페이지 명세

### `_glossary/<term>.md`

```markdown
---
term: promise
korean: 프로미스
status: 정착어   # 정착어 | 원어유지 | 미정
---

# 프로미스 (promise)

**한국어 정착어**: 프로미스

(한두 문장 정의)

## 등장하는 문서
- [[wiki/js/async/promises]]
- [[wiki/node/api/fs]]
```

- 첫 등장 시 LLM이 자동 생성. 이후 같은 용어를 다른 페이지에서 만나면 등장 목록만 추가.
- `status` 로 번역 정책 명시.

### `_projects/<project>.md`

```markdown
---
project: react
source_repo: <repo URL>
official_site: <site URL>
last_ingest: YYYY-MM-DD   # 이 프로젝트에서 가장 최근에 페이지를 ingest한 날짜
---

# React

(프로젝트 한 줄 소개)

## 번역된 페이지
- [[wiki/react/learn/your-first-component]] — 첫 컴포넌트
- ...

## 번역 안 한 부분 (선택)
- 서버 컴포넌트 — 우선순위 낮음
```

`last_ingest`는 해당 프로젝트의 어떤 본문 페이지든 새로 ingest되거나 재동기화될 때 갱신된다.

### `index.md`

```markdown
# HseongH — 학습 위키

## 프로젝트
- [[_projects/react]] — UI 라이브러리
- [[_projects/kubernetes]] — 컨테이너 오케스트레이션

## 용어집
- [[_glossary/promise]] · [[_glossary/component]] · ...

## 최근 작업
(log.md 마지막 5개 항목 미러)
```

### `log.md`

```markdown
## [YYYY-MM-DD] ingest | <Project>: <Page Title>
원문: <링크> commit <hash>
번역 페이지: [[wiki/<project>/<path>]]
영향받은 페이지: _glossary/<term> (신규), _projects/<project> (업데이트)

## [YYYY-MM-DD] glossary | <term> 정착어 결정
"<한국어>"로 고정. 이전 미정 → 정착어.
```

형식: `## [YYYY-MM-DD] <type> | <Title>`. grep 가능. `<type>` ∈ { ingest, query, lint, glossary }.

### `STYLE.md`

```markdown
# Style Guide

## 문체
- 격식체 (~합니다 / ~입니다)
- 2인칭: "여러분" 통일
- 전문용어: 첫 등장 시 `한국어(원어)`, 이후 한국어만

## 코드 블록 주석
- 인라인 주석은 번역
- 다중 줄 설명은 원어 유지 + 아래에 번역 병기

## 용어 결정 표
| 원어 | 한국어 정착어 | 결정일 | 비고 |
|---|---|---|---|
| component | 컴포넌트 | 2026-05-14 | |
| hook | hook (원어유지) | 2026-05-14 | 정착어 없음 |
```

## 핵심 Operations

llm-wiki 스펙의 세 operation을 HseongH 위키 맥락으로 구체화한다.

### Ingest

1. 사용자가 번역할 공식 문서를 지정 (URL 또는 repo 경로).
2. LLM이 원문을 읽고 핵심 내용을 사용자와 짧게 확인.
3. `wiki/<project>/<path>.md` 에 충실한 번역으로 페이지 작성. 템플릿 준수.
4. 새 용어가 등장하면 `_glossary/<term>.md` 신규 생성 또는 등장 목록 추가.
5. `_projects/<project>.md` 의 "번역된 페이지" 목록 업데이트.
6. `index.md` 와 `log.md` 갱신.

### Query

1. 사용자가 질문.
2. LLM이 `index.md` → 관련 `_projects/` 또는 `_glossary/` 페이지 → 본문 페이지 순으로 탐색.
3. 답변에는 위키 페이지 인용을 포함.
4. 답변이 충실한 번역 원칙 안에서 정리 가능한 것이면 적절한 본문 페이지나 용어집 항목을 보강하는 형태로 파일링한다. 본문 충실성을 깨는 commentary성 종합이 필요하면 그 결과는 위키 외부 (예: 채팅 자체)에 두고 본문은 건드리지 않는다.

### Lint

주기적으로 LLM이 위키 건강 검사:

- 원문이 갱신되었는데 번역 페이지 동기화 안 된 곳 (`source_commit` 비교)
- 용어 사용 일관성 (정착어로 결정된 용어가 본문에서 다르게 쓰인 곳)
- orphan 페이지 (어디서도 링크되지 않는 페이지)
- `STYLE.md` 와 본문 톤이 어긋난 부분
- `_glossary/` 에 있지만 정의가 빈약한 항목

## 기존 파일 처리

| 파일 | 처리 |
|---|---|
| `llm-wiki.md` | **삭제** |
| `CLAUDE.md` | **삭제 후 재작성** — HseongH 위키 운영 매뉴얼로 (디렉토리 구조, 페이지 템플릿 참조, ingest/query/lint operation 정의) |
| 폴더명 `llm-wiki/` | `hseongh-wiki/` 로 변경 |

## 명시적으로 이 spec의 범위 밖

후속 단계에서 구현 계획으로 다룰 것:

- 실제 파일 생성/이동/삭제의 순서와 명령
- 첫 ingest 대상 선정 (어떤 공식문서부터 시작할지)
- Obsidian 워크플로 셋업 (선택)
- 정착어 vs 원어유지 판단 기준의 더 정교한 가이드라인
- `wiki/<project>/` 하위에서 원본 repo 구조를 어떻게 따라갈지의 세부 규칙 (예: monorepo, 다중 docs 디렉토리 등)
- 검색/RAG 도구 도입 시점 판단 (작은 규모에서는 `index.md` 스캔이면 충분; llm-wiki 스펙 참고)

## 향후 변경 가능성

- 위키가 커지면서 `_glossary` 가 비대해지면 카테고리별 하위 폴더 (`_glossary/network/`, `_glossary/concurrency/`) 로 분할 검토.
- 충실한 번역 원칙이 답답해지면 별도 `_notes/` 영역을 도입해 commentary를 본문과 격리하는 방향 검토. 본문 충실성은 어떤 경우에도 유지.
- 정착어가 시간이 지나 바뀌어야 할 경우 (예: 처음엔 원어유지로 두었다가 한국어 정착어가 생긴 경우) `STYLE.md` 표를 갱신하고 lint 단계에서 본문 일괄 교체 검토.

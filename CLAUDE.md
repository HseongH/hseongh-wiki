# CLAUDE.md

이 파일은 LLM 에이전트가 이 위키를 운영할 때 따르는 매뉴얼입니다. 사람용 안내가 아니라 LLM 운영 가이드입니다 (Obsidian/사람은 페이지 본문만 봐도 됩니다).

## 이 폴더는 무엇인가

**HseongH 위키** — 사용자 본인(HseongH)만 사용하는 IT 공식문서 한국어 번역 위키. 본문은 충실한 번역을 유지하고, LLM이 그 위에 가벼운 메타 레이어(용어집, 프로젝트 카드, 인덱스, 로그)를 유지합니다.

컨셉의 전체 설계는 [`docs/superpowers/specs/2026-05-14-hseongh-wiki-concept-design.md`](docs/superpowers/specs/2026-05-14-hseongh-wiki-concept-design.md) 참조. 이 매뉴얼이 모호하면 그 문서가 단일 진실 소스입니다.

## 디렉토리 구조

```
hseongh-wiki/
├── index.md          # 전역 카탈로그. 첫 진입점
├── log.md            # 시간순 작업 로그
├── STYLE.md          # 톤 앤 매너 + 용어 결정 표 (본문 작성의 단일 진실 소스)
├── _glossary/        # 용어 페이지 (글로벌 공유)
├── _projects/        # 프로젝트 카드
└── wiki/             # 본문 — 프로젝트별 폴더, 원본 repo 구조를 따라감
    └── <project>/
```

## 페이지 템플릿

### 본문 페이지 (`wiki/<project>/<path>.md`)

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

### 용어집 (`_glossary/<term>.md`)

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
- [[wiki/<project>/<path>]]
```

### 프로젝트 카드 (`_projects/<project>.md`)

```markdown
---
project: react
source_repo: <repo URL>
official_site: <site URL>
last_ingest: YYYY-MM-DD
---

# Project Name

(한 줄 소개)

## 번역된 페이지
- [[wiki/<project>/<path>]] — 한국어 제목

## 번역 안 한 부분 (선택)
- (의식적으로 제외한 영역과 그 이유)
```

## 톤 앤 매너

`STYLE.md` 가 본문 작성의 단일 진실 소스입니다. 모든 본문은 STYLE.md 의 문체·용어·약어 규칙을 따릅니다.

핵심 (자세한 건 STYLE.md):
- 격식체 (`~합니다` / `~입니다`)
- 2인칭 "여러분" 통일 (원문 "you")
- 전문용어 첫 등장 시 `한국어(원어)` 병기, 이후 한국어만
- **본문은 충실한 번역**. 주석·재구성·의역은 본문에 넣지 않습니다.

## 위키링크 표기 규칙

- 본문 페이지 참조: `[[wiki/<project>/<path>]]` (저장소 루트 기준 전체 경로)
- 메타 페이지 참조: `[[_glossary/<term>]]`, `[[_projects/<project>]]`
- 모든 페이지에서 동일한 prefix 규칙 사용

## 핵심 Operations

### Ingest — 새 문서 번역

1. 사용자가 번역 대상 (URL 또는 GitHub repo 경로) 을 지정합니다.
2. 원문을 읽고 핵심 내용을 사용자와 짧게 확인합니다.
3. `wiki/<project>/<path>.md` 에 충실한 번역을 작성합니다. 페이지 템플릿 준수.
4. 본문에서 처음 등장하는 용어:
   - `_glossary/<term>.md` 가 없으면 신규 생성
   - 있으면 "등장하는 문서" 목록에 본 페이지 추가
   - 새 정착어가 결정되면 `STYLE.md` 의 용어 결정 표 갱신
5. `_projects/<project>.md` 의 "번역된 페이지" 목록과 `last_ingest` 를 갱신합니다.
6. `index.md` 의 프로젝트/용어집/최근 작업 섹션을 갱신합니다.
7. `log.md` 에 `## [YYYY-MM-DD] ingest | <Project>: <Page Title>` 형식의 항목을 추가합니다.

한 번의 ingest 가 영향을 주는 페이지는 보통 5–10개. 일관성을 위해 모두 한 번에 갱신합니다.

### Query — 위키 질의

1. 사용자 질문 수신.
2. `index.md` → 관련 `_projects/` 또는 `_glossary/` → 본문 페이지 순으로 탐색합니다.
3. 답변에는 위키 페이지 인용을 포함합니다 (예: `[[wiki/react/learn/your-first-component]]` 참고).
4. 답변이 충실한 번역 원칙 안에서 정리 가능하면 적절한 본문 페이지나 용어집 항목을 보강합니다. 본문 충실성을 깨는 commentary 가 필요하면 본문은 건드리지 않고 채팅 안에서만 정리합니다.

### Lint — 위키 건강 검사

사용자가 요청하면 다음을 점검하고 보고합니다:

- 원문이 갱신되었는데 번역 페이지 동기화가 안 된 곳 (`source_commit` 비교)
- 용어 사용 일관성 (`STYLE.md` 의 정착어와 다르게 본문에 쓰인 곳)
- orphan 페이지 (어디서도 링크되지 않는 페이지)
- `_glossary/` 의 정의가 빈약한 항목
- `_projects/` 의 `last_ingest` 가 실제 갱신 이력과 어긋난 곳

Lint 결과는 보고만 하고 자동 수정은 하지 않습니다. 사용자 결정 후 일괄 처리합니다.

## log.md 형식

모든 항목은 `## [YYYY-MM-DD] <type> | <Title>` 헤딩으로 시작합니다.
`<type>` ∈ { ingest, query, lint, glossary, style, setup }.

`grep "^## \[" log.md` 로 타임라인을 빠르게 훑을 수 있습니다.

## 주의

- 본문의 "충실한 번역" 원칙은 협상 가능하지 않습니다. 의역·주석·재구성이 필요하면 본문이 아닌 채팅이나 향후 도입할 `_notes/` 영역에 둡니다.
- 정착어 결정은 `STYLE.md` 가 단일 진실 소스. 본문에서 다른 표기가 발견되면 lint 가 잡아냅니다.
- 이 폴더는 git 저장소이며 `origin` 은 `git@github.com:HseongH/hseongh-wiki.git` 입니다. 변경은 commit + push 로 반영합니다.
- LLM 은 본문을 작성하기 전에 항상 `STYLE.md` 를 먼저 확인합니다. 새 용어 결정이 본 작업 중 발생하면 본문 작성 전에 `STYLE.md` 갱신을 완료해야 합니다.

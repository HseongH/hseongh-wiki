---
term: hard link
korean: 하드 링크
status: 정착어
domains: [tooling]
---

# 하드 링크 (hard link)

**한국어 정착어**: 하드 링크

파일 시스템에서 같은 inode(실제 데이터 위치)를 가리키는 여러 디렉터리 항목. 심볼릭 링크와 달리 별도의 파일처럼 보이지만 디스크 공간은 한 번만 차지합니다. pnpm 은 콘텐츠 주소화 저장소에 저장된 파일을 각 프로젝트의 node_modules 로 하드 링크해 추가 디스크 사용 없이 공유합니다. 하드 링크는 같은 파일 시스템 안에서만 작동합니다.

## 등장하는 문서

- [[wiki/pnpm/motivation]]
- [[wiki/pnpm/faq]]
- [[wiki/pnpm/pnpm-vs-npm]]

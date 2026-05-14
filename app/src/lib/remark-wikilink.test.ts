import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { remarkWikilink } from './remark-wikilink';

const transform = async (markdown: string) => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkWikilink, {
      glossaryLookup: { promise: { korean: '프로미스' } },
      wikiLookup: { 'pnpm/README': { title: 'pnpm' } },
      projectLookup: { pnpm: { name: 'pnpm' } },
    })
    .use(remarkStringify)
    .process(markdown);
  return String(result);
};

describe('remark-wikilink', () => {
  it('글로서리 위키링크는 한국어 정착어 텍스트로 변환', async () => {
    const out = await transform('See [[_glossary/promise]] for details.');
    expect(out).toContain('[프로미스](/glossary/promise)');
  });

  it('본문 위키링크는 페이지 제목 텍스트로 변환', async () => {
    const out = await transform('See [[wiki/pnpm/README]].');
    expect(out).toContain('[pnpm](/wiki/pnpm/README)');
  });

  it('프로젝트 위키링크는 프로젝트 이름 텍스트로 변환', async () => {
    const out = await transform('See [[_projects/pnpm]].');
    expect(out).toContain('[pnpm](/projects/pnpm)');
  });

  it('알 수 없는 위키링크는 raw 경로를 텍스트로 사용', async () => {
    const out = await transform('See [[unknown/target]].');
    expect(out).toContain('[unknown/target](/unknown/target)');
  });
});

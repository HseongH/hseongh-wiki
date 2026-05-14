import { describe, it, expect } from 'vitest';
import { buildLookups } from './build-lookups';

describe('buildLookups', () => {
  it('실제 src/content/ 로부터 lookup 을 생성한다', () => {
    const lookups = buildLookups();
    expect(lookups.projectLookup['pnpm']).toBeDefined();
    expect(lookups.projectLookup['pnpm'].name).toBe('pnpm');
    expect(lookups.glossaryLookup['package']).toBeDefined();
    expect(lookups.glossaryLookup['package'].korean).toBe('패키지');
    expect(lookups.wikiLookup['pnpm/motivation']).toBeDefined();
    expect(lookups.wikiLookup['pnpm/motivation'].title).toBe('동기');
  });
});

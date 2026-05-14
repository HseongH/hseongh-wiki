import { describe, expect, it } from 'vitest';
import {
  isUnder,
  normalizeContentFilename,
  wikiHrefFromFilename,
  wikiPathFromFilename,
} from './content-paths';

describe('content-paths', () => {
  it('AnalogJS injectContentFiles filename (no leading slash) is normalized', () => {
    expect(normalizeContentFilename('src/content/wiki/pnpm/motivation.md')).toBe(
      '/src/content/wiki/pnpm/motivation.md'
    );
    expect(normalizeContentFilename('/src/content/wiki/pnpm/motivation.md')).toBe(
      '/src/content/wiki/pnpm/motivation.md'
    );
  });

  it('wikiHrefFromFilename strips leading prefix regardless of slash', () => {
    expect(wikiHrefFromFilename('src/content/wiki/pnpm/motivation.md')).toBe(
      '/wiki/pnpm/motivation'
    );
    expect(wikiHrefFromFilename('/src/content/wiki/pnpm/motivation.md')).toBe(
      '/wiki/pnpm/motivation'
    );
  });

  it('wikiPathFromFilename returns the project-relative path', () => {
    expect(wikiPathFromFilename('src/content/wiki/pnpm/installation.md')).toBe(
      'pnpm/installation'
    );
  });

  it('isUnder matches both slash variants and only the requested subdir', () => {
    expect(isUnder('src/content/_projects/pnpm.md', '_projects')).toBe(true);
    expect(isUnder('/src/content/_projects/pnpm.md', '_projects')).toBe(true);
    expect(isUnder('src/content/wiki/pnpm/foo.md', '_projects')).toBe(false);
    expect(isUnder('src/content/_glossary/promise.md', '_glossary')).toBe(true);
  });
});

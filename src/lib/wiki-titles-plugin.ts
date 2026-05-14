import type { Plugin } from 'vite';
import { buildLookups } from './build-lookups';

const VIRTUAL_ID = 'virtual:wiki-titles';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

// Exposes the build-time wiki/project/glossary title lookups to runtime client
// code so the doc-nav sidebar can render Korean titles without lazy-loading
// every body file. Invalidates on any .md change so dev edits propagate.
export function wikiTitlesPlugin(): Plugin {
  let cache: string | null = null;

  const generate = () => {
    const lookups = buildLookups();
    cache = [
      `export const wikiTitles = ${JSON.stringify(lookups.wikiLookup)};`,
      `export const projectNames = ${JSON.stringify(lookups.projectLookup)};`,
      `export const glossaryKorean = ${JSON.stringify(lookups.glossaryLookup)};`,
    ].join('\n');
    return cache;
  };

  return {
    name: 'hseongh-wiki-titles-virtual',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      return null;
    },
    load(id) {
      if (id === RESOLVED_ID) {
        return cache ?? generate();
      }
      return null;
    },
    handleHotUpdate({ file, server }) {
      if (file.includes('/src/content/') && file.endsWith('.md')) {
        cache = null;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
          server.ws.send({ type: 'full-reload' });
        }
      }
    },
  };
}

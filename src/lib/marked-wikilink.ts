import type { MarkedExtension, Tokens } from 'marked';
import type { Lookups } from './build-lookups';

interface WikilinkToken {
  type: 'wikilink';
  raw: string;
  url: string;
  text: string;
}

function resolveTarget(target: string, lookups: Lookups): { url: string; text: string } {
  if (target.startsWith('_glossary/')) {
    const term = target.slice('_glossary/'.length);
    return {
      url: `/glossary/${term}`,
      text: lookups.glossaryLookup[term]?.korean ?? term,
    };
  }
  if (target.startsWith('_projects/')) {
    const slug = target.slice('_projects/'.length);
    return {
      url: `/projects/${slug}`,
      text: lookups.projectLookup[slug]?.name ?? slug,
    };
  }
  if (target.startsWith('wiki/')) {
    const path = target.slice('wiki/'.length);
    return {
      url: `/wiki/${path}`,
      text: lookups.wikiLookup[path]?.title ?? path,
    };
  }
  return { url: `/${target}`, text: target };
}

export function wikilinkExtension(lookups: Lookups): MarkedExtension {
  return {
    extensions: [
      {
        name: 'wikilink',
        level: 'inline',
        start(src: string) {
          return src.indexOf('[[');
        },
        tokenizer(src: string): WikilinkToken | undefined {
          const m = src.match(/^\[\[([^\]]+)\]\]/);
          if (!m) return undefined;
          const target = m[1];
          const { url, text } = resolveTarget(target, lookups);
          return { type: 'wikilink', raw: m[0], url, text };
        },
        renderer(token: Tokens.Generic): string {
          const t = token as WikilinkToken;
          return `<a href="${t.url}">${t.text}</a>`;
        },
      },
    ],
  };
}

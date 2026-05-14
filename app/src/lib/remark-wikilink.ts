import type { Plugin } from 'unified';
import type { Root, Text } from 'mdast';
import { visit } from 'unist-util-visit';

export interface WikilinkOptions {
  glossaryLookup: Record<string, { korean: string }>;
  wikiLookup: Record<string, { title: string }>;
  projectLookup: Record<string, { name: string }>;
}

const WIKILINK_PATTERN = /\[\[([^\]]+)\]\]/g;

export const remarkWikilink: Plugin<[WikilinkOptions], Root> = (options) => {
  return (tree) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || index == null) return;
      const matches = [...node.value.matchAll(WIKILINK_PATTERN)];
      if (matches.length === 0) return;

      const newNodes: any[] = [];
      let lastEnd = 0;

      for (const match of matches) {
        const start = match.index!;
        const end = start + match[0].length;
        const target = match[1];

        if (start > lastEnd) {
          newNodes.push({ type: 'text', value: node.value.slice(lastEnd, start) });
        }

        const { url, text } = resolveTarget(target, options);
        newNodes.push({
          type: 'link',
          url,
          children: [{ type: 'text', value: text }],
        });

        lastEnd = end;
      }

      if (lastEnd < node.value.length) {
        newNodes.push({ type: 'text', value: node.value.slice(lastEnd) });
      }

      parent.children.splice(index, 1, ...newNodes);
    });
  };
};

function resolveTarget(
  target: string,
  options: WikilinkOptions
): { url: string; text: string } {
  if (target.startsWith('_glossary/')) {
    const term = target.slice('_glossary/'.length);
    const entry = options.glossaryLookup[term];
    return {
      url: `/glossary/${term}`,
      text: entry?.korean ?? term,
    };
  }
  if (target.startsWith('_projects/')) {
    const slug = target.slice('_projects/'.length);
    const entry = options.projectLookup[slug];
    return {
      url: `/projects/${slug}`,
      text: entry?.name ?? slug,
    };
  }
  if (target.startsWith('wiki/')) {
    const path = target.slice('wiki/'.length);
    const entry = options.wikiLookup[path];
    return {
      url: `/wiki/${path}`,
      text: entry?.title ?? path,
    };
  }
  return { url: `/${target}`, text: target };
}

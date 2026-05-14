import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

// __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONTENT_ROOT = join(__dirname, '../content');

export interface Lookups {
  glossaryLookup: Record<string, { korean: string }>;
  wikiLookup: Record<string, { title: string }>;
  projectLookup: Record<string, { name: string }>;
}

export function buildLookups(): Lookups {
  return {
    glossaryLookup: scanGlossary(),
    wikiLookup: scanWiki(),
    projectLookup: scanProjects(),
  };
}

function scanGlossary(): Lookups['glossaryLookup'] {
  const dir = join(CONTENT_ROOT, '_glossary');
  const out: Lookups['glossaryLookup'] = {};
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const slug = file.replace(/\.md$/, '');
    const { data } = matter(readFileSync(join(dir, file), 'utf8'));
    out[slug] = { korean: data.korean ?? slug };
  }
  return out;
}

function scanProjects(): Lookups['projectLookup'] {
  const dir = join(CONTENT_ROOT, '_projects');
  const out: Lookups['projectLookup'] = {};
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const slug = file.replace(/\.md$/, '');
    const { data } = matter(readFileSync(join(dir, file), 'utf8'));
    out[slug] = { name: data.name ?? slug };
  }
  return out;
}

function scanWiki(): Lookups['wikiLookup'] {
  const dir = join(CONTENT_ROOT, '_wiki');
  const out: Lookups['wikiLookup'] = {};
  walk(dir, (filePath) => {
    if (!filePath.endsWith('.md')) return;
    const rel = relative(dir, filePath).replace(/\.md$/, '');
    const { data, content } = matter(readFileSync(filePath, 'utf8'));
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch?.[1]?.trim() ?? data.project ?? rel;
    out[rel] = { title };
  });
  return out;
}

function walk(dir: string, cb: (path: string) => void) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, cb);
    else cb(full);
  }
}

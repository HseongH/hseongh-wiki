import { effect, signal, type Signal } from '@angular/core';
import type { ContentFile } from '@analogjs/content';
import { normalizeContentFilename } from './content-paths';

type FilesMap = Record<string, unknown>;

export function stripFrontmatter(raw: string): string {
  if (typeof raw !== 'string') return '';
  return raw.replace(/^---\n[\s\S]*?\n---\n\n?/, '');
}

// `<analog-markdown>` body's first <h1> would duplicate the page-level <h1>.
// Drop the leading occurrence so it doesn't render twice.
export function stripDuplicateH1(html: string): string {
  return html.replace(/^\s*<h1\b[^>]*>[\s\S]*?<\/h1>\s*/i, '');
}

// Resolves the lazy body loader from `injectContentFilesMap()` for the current
// entry, strips the frontmatter delimiters AnalogJS leaves in front of the
// rendered HTML, and exposes the body as a readonly signal. Must be called
// inside an injection context (e.g. a class field initialiser).
export function loadMarkdownBody<T>(
  entry: Signal<ContentFile<T> | undefined>,
  filesMap: FilesMap,
): Signal<string> {
  const body = signal<string>('');
  effect((onCleanup) => {
    const e = entry();
    if (!e) {
      body.set('');
      return;
    }
    const loader = filesMap[normalizeContentFilename(e.filename)];
    if (typeof loader !== 'function') {
      body.set('');
      return;
    }
    let cancelled = false;
    onCleanup(() => {
      cancelled = true;
    });
    (loader as () => Promise<string>)()
      .then((raw) => {
        if (cancelled) return;
        body.set(stripFrontmatter(raw));
      })
      .catch(() => {
        if (cancelled) return;
        body.set('');
      });
  });
  return body.asReadonly();
}

import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { injectContentFiles, injectContentFilesMap, MarkdownComponent } from '@analogjs/content';
import { TocComponent, TocEntry } from '../../components/toc/toc.component';
import { BadgeComponent } from '../../components/badge/badge.component';

interface WikiAttrs {
  source: string;
  source_commit: string;
  translated_at: string;
  project: string;
  tags?: string[];
}

@Component({
  selector: 'app-wiki-article',
  standalone: true,
  imports: [MarkdownComponent, TocComponent, BadgeComponent],
  template: `
    @if (entry()) {
      <div class="mx-auto grid max-w-(--container-site) grid-cols-[14rem_minmax(0,720px)_14rem] gap-8 px-6 py-12">
        <app-toc [entries]="toc()" />

        <article class="body-md">
          <h1 class="headline-xl mb-2">{{ title() }}</h1>
          <p class="label-md mb-6 text-on-surface-variant">
            원문: <a [href]="entry()!.attributes.source" class="hover:text-primary">{{ entry()!.attributes.source }}</a>
            · 동기화: {{ entry()!.attributes.translated_at }} / {{ entry()!.attributes.source_commit?.slice(0, 7) }}
          </p>
          <analog-markdown [content]="body()" classes="prose prose-lg max-w-none" />

          <div class="mt-12 flex flex-wrap gap-2">
            @for (t of entry()!.attributes.tags ?? []; track t) {
              <app-badge variant="neutral">{{ t }}</app-badge>
            }
          </div>
        </article>

        <aside class="space-y-4">
          <app-badge variant="primary">{{ entry()!.attributes.project }}</app-badge>
        </aside>
      </div>
    } @else {
      <div class="mx-auto max-w-(--container-site) px-6 py-12">
        <p class="body-md text-on-surface-variant">페이지를 찾을 수 없습니다.</p>
      </div>
    }
  `,
})
export default class WikiArticlePage {
  private route = inject(ActivatedRoute);
  private allFiles = injectContentFiles<WikiAttrs>((f) =>
    f.filename.startsWith('/src/content/wiki/')
  );
  private filesMap = injectContentFilesMap();

  // Catch-all routes (`**`) reuse the component on URL changes, so subscribe
  // to the reactive `url` stream rather than reading a one-shot snapshot.
  private segments = toSignal(
    this.route.url.pipe(map((url) => url.map((s) => s.path).join('/'))),
    { initialValue: this.route.snapshot.url.map((s) => s.path).join('/') }
  );

  entry = computed(() => {
    const target = `/src/content/wiki/${this.segments()}`;
    return this.allFiles.find(
      (f) =>
        f.filename === `${target}.md` ||
        f.filename === `${target}/index.md`
    );
  });

  // `injectContentFiles()` returns only frontmatter attributes; the rendered
  // HTML body lives in lazy loaders keyed by filename in `injectContentFilesMap()`.
  // Resolve reactively to the current route via effect.
  rawHtml = signal<string>('');

  constructor() {
    effect((onCleanup) => {
      const e = this.entry();
      if (!e) {
        this.rawHtml.set('');
        return;
      }
      const loader = (this.filesMap as Record<string, unknown>)[e.filename];
      if (typeof loader !== 'function') {
        this.rawHtml.set('');
        return;
      }
      let cancelled = false;
      onCleanup(() => {
        cancelled = true;
      });
      (loader as () => Promise<string>)()
        .then((raw) => {
          if (cancelled) return;
          this.rawHtml.set(stripFrontmatter(raw));
        })
        .catch(() => {
          if (cancelled) return;
          this.rawHtml.set('');
        });
    });
  }

  body = computed(() => this.rawHtml());

  title = computed(
    () => this.rawHtml().match(/<h1\b[^>]*>([\s\S]+?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() ?? ''
  );

  toc = computed<TocEntry[]>(() => {
    const html = this.rawHtml();
    const entries: TocEntry[] = [];
    const re = /<h([234])\b[^>]*\sid="([^"]+)"[^>]*>([\s\S]+?)<\/h\1>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html))) {
      entries.push({
        level: Number(m[1]),
        id: m[2],
        text: m[3].replace(/<[^>]+>/g, '').trim(),
      });
    }
    return entries;
  });
}

function stripFrontmatter(raw: string): string {
  if (typeof raw !== 'string') return '';
  return raw.replace(/^---\n[\s\S]*?\n---\n\n?/, '');
}

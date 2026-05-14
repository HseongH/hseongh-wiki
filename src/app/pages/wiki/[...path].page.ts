import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { injectContentFiles, MarkdownComponent } from '@analogjs/content';
import { TocComponent, TocEntry } from '../../components/toc/toc.component';
import { BadgeComponent } from '../../components/badge/badge.component';

interface WikiAttrs {
  source: string;
  source_commit: string;
  translated_at: string;
  project: string;
  tags?: string[];
}

interface WikiFile {
  filename: string;
  slug: string;
  content?: string | object;
  attributes: WikiAttrs;
}

@Component({
  selector: 'app-wiki-article',
  standalone: true,
  imports: [MarkdownComponent, TocComponent, BadgeComponent],
  template: `
    @if (post()) {
      <div class="mx-auto grid max-w-(--container-site) grid-cols-[14rem_minmax(0,720px)_14rem] gap-8 px-6 py-12">
        <app-toc [entries]="toc()" />

        <article class="body-md">
          <h1 class="headline-xl mb-2">{{ title() }}</h1>
          <p class="label-md mb-6 text-on-surface-variant">
            원문: <a [href]="post()!.attributes.source" class="hover:text-primary">{{ post()!.attributes.source }}</a>
            · 동기화: {{ post()!.attributes.translated_at }} / {{ post()!.attributes.source_commit?.slice(0, 7) }}
          </p>
          <analog-markdown [content]="markdown()" classes="prose prose-lg max-w-none" />

          <div class="mt-12 flex flex-wrap gap-2">
            @for (t of post()!.attributes.tags ?? []; track t) {
              <app-badge variant="neutral">{{ t }}</app-badge>
            }
          </div>
        </article>

        <aside class="space-y-4">
          <app-badge variant="primary">{{ post()!.attributes.project }}</app-badge>
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

  // Catch-all routes (`**`) reuse the component on URL changes, so subscribe to
  // the reactive `url` stream rather than reading a one-shot snapshot.
  private segments = toSignal(
    this.route.url.pipe(map((url) => url.map((s) => s.path).join('/'))),
    { initialValue: this.route.snapshot.url.map((s) => s.path).join('/') }
  );

  post = computed<WikiFile | null>(() => {
    const target = `/src/content/wiki/${this.segments()}`;
    return (
      (this.allFiles.find(
        (f) =>
          f.filename === target ||
          f.filename === `${target}.md` ||
          f.filename === `${target}/index.md`
      ) as WikiFile | undefined) ?? null
    );
  });

  markdown = computed(() => {
    const c = this.post()?.content;
    return typeof c === 'string' ? c : '';
  });

  title = computed(() => this.extractTitle(this.markdown()));

  toc = computed(() => this.extractToc(this.markdown()));

  extractTitle(md: string): string {
    return md.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? '';
  }

  extractToc(md: string): TocEntry[] {
    const entries: TocEntry[] = [];
    for (const line of md.split('\n')) {
      const m = line.match(/^(#{2,4})\s+(.+)$/);
      if (!m) continue;
      const level = m[1].length;
      const text = m[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w가-힣\s-]/g, '')
        .replace(/\s+/g, '-');
      entries.push({ level, text, id });
    }
    return entries;
  }
}

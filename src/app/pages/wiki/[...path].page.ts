import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
export default class WikiArticlePage implements OnInit {
  private route = inject(ActivatedRoute);
  private allFiles = injectContentFiles<WikiAttrs>((f) =>
    f.filename.startsWith('/src/content/wiki/')
  );

  post = signal<WikiFile | null>(null);
  toc = signal<TocEntry[]>([]);

  markdown = computed(() => {
    const c = this.post()?.content;
    return typeof c === 'string' ? c : '';
  });

  title = computed(() => this.extractTitle(this.markdown()));

  ngOnInit(): void {
    // For catch-all route (**), reconstruct path from URL segments.
    // The route URL at this level contains all segments after /wiki/
    const segments = this.route.snapshot.url.map((s) => s.path).join('/');
    const target = `/src/content/wiki/${segments}`;

    // Try exact match, then with .md, then index.md
    const match =
      this.allFiles.find(
        (f) =>
          f.filename === target ||
          f.filename === `${target}.md` ||
          f.filename === `${target}/index.md`
      ) ?? null;

    this.post.set(match as WikiFile | null);
    if (match) {
      this.toc.set(this.extractToc(match.content ?? ''));
    }
  }

  extractTitle(md: string): string {
    return md.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? '';
  }

  extractToc(md: string | object): TocEntry[] {
    if (typeof md !== 'string') return [];
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

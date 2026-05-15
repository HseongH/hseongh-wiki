import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { injectContentFiles, injectContentFilesMap, MarkdownComponent } from '@analogjs/content';
import { wikiTitles } from 'virtual:wiki-titles';
import { BadgeComponent } from '../../components/badge/badge.component';
import { DocNavComponent } from '../../components/doc-nav/doc-nav.component';
import {
  isUnder,
  normalizeContentFilename,
  wikiPathFromFilename,
} from '../../../lib/content-paths';
import { loadMarkdownBody, stripDuplicateH1 } from '../../../lib/markdown-body';

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
  imports: [MarkdownComponent, BadgeComponent, DocNavComponent],
  template: `
    <div
      class="mx-auto grid max-w-(--container-site) grid-cols-[14rem_minmax(0,1fr)] gap-8 px-6 py-12"
    >
      <app-doc-nav />
      @if (entry()) {
        <article class="body-md max-w-(--container-article)">
          <div class="mb-4 flex items-center gap-2">
            <app-badge variant="primary">{{ entry()!.attributes.project }}</app-badge>
          </div>
          <h1 class="headline-xl mb-2">{{ title() }}</h1>
          <p class="label-md mb-6 text-on-surface-variant">
            원문:
            <a [href]="entry()!.attributes.source" class="hover:text-primary">{{
              entry()!.attributes.source
            }}</a>
            · 동기화: {{ entry()!.attributes.translated_at }} /
            {{ entry()!.attributes.source_commit?.slice(0, 7) }}
          </p>
          <analog-markdown [content]="body()" classes="prose prose-lg max-w-none" />

          <div class="mt-12 flex flex-wrap gap-2">
            @for (t of entry()!.attributes.tags ?? []; track t) {
              <app-badge variant="neutral">{{ t }}</app-badge>
            }
          </div>
        </article>
      } @else {
        <p class="body-md text-on-surface-variant">페이지를 찾을 수 없습니다.</p>
      }
    </div>
  `,
})
export default class WikiArticlePage {
  private router = inject(Router);
  private allFiles = injectContentFiles<WikiAttrs>((f) => isUnder(f.filename, '_wiki'));
  private filesMap = injectContentFilesMap();

  // Angular's `**` wildcard does not expose the matched segments on the
  // activated route, so parse the full URL from the Router instead. Reactive
  // via NavigationEnd so navigation between catch-all paths re-derives.
  private segments = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      startWith(null),
      map(() => extractWikiPath(this.router.url)),
    ),
    { initialValue: extractWikiPath(this.router.url) },
  );

  entry = computed(() => {
    const segs = this.segments();
    const target = `/src/content/_wiki/${segs}`;
    return this.allFiles.find((f) => {
      const fn = normalizeContentFilename(f.filename);
      return fn === `${target}.md` || fn === `${target}/index.md`;
    });
  });

  private rawHtml = loadMarkdownBody(this.entry, this.filesMap as Record<string, unknown>);
  body = computed(() => stripDuplicateH1(this.rawHtml()));

  title = computed(() => {
    const e = this.entry();
    if (!e) return '';
    const path = wikiPathFromFilename(e.filename);
    return wikiTitles[path]?.title ?? path.split('/').pop() ?? path;
  });
}

function extractWikiPath(routerUrl: string): string {
  // Router.url is the full URL ('/wiki/pnpm/motivation?x=1'). Strip the '/wiki/'
  // prefix plus any query string / fragment so what remains lines up with the
  // file's project-relative path under src/content/_wiki/.
  return routerUrl.replace(/[?#].*$/, '').replace(/^\/wiki\/?/, '');
}

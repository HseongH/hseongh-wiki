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
      class="mx-auto grid max-w-(--container-site) grid-cols-1 gap-12 px-(--spacing-grid-margin) py-16 md:grid-cols-[14rem_minmax(0,1fr)]"
    >
      <aside class="hidden md:block"><app-doc-nav /></aside>

      @if (entry(); as e) {
        <article>
          <!-- Editorial meta row -->
          <div class="flex items-center gap-3 mb-8 flex-wrap">
            <span class="label-sm text-primary bg-primary-fixed px-2 py-1">{{
              e.attributes.project
            }}</span>
            <span class="label-sm text-outline">{{ e.attributes.translated_at }}</span>
            <span class="label-sm text-outline">·</span>
            <span class="label-sm text-outline">{{ e.attributes.source_commit?.slice(0, 7) }}</span>
          </div>

          <!-- Headline -->
          <h1 class="headline-xl text-on-surface mb-8 leading-tight">{{ title() }}</h1>

          <!-- Source attribution divider -->
          <div class="border-t border-outline-variant pt-6 mb-12">
            <p class="label-md text-on-surface-variant">
              원문:
              <a
                [href]="e.attributes.source"
                target="_blank"
                rel="noopener"
                class="text-primary border-b border-primary-fixed-dim hover:border-primary transition-colors"
              >
                {{ e.attributes.source }}
              </a>
            </p>
          </div>

          <!-- Body -->
          <analog-markdown [content]="body()" classes="prose max-w-none" />

          <!-- Tags footer -->
          @if ((e.attributes.tags?.length ?? 0) > 0) {
            <div class="mt-16 pt-8 border-t border-outline-variant">
              <p class="label-sm text-outline mb-4">Tags</p>
              <div class="flex flex-wrap gap-2">
                @for (t of e.attributes.tags ?? []; track t) {
                  <app-badge variant="outline">{{ t }}</app-badge>
                }
              </div>
            </div>
          }
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
  return routerUrl.replace(/[?#].*$/, '').replace(/^\/wiki\/?/, '');
}

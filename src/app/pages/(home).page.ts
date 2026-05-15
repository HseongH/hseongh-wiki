import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectContentFiles } from '@analogjs/content';
import { wikiTitles } from 'virtual:wiki-titles';
import { DocNavComponent } from '../components/doc-nav/doc-nav.component';
import { PostCardComponent, PostCardData } from '../components/post-card/post-card.component';
import { isUnder, wikiHrefFromFilename, wikiPathFromFilename } from '../../lib/content-paths';

interface WikiAttrs {
  project: string;
  translated_at: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, DocNavComponent, PostCardComponent],
  template: `
    <section
      class="mx-auto grid max-w-(--container-site) grid-cols-1 gap-12 px-(--spacing-grid-margin) py-16 md:grid-cols-[14rem_minmax(0,1fr)]"
    >
      <aside class="hidden md:block"><app-doc-nav /></aside>

      <div>
        <p class="label-sm text-outline mb-4">Latest translations</p>
        <h1 class="font-display text-primary italic mb-16 text-5xl md:text-6xl font-semibold">
          Distilled docs.
        </h1>

        @if (featured(); as f) {
          <article class="mb-20 pb-16 border-b border-outline-variant group hover:cursor-pointer">
            <div class="flex items-center gap-3 mb-6">
              <span class="label-sm text-primary bg-primary-fixed px-2 py-1">{{ f.project }}</span>
              <span class="label-sm text-outline">{{ f.translatedAt }}</span>
              <span class="label-sm text-outline">FEATURED</span>
            </div>
            <h2
              class="headline-xl mb-6 leading-tight group-hover:text-primary transition-colors text-on-surface"
            >
              <a [routerLink]="f.href">{{ f.title }}</a>
            </h2>
            <a
              [routerLink]="f.href"
              class="label-sm inline-flex items-center gap-2 text-primary group-hover:gap-4 transition-all"
            >
              Read more <span aria-hidden="true">→</span>
            </a>
          </article>
        }

        @if (rest().length) {
          <div class="grid grid-cols-1 gap-12 md:grid-cols-2">
            @for (p of rest(); track p.href) {
              <app-post-card [post]="p" />
            }
          </div>
        }
      </div>
    </section>
  `,
})
export default class HomePage {
  private files = injectContentFiles<WikiAttrs>((f) => isUnder(f.filename, '_wiki'));

  private posts = computed<PostCardData[]>(() =>
    this.files
      .slice()
      .sort((a, b) =>
        (b.attributes.translated_at ?? '').localeCompare(a.attributes.translated_at ?? ''),
      )
      .slice(0, 13)
      .map((f) => {
        const path = wikiPathFromFilename(f.filename);
        return {
          title: wikiTitles[path]?.title ?? path.split('/').pop() ?? path,
          excerpt: '',
          project: f.attributes.project,
          translatedAt: f.attributes.translated_at,
          href: wikiHrefFromFilename(f.filename),
        };
      }),
  );

  featured = computed(() => this.posts()[0]);
  rest = computed(() => this.posts().slice(1));
}

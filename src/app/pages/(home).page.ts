import { Component } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import { wikiTitles } from 'virtual:wiki-titles';
import { DocNavComponent } from '../components/doc-nav/doc-nav.component';
import { PostCardComponent, PostCardData } from '../components/post-card/post-card.component';

interface WikiAttrs {
  project: string;
  translated_at: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [DocNavComponent, PostCardComponent],
  template: `
    <section class="mx-auto grid max-w-(--container-site) grid-cols-[14rem_1fr] gap-8 px-6 py-12">
      <app-doc-nav />
      <div>
        <h1 class="headline-lg mb-6">최근 게시글</h1>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          @for (p of posts; track p.href) {
            <app-post-card [post]="p" />
          }
        </div>
      </div>
    </section>
  `,
})
export default class HomePage {
  private files = injectContentFiles<WikiAttrs>((f) =>
    f.filename.startsWith('/src/content/wiki/')
  );

  posts: PostCardData[] = this.files
    .sort((a, b) =>
      (b.attributes.translated_at ?? '').localeCompare(a.attributes.translated_at ?? '')
    )
    .slice(0, 12)
    .map((f) => {
      const path = f.filename
        .replace(/^\/src\/content\/wiki\//, '')
        .replace(/\.md$/, '');
      return {
        title: wikiTitles[path]?.title ?? path.split('/').pop() ?? path,
        excerpt: '',
        project: f.attributes.project,
        translatedAt: f.attributes.translated_at,
        href: `/wiki/${path}`,
      };
    });
}

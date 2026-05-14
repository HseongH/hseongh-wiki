import { Component } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import { DomainSidebarComponent } from '../components/domain-sidebar/domain-sidebar.component';
import { PostCardComponent, PostCardData } from '../components/post-card/post-card.component';

interface WikiAttrs {
  project: string;
  translated_at: string;
  title?: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [DomainSidebarComponent, PostCardComponent],
  template: `
    <section class="mx-auto grid max-w-(--container-site) grid-cols-[14rem_1fr] gap-8 px-6 py-12">
      <app-domain-sidebar />
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
    .map((f) => ({
      title: f.attributes.title ?? titleFromFilename(f.filename),
      excerpt: '',
      project: f.attributes.project,
      translatedAt: f.attributes.translated_at,
      href: hrefFromFilename(f.filename),
    }));
}

// `injectContentFiles()` exposes only frontmatter and a basename `slug`, so the
// route URL and a fallback title are derived from `filename` until per-page
// `title` fields are added to wiki frontmatter.
function hrefFromFilename(filename: string): string {
  return filename
    .replace(/^\/src\/content\/wiki\//, '/wiki/')
    .replace(/\.md$/, '');
}

function titleFromFilename(filename: string): string {
  return filename.split('/').pop()?.replace(/\.md$/, '') ?? '';
}

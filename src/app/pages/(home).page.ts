import { Component } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import { DomainSidebarComponent } from '../components/domain-sidebar/domain-sidebar.component';
import { PostCardComponent, PostCardData } from '../components/post-card/post-card.component';

interface WikiAttrs {
  project: string;
  translated_at: string;
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
    .map((f) => {
      const content = typeof f.content === 'string' ? f.content : '';
      return {
        title: this.extractTitle(content),
        excerpt: this.extractExcerpt(content),
        project: f.attributes.project,
        translatedAt: f.attributes.translated_at,
        href: f.slug?.replace(/^\/src\/content/, '') ?? '/',
      };
    });

  private extractTitle(md: string): string {
    return md.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? '제목 없음';
  }

  private extractExcerpt(md: string): string {
    const para = md
      .split('\n\n')
      .find((b) => b.trim() && !b.startsWith('#') && !b.startsWith('---') && !b.startsWith('>'));
    return (para ?? '').replace(/\s+/g, ' ').slice(0, 160);
  }
}

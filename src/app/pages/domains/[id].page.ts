import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { injectContentFiles } from '@analogjs/content';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { DomainService } from '../../services/domain.service';
import { PostCardComponent, PostCardData } from '../../components/post-card/post-card.component';

interface ProjectAttrs {
  project: string;
  name: string;
  summary?: string;
  domain: string;
}

interface WikiAttrs {
  project: string;
  translated_at: string;
}

@Component({
  selector: 'app-domain-page',
  standalone: true,
  imports: [RouterLink, PostCardComponent],
  template: `
    @if (domain(); as d) {
      <section class="mx-auto max-w-(--container-site) px-6 py-12">
        <h1 class="headline-xl">{{ d.name }}</h1>
        <p class="body-lg mt-2 text-on-surface-variant">{{ d.summary }}</p>

        <h2 class="headline-md mt-12 mb-4">프로젝트</h2>
        <ul class="grid grid-cols-1 gap-4 md:grid-cols-2">
          @for (p of projectsInDomain(); track p.project) {
            <li>
              <a [routerLink]="['/projects', p.project]" class="block rounded-lg border border-outline-variant p-4 hover:bg-surface-low">
                <h3 class="headline-md">{{ p.name }}</h3>
                <p class="body-md text-on-surface-variant mt-2">{{ p.summary }}</p>
              </a>
            </li>
          }
        </ul>

        <h2 class="headline-md mt-12 mb-4">본문</h2>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          @for (post of postsInDomain(); track post.href) {
            <app-post-card [post]="post" />
          }
        </div>
      </section>
    } @else {
      <p class="mx-auto max-w-(--container-article) px-6 py-12">도메인을 찾을 수 없습니다.</p>
    }
  `,
})
export default class DomainPage {
  private route = inject(ActivatedRoute);
  private domainService = inject(DomainService);
  private id = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('id') ?? '')),
    { initialValue: '' }
  );

  private projects = injectContentFiles<ProjectAttrs>((f) =>
    f.filename.startsWith('/src/content/_projects/')
  );
  private wikiFiles = injectContentFiles<WikiAttrs>((f) =>
    f.filename.startsWith('/src/content/wiki/')
  );

  domain = computed(() => this.domainService.listDomains().find((d) => d.id === this.id()));

  projectsInDomain = computed(() =>
    this.projects.filter((p) => p.attributes.domain === this.id()).map((p) => p.attributes)
  );

  postsInDomain = computed<PostCardData[]>(() => {
    const projectSlugs = this.projectsInDomain().map((p) => p.project);
    return this.wikiFiles
      .filter((f) => projectSlugs.includes(f.attributes.project))
      .map((f) => ({
        title: (f.content?.match(/^#\s+(.+)$/m)?.[1] ?? '').trim(),
        excerpt: '',
        project: f.attributes.project,
        translatedAt: f.attributes.translated_at,
        href: f.slug?.replace(/^\/src\/content/, '') ?? '/',
      }));
  });
}

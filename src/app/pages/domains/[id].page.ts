import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { injectContentFiles } from '@analogjs/content';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { wikiTitles } from 'virtual:wiki-titles';
import { DomainService } from '../../services/domain.service';
import { PostCardComponent, PostCardData } from '../../components/post-card/post-card.component';
import { DocNavComponent } from '../../components/doc-nav/doc-nav.component';
import { isUnder, wikiHrefFromFilename, wikiPathFromFilename } from '../../../lib/content-paths';

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
  imports: [RouterLink, PostCardComponent, DocNavComponent],
  template: `
    <div class="mx-auto grid max-w-(--container-site) grid-cols-[14rem_1fr] gap-8 px-6 py-12">
      <app-doc-nav />
      @if (domain(); as d) {
        <section>
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
        <p class="body-md text-on-surface-variant">도메인을 찾을 수 없습니다.</p>
      }
    </div>
  `,
})
export default class DomainPage {
  private route = inject(ActivatedRoute);
  private domainService = inject(DomainService);
  private id = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('id') ?? '')),
    { initialValue: '' }
  );

  private projects = injectContentFiles<ProjectAttrs>((f) => isUnder(f.filename, '_projects'));
  private wikiFiles = injectContentFiles<WikiAttrs>((f) => isUnder(f.filename, '_wiki'));

  domain = computed(() => this.domainService.listDomains().find((d) => d.id === this.id()));

  projectsInDomain = computed(() =>
    this.projects.filter((p) => p.attributes.domain === this.id()).map((p) => p.attributes)
  );

  postsInDomain = computed<PostCardData[]>(() => {
    const projectSlugs = this.projectsInDomain().map((p) => p.project);
    return this.wikiFiles
      .filter((f) => projectSlugs.includes(f.attributes.project))
      .map((f) => {
        const path = wikiPathFromFilename(f.filename);
        return {
          title: wikiTitles[path]?.title ?? path.split('/').pop() ?? path,
          excerpt: '',
          project: f.attributes.project,
          translatedAt: f.attributes.translated_at,
          href: wikiHrefFromFilename(f.filename),
        };
      });
  });
}

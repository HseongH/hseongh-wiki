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
    <div
      class="mx-auto grid max-w-(--container-site) grid-cols-1 gap-12 px-(--spacing-grid-margin) py-16 md:grid-cols-[14rem_minmax(0,1fr)]"
    >
      <aside class="hidden md:block"><app-doc-nav /></aside>
      @if (domain(); as d) {
        <section>
          <p class="label-sm text-outline mb-4">Domain</p>
          <h1 class="headline-xl text-on-surface mb-3">{{ d.name }}</h1>
          @if (d.summary) {
            <p class="font-display text-2xl italic text-on-surface-variant leading-snug mb-12">
              {{ d.summary }}
            </p>
          }

          <h2
            class="font-display text-3xl font-semibold text-on-surface mt-12 mb-6 pt-12 border-t border-outline-variant"
          >
            프로젝트
          </h2>
          <ul class="grid grid-cols-1 gap-6 md:grid-cols-2">
            @for (p of projectsInDomain(); track p.project) {
              <li>
                <a
                  [routerLink]="['/projects', p.project]"
                  class="block rounded-lg bg-surface-container-lowest p-(--spacing-card-padding) shadow-editorial border border-outline-variant hover:border-primary transition-colors group"
                >
                  <h3
                    class="font-display text-2xl font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors"
                  >
                    {{ p.name }}
                  </h3>
                  @if (p.summary) {
                    <p class="body-md text-on-surface-variant">{{ p.summary }}</p>
                  }
                </a>
              </li>
            }
          </ul>

          @if (postsInDomain().length) {
            <h2
              class="font-display text-3xl font-semibold text-on-surface mt-16 mb-6 pt-12 border-t border-outline-variant"
            >
              본문
            </h2>
            <div class="grid grid-cols-1 gap-12 md:grid-cols-2">
              @for (post of postsInDomain(); track post.href) {
                <app-post-card [post]="post" />
              }
            </div>
          }
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
  private id = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '',
  });

  private projects = injectContentFiles<ProjectAttrs>((f) => isUnder(f.filename, '_projects'));
  private wikiFiles = injectContentFiles<WikiAttrs>((f) => isUnder(f.filename, '_wiki'));

  domain = computed(() => this.domainService.listDomains().find((d) => d.id === this.id()));

  projectsInDomain = computed(() =>
    this.projects.filter((p) => p.attributes.domain === this.id()).map((p) => p.attributes),
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

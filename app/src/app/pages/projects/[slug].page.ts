import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { injectContentFiles, MarkdownComponent } from '@analogjs/content';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BadgeComponent } from '../../components/badge/badge.component';

interface ProjectAttrs {
  project: string;
  name: string;
  summary?: string;
  domain: string;
  source_repo?: string;
  official_site?: string;
  last_ingest?: string;
}

interface WikiAttrs {
  project: string;
  translated_at: string;
}

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [MarkdownComponent, RouterLink, BadgeComponent],
  template: `
    @if (project(); as p) {
      <section class="mx-auto max-w-(--container-article) px-6 py-12">
        <app-badge variant="primary">{{ p.attributes.domain }}</app-badge>
        <h1 class="headline-xl mt-3">{{ p.attributes.name }}</h1>
        <p class="body-lg mt-2 text-on-surface-variant">{{ p.attributes.summary }}</p>

        <div class="my-6 flex gap-4 label-md">
          @if (p.attributes.source_repo) {
            <a [href]="p.attributes.source_repo" target="_blank" rel="noopener" class="hover:text-primary">Source repo →</a>
          }
          @if (p.attributes.official_site) {
            <a [href]="p.attributes.official_site" target="_blank" rel="noopener" class="hover:text-primary">Official site →</a>
          }
        </div>

        <analog-markdown [content]="p.content ?? ''" classes="prose max-w-none" />

        <h2 class="headline-md mt-12 mb-4">번역된 페이지</h2>
        <ul class="space-y-2">
          @for (page of pagesForProject(); track page.href) {
            <li>
              <a [routerLink]="page.href" class="hover:text-primary">{{ page.title }}</a>
              <span class="label-md text-on-surface-variant"> · {{ page.translated_at }}</span>
            </li>
          }
        </ul>
      </section>
    } @else {
      <p class="mx-auto max-w-(--container-article) px-6 py-12">프로젝트를 찾을 수 없습니다.</p>
    }
  `,
})
export default class ProjectPage {
  private route = inject(ActivatedRoute);
  private slug = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('slug') ?? '')),
    { initialValue: '' }
  );

  private projectFiles = injectContentFiles<ProjectAttrs>((f) =>
    f.filename.startsWith('/src/content/_projects/')
  );

  private wikiFiles = injectContentFiles<WikiAttrs>((f) =>
    f.filename.startsWith('/src/content/wiki/')
  );

  project = computed(() => {
    const s = this.slug();
    return this.projectFiles.find(
      (f) => f.slug === s || f.filename === `/src/content/_projects/${s}.md`
    );
  });

  pagesForProject = computed(() => {
    const p = this.project();
    if (!p) return [];
    return this.wikiFiles
      .filter((f) => f.attributes.project === p.attributes.project)
      .map((f) => ({
        title: (f.content?.match(/^#\s+(.+)$/m)?.[1] ?? '').trim(),
        href: f.slug?.replace(/^\/src\/content/, '') ?? '/',
        translated_at: f.attributes.translated_at,
      }));
  });
}

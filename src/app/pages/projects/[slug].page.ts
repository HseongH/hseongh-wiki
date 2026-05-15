import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { injectContentFiles, injectContentFilesMap, MarkdownComponent } from '@analogjs/content';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BadgeComponent } from '../../components/badge/badge.component';
import { DocNavComponent } from '../../components/doc-nav/doc-nav.component';
import { wikiTitles } from 'virtual:wiki-titles';
import {
  isUnder,
  normalizeContentFilename,
  wikiHrefFromFilename,
  wikiPathFromFilename,
} from '../../../lib/content-paths';
import { loadMarkdownBody, stripDuplicateH1 } from '../../../lib/markdown-body';

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
  imports: [MarkdownComponent, RouterLink, BadgeComponent, DocNavComponent],
  template: `
    <div
      class="mx-auto grid max-w-(--container-site) grid-cols-1 gap-12 px-(--spacing-grid-margin) py-16 md:grid-cols-[14rem_minmax(0,1fr)]"
    >
      <aside class="hidden md:block"><app-doc-nav /></aside>
      @if (project(); as p) {
        <section class="max-w-(--container-article)">
          <div class="flex items-center gap-3 mb-6">
            <app-badge variant="primary">{{ p.attributes.domain }}</app-badge>
            <span class="label-sm text-outline">Project card</span>
          </div>

          <h1 class="headline-xl text-on-surface mb-3">{{ p.attributes.name }}</h1>
          @if (p.attributes.summary) {
            <p class="font-display text-2xl italic text-on-surface-variant leading-snug mb-8">
              {{ p.attributes.summary }}
            </p>
          }

          <div class="flex flex-wrap gap-6 label-sm border-t border-outline-variant pt-6 mb-12">
            @if (p.attributes.source_repo) {
              <a
                [href]="p.attributes.source_repo"
                target="_blank"
                rel="noopener"
                class="text-primary hover:text-primary-container transition-colors inline-flex items-center gap-1"
                >Source repo <span aria-hidden="true">→</span></a
              >
            }
            @if (p.attributes.official_site) {
              <a
                [href]="p.attributes.official_site"
                target="_blank"
                rel="noopener"
                class="text-primary hover:text-primary-container transition-colors inline-flex items-center gap-1"
                >Official site <span aria-hidden="true">→</span></a
              >
            }
            @if (p.attributes.last_ingest) {
              <span class="text-outline">Last sync · {{ p.attributes.last_ingest }}</span>
            }
          </div>

          <analog-markdown [content]="body()" classes="prose max-w-none" />

          <h2
            class="font-display text-3xl font-semibold text-on-surface mt-16 mb-6 pt-12 border-t border-outline-variant"
          >
            번역된 페이지
          </h2>
          <ul class="border-t border-outline-variant">
            @for (page of pagesForProject(); track page.href) {
              <li class="border-b border-outline-variant">
                <a
                  [routerLink]="page.href"
                  class="flex items-center justify-between gap-4 py-4 group transition-colors"
                >
                  <span
                    class="font-display text-xl text-on-surface group-hover:text-primary transition-colors"
                    >{{ page.title }}</span
                  >
                  <span class="label-sm text-outline">{{ page.translated_at }}</span>
                </a>
              </li>
            }
          </ul>
        </section>
      } @else {
        <p class="body-md text-on-surface-variant">프로젝트를 찾을 수 없습니다.</p>
      }
    </div>
  `,
})
export default class ProjectPage {
  private route = inject(ActivatedRoute);
  private slug = toSignal(this.route.paramMap.pipe(map((p) => p.get('slug') ?? '')), {
    initialValue: '',
  });

  private projectFiles = injectContentFiles<ProjectAttrs>((f) => isUnder(f.filename, '_projects'));

  private wikiFiles = injectContentFiles<WikiAttrs>((f) => isUnder(f.filename, '_wiki'));

  private filesMap = injectContentFilesMap();

  project = computed(() => {
    const s = this.slug();
    return this.projectFiles.find(
      (f) =>
        f.slug === s || normalizeContentFilename(f.filename) === `/src/content/_projects/${s}.md`,
    );
  });

  private rawHtml = loadMarkdownBody(this.project, this.filesMap as Record<string, unknown>);
  body = computed(() => stripDuplicateH1(this.rawHtml()));

  pagesForProject = computed(() => {
    const p = this.project();
    if (!p) return [];
    return this.wikiFiles
      .filter((f) => f.attributes.project === p.attributes.project)
      .map((f) => ({
        title: wikiTitleFromFilename(f.filename),
        href: wikiHrefFromFilename(f.filename),
        translated_at: f.attributes.translated_at,
      }));
  });
}

function wikiTitleFromFilename(filename: string): string {
  const path = wikiPathFromFilename(filename);
  return wikiTitles[path]?.title ?? path.split('/').pop() ?? path;
}

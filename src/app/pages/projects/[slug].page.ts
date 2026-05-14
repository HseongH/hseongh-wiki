import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { injectContentFiles, injectContentFilesMap, MarkdownComponent } from '@analogjs/content';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BadgeComponent } from '../../components/badge/badge.component';
import { DocNavComponent } from '../../components/doc-nav/doc-nav.component';
import { wikiTitles } from 'virtual:wiki-titles';
import { isUnder, normalizeContentFilename, wikiHrefFromFilename, wikiPathFromFilename } from '../../../lib/content-paths';

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
    <div class="mx-auto grid max-w-(--container-site) grid-cols-[14rem_1fr] gap-8 px-6 py-12">
      <app-doc-nav />
      @if (project(); as p) {
        <section class="max-w-(--container-article)">
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

          <analog-markdown [content]="body()" classes="prose max-w-none" />

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
        <p class="body-md text-on-surface-variant">프로젝트를 찾을 수 없습니다.</p>
      }
    </div>
  `,
})
export default class ProjectPage {
  private route = inject(ActivatedRoute);
  private slug = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('slug') ?? '')),
    { initialValue: '' }
  );

  private projectFiles = injectContentFiles<ProjectAttrs>((f) =>
    isUnder(f.filename, '_projects')
  );

  private wikiFiles = injectContentFiles<WikiAttrs>((f) => isUnder(f.filename, 'wiki'));

  private filesMap = injectContentFilesMap();

  project = computed(() => {
    const s = this.slug();
    return this.projectFiles.find(
      (f) => f.slug === s || normalizeContentFilename(f.filename) === `/src/content/_projects/${s}.md`
    );
  });

  rawHtml = signal<string>('');

  constructor() {
    effect((onCleanup) => {
      const p = this.project();
      if (!p) {
        this.rawHtml.set('');
        return;
      }
      const loader = (this.filesMap as Record<string, unknown>)[normalizeContentFilename(p.filename)];
      if (typeof loader !== 'function') {
        this.rawHtml.set('');
        return;
      }
      let cancelled = false;
      onCleanup(() => {
        cancelled = true;
      });
      (loader as () => Promise<string>)()
        .then((raw) => {
          if (cancelled) return;
          this.rawHtml.set(stripFrontmatter(raw));
        })
        .catch(() => {
          if (cancelled) return;
          this.rawHtml.set('');
        });
    });
  }

  body = computed(() => this.rawHtml());

  pagesForProject = computed(() => {
    const p = this.project();
    if (!p) return [];
    return this.wikiFiles
      .filter((f) => f.attributes.project === p.attributes.project)
      .map((f) => ({
        title: wikiTitleFromFilename(f.filename),
        href: hrefFromWikiFilename(f.filename),
        translated_at: f.attributes.translated_at,
      }));
  });
}

function stripFrontmatter(raw: string): string {
  if (typeof raw !== 'string') return '';
  return raw.replace(/^---\n[\s\S]*?\n---\n\n?/, '');
}

// `injectContentFiles` exposes only frontmatter and a basename `slug`, so derive
// the link target from `filename` and look up the title via the build-time
// `virtual:wiki-titles` lookup populated by `buildLookups()`.
function hrefFromWikiFilename(filename: string): string {
  return wikiHrefFromFilename(filename);
}

function wikiTitleFromFilename(filename: string): string {
  const path = wikiPathFromFilename(filename);
  return wikiTitles[path]?.title ?? path.split('/').pop() ?? path;
}

import { Component, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { injectContentFiles } from '@analogjs/content';
import { wikiTitles, projectNames } from 'virtual:wiki-titles';
import { isUnder, wikiHrefFromFilename, wikiPathFromFilename } from '../../../lib/content-paths';

interface ProjectAttrs {
  project: string;
  name: string;
  domain: string;
}

interface WikiAttrs {
  project: string;
  translated_at: string;
}

interface NavPage {
  title: string;
  href: string;
}

interface NavProject {
  slug: string;
  name: string;
  href: string;
  pages: NavPage[];
}

@Component({
  selector: 'app-doc-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav
      class="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2"
      aria-label="문서 네비게이션"
    >
      <h2 class="label-sm text-outline mb-6">Documents</h2>
      @if (projects().length === 0) {
        <p class="label-md text-on-surface-variant">번역된 프로젝트가 없습니다.</p>
      }
      <ul class="space-y-8">
        @for (p of projects(); track p.slug) {
          <li>
            <a
              [routerLink]="p.href"
              routerLinkActive="text-primary"
              [routerLinkActiveOptions]="{ exact: true }"
              class="label-sm block text-on-surface hover:text-primary transition-colors"
              >{{ p.name }}</a
            >
            @if (p.pages.length) {
              <ul class="mt-3 space-y-2 border-l border-outline-variant pl-4">
                @for (page of p.pages; track page.href) {
                  <li>
                    <a
                      [routerLink]="page.href"
                      routerLinkActive="text-primary border-l-2 border-primary -ml-[17px] pl-4"
                      class="block py-0.5 text-on-surface-variant hover:text-primary transition-colors text-[14px] leading-snug"
                      >{{ page.title }}</a
                    >
                  </li>
                }
              </ul>
            }
          </li>
        }
      </ul>
    </nav>
  `,
})
export class DocNavComponent {
  private projectFiles = injectContentFiles<ProjectAttrs>((f) => isUnder(f.filename, '_projects'));

  private wikiFiles = injectContentFiles<WikiAttrs>((f) => isUnder(f.filename, '_wiki'));

  projects = computed<NavProject[]>(() => {
    return this.projectFiles
      .map((p) => {
        const slug = p.attributes.project;
        const pages: NavPage[] = this.wikiFiles
          .filter((w) => w.attributes.project === slug)
          .map((w) => {
            const path = wikiPathFromFilename(w.filename);
            return {
              title: wikiTitles[path]?.title ?? path.split('/').pop() ?? path,
              href: wikiHrefFromFilename(w.filename),
            };
          })
          .sort((a, b) => a.title.localeCompare(b.title, 'ko'));
        return {
          slug,
          name: projectNames[slug]?.name ?? p.attributes.name ?? slug,
          href: `/projects/${slug}`,
          pages,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  });
}

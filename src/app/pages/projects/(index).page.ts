import { Component } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../../components/badge/badge.component';
import { DocNavComponent } from '../../components/doc-nav/doc-nav.component';
import { isUnder } from '../../../lib/content-paths';

interface ProjectAttrs {
  project: string;
  name: string;
  summary?: string;
  domain: string;
  last_ingest?: string;
}

@Component({
  selector: 'app-projects-index',
  standalone: true,
  imports: [RouterLink, BadgeComponent, DocNavComponent],
  template: `
    <div
      class="mx-auto grid max-w-(--container-site) grid-cols-1 gap-12 px-(--spacing-grid-margin) py-16 md:grid-cols-[14rem_minmax(0,1fr)]"
    >
      <aside class="hidden md:block"><app-doc-nav /></aside>
      <section>
        <p class="label-sm text-outline mb-4">Projects</p>
        <h1 class="headline-xl text-on-surface mb-12">번역된 프로젝트</h1>
        <ul class="grid grid-cols-1 gap-8 md:grid-cols-2">
          @for (p of projects; track p.project) {
            <li>
              <a
                [routerLink]="['/projects', p.project]"
                class="block rounded-lg bg-surface-container-lowest p-(--spacing-card-padding) shadow-editorial border border-outline-variant hover:border-primary transition-colors group"
              >
                <app-badge variant="primary">{{ p.domain }}</app-badge>
                <h2
                  class="font-display text-3xl font-semibold mt-4 mb-3 text-on-surface group-hover:text-primary transition-colors"
                >
                  {{ p.name }}
                </h2>
                @if (p.summary) {
                  <p class="body-md text-on-surface-variant">{{ p.summary }}</p>
                }
              </a>
            </li>
          }
        </ul>
      </section>
    </div>
  `,
})
export default class ProjectsIndexPage {
  private files = injectContentFiles<ProjectAttrs>((f) => isUnder(f.filename, '_projects'));

  projects = this.files.map((f) => f.attributes).sort((a, b) => a.name.localeCompare(b.name, 'ko'));
}

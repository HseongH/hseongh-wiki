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
    <div class="mx-auto grid max-w-(--container-site) grid-cols-[14rem_1fr] gap-8 px-6 py-12">
      <app-doc-nav />
      <section>
        <h1 class="headline-xl mb-8">프로젝트</h1>
        <ul class="grid grid-cols-1 gap-4 md:grid-cols-2">
          @for (p of projects; track p.project) {
            <li>
              <a
                [routerLink]="['/projects', p.project]"
                class="block rounded-lg border border-outline-variant p-4 hover:bg-surface-low"
              >
                <app-badge variant="primary">{{ p.domain }}</app-badge>
                <h2 class="headline-md mt-3">{{ p.name }}</h2>
                <p class="body-md mt-2 text-on-surface-variant">{{ p.summary }}</p>
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

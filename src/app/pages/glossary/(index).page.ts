import { Component } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../../components/badge/badge.component';
import { DocNavComponent } from '../../components/doc-nav/doc-nav.component';
import { isUnder } from '../../../lib/content-paths';

interface GlossaryAttrs {
  term: string;
  korean: string;
  status: '정착어' | '원어유지' | '미정';
  domains?: string[];
}

@Component({
  selector: 'app-glossary-index',
  standalone: true,
  imports: [RouterLink, BadgeComponent, DocNavComponent],
  template: `
    <div
      class="mx-auto grid max-w-(--container-site) grid-cols-1 gap-12 px-(--spacing-grid-margin) py-16 md:grid-cols-[14rem_minmax(0,1fr)]"
    >
      <aside class="hidden md:block"><app-doc-nav /></aside>
      <section class="max-w-(--container-article)">
        <p class="label-sm text-outline mb-4">Glossary</p>
        <h1 class="headline-xl text-on-surface mb-12">용어집</h1>
        <ul class="border-t border-outline-variant">
          @for (t of terms; track t.term) {
            <li class="border-b border-outline-variant">
              <a
                [routerLink]="['/glossary', t.term]"
                class="flex items-center justify-between gap-4 py-4 group transition-colors"
              >
                <span class="flex flex-col gap-1">
                  <span
                    class="font-display text-xl text-on-surface group-hover:text-primary transition-colors"
                    >{{ t.korean }}</span
                  >
                  <span class="label-md text-on-surface-variant lowercase tracking-normal">{{
                    t.term
                  }}</span>
                </span>
                <span class="flex flex-wrap gap-2 justify-end">
                  @for (d of t.domains ?? []; track d) {
                    <app-badge variant="neutral">{{ d }}</app-badge>
                  }
                </span>
              </a>
            </li>
          }
        </ul>
      </section>
    </div>
  `,
})
export default class GlossaryIndexPage {
  private files = injectContentFiles<GlossaryAttrs>((f) => isUnder(f.filename, '_glossary'));

  terms = this.files
    .map((f) => f.attributes)
    .sort((a, b) => a.korean.localeCompare(b.korean, 'ko'));
}

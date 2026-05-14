import { Component } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../../components/badge/badge.component';

interface GlossaryAttrs {
  term: string;
  korean: string;
  status: '정착어' | '원어유지' | '미정';
  domains?: string[];
}

@Component({
  selector: 'app-glossary-index',
  standalone: true,
  imports: [RouterLink, BadgeComponent],
  template: `
    <section class="mx-auto max-w-(--container-article) px-6 py-12">
      <h1 class="headline-xl mb-8">용어집</h1>
      <ul class="space-y-3">
        @for (t of terms; track t.term) {
          <li>
            <a [routerLink]="['/glossary', t.term]" class="flex items-center justify-between rounded p-3 hover:bg-surface-low">
              <span>
                <span class="body-md">{{ t.korean }}</span>
                <span class="label-md text-on-surface-variant"> ({{ t.term }})</span>
              </span>
              <span class="flex gap-2">
                @for (d of t.domains ?? []; track d) {
                  <app-badge variant="neutral">{{ d }}</app-badge>
                }
              </span>
            </a>
          </li>
        }
      </ul>
    </section>
  `,
})
export default class GlossaryIndexPage {
  private files = injectContentFiles<GlossaryAttrs>((f) =>
    f.filename.startsWith('/src/content/_glossary/')
  );

  terms = this.files
    .map((f) => f.attributes)
    .sort((a, b) => a.korean.localeCompare(b.korean, 'ko'));
}

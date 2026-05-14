import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { injectContentFiles, MarkdownComponent } from '@analogjs/content';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BadgeComponent } from '../../components/badge/badge.component';

interface GlossaryAttrs {
  term: string;
  korean: string;
  status: string;
  domains?: string[];
}

@Component({
  selector: 'app-glossary-term-page',
  standalone: true,
  imports: [MarkdownComponent, BadgeComponent],
  template: `
    @if (entry(); as e) {
      <section class="mx-auto max-w-(--container-article) px-6 py-12">
        <h1 class="headline-xl">{{ e.attributes.korean }} <span class="label-md text-on-surface-variant">({{ e.attributes.term }})</span></h1>
        <div class="my-4 flex gap-2">
          <app-badge variant="primary">{{ e.attributes.status }}</app-badge>
          @for (d of e.attributes.domains ?? []; track d) {
            <app-badge variant="neutral">{{ d }}</app-badge>
          }
        </div>
        <analog-markdown [content]="e.content ?? ''" classes="prose" />
      </section>
    } @else {
      <p class="mx-auto max-w-(--container-article) px-6 py-12">용어를 찾을 수 없습니다.</p>
    }
  `,
})
export default class GlossaryTermPage {
  private route = inject(ActivatedRoute);
  private termSlug = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('term') ?? '')),
    { initialValue: '' }
  );

  private files = injectContentFiles<GlossaryAttrs>((f) =>
    f.filename.startsWith('/src/content/_glossary/')
  );

  entry = computed(() => {
    const s = this.termSlug();
    return this.files.find(
      (f) => f.slug === s || f.filename === `/src/content/_glossary/${s}.md`
    );
  });
}

import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { injectContentFiles, injectContentFilesMap, MarkdownComponent } from '@analogjs/content';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BadgeComponent } from '../../components/badge/badge.component';
import { DocNavComponent } from '../../components/doc-nav/doc-nav.component';
import { isUnder, normalizeContentFilename } from '../../../lib/content-paths';
import { loadMarkdownBody, stripDuplicateH1 } from '../../../lib/markdown-body';

interface GlossaryAttrs {
  term: string;
  korean: string;
  status: string;
  domains?: string[];
}

@Component({
  selector: 'app-glossary-term-page',
  standalone: true,
  imports: [MarkdownComponent, BadgeComponent, DocNavComponent],
  template: `
    <div class="mx-auto grid max-w-(--container-site) grid-cols-[14rem_1fr] gap-8 px-6 py-12">
      <app-doc-nav />
      @if (entry(); as e) {
        <section class="max-w-(--container-article)">
          <h1 class="headline-xl">
            {{ e.attributes.korean }}
            <span class="label-md text-on-surface-variant">({{ e.attributes.term }})</span>
          </h1>
          <div class="my-4 flex gap-2">
            <app-badge variant="primary">{{ e.attributes.status }}</app-badge>
            @for (d of e.attributes.domains ?? []; track d) {
              <app-badge variant="neutral">{{ d }}</app-badge>
            }
          </div>
          <analog-markdown [content]="body()" classes="prose" />
        </section>
      } @else {
        <p class="body-md text-on-surface-variant">용어를 찾을 수 없습니다.</p>
      }
    </div>
  `,
})
export default class GlossaryTermPage {
  private route = inject(ActivatedRoute);
  private termSlug = toSignal(this.route.paramMap.pipe(map((p) => p.get('term') ?? '')), {
    initialValue: '',
  });

  private files = injectContentFiles<GlossaryAttrs>((f) => isUnder(f.filename, '_glossary'));
  private filesMap = injectContentFilesMap();

  entry = computed(() => {
    const s = this.termSlug();
    return this.files.find(
      (f) =>
        f.slug === s || normalizeContentFilename(f.filename) === `/src/content/_glossary/${s}.md`,
    );
  });

  private rawHtml = loadMarkdownBody(this.entry, this.filesMap as Record<string, unknown>);
  body = computed(() => stripDuplicateH1(this.rawHtml()));
}

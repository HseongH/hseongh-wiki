import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { injectContentFiles, injectContentFilesMap, MarkdownComponent } from '@analogjs/content';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BadgeComponent } from '../../components/badge/badge.component';
import { DocNavComponent } from '../../components/doc-nav/doc-nav.component';

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
          <h1 class="headline-xl">{{ e.attributes.korean }} <span class="label-md text-on-surface-variant">({{ e.attributes.term }})</span></h1>
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
  private termSlug = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('term') ?? '')),
    { initialValue: '' }
  );

  private files = injectContentFiles<GlossaryAttrs>((f) =>
    f.filename.startsWith('/src/content/_glossary/')
  );
  private filesMap = injectContentFilesMap();

  entry = computed(() => {
    const s = this.termSlug();
    return this.files.find(
      (f) => f.slug === s || f.filename === `/src/content/_glossary/${s}.md`
    );
  });

  rawHtml = signal<string>('');

  constructor() {
    effect((onCleanup) => {
      const e = this.entry();
      if (!e) {
        this.rawHtml.set('');
        return;
      }
      const loader = (this.filesMap as Record<string, unknown>)[e.filename];
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
}

function stripFrontmatter(raw: string): string {
  if (typeof raw !== 'string') return '';
  return raw.replace(/^---\n[\s\S]*?\n---\n\n?/, '');
}

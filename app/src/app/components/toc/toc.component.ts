import { Component, input } from '@angular/core';

export interface TocEntry {
  level: number;
  text: string;
  id: string;
}

@Component({
  selector: 'app-toc',
  standalone: true,
  template: `
    <nav class="sticky top-20 w-56" aria-label="목차">
      <h2 class="label-md mb-3 text-on-surface-variant uppercase tracking-wide">목차</h2>
      <ul class="space-y-2 border-l border-outline-variant pl-4">
        @for (e of entries(); track e.id) {
          <li [style.padding-left.rem]="(e.level - 2) * 0.75">
            <a [href]="'#' + e.id" class="label-md hover:text-primary">{{ e.text }}</a>
          </li>
        }
      </ul>
    </nav>
  `,
})
export class TocComponent {
  entries = input.required<TocEntry[]>();
}

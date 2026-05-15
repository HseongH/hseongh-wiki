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
    <nav class="sticky top-28 w-full" aria-label="목차">
      <p class="label-sm text-outline mb-6">In this article</p>
      <ul class="flex flex-col gap-3 border-l border-outline-variant">
        @for (e of entries(); track e.id) {
          <li [style.padding-left.rem]="(e.level - 2) * 0.75 + 1">
            <a
              [href]="'#' + e.id"
              class="label-md text-on-surface-variant hover:text-primary block py-0.5 transition-colors"
            >
              {{ e.text }}
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
})
export class TocComponent {
  entries = input.required<TocEntry[]>();
}

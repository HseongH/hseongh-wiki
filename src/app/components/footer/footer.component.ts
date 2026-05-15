import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="mt-24 border-t border-outline-variant bg-surface-container">
      <div
        class="mx-auto flex max-w-(--container-site) flex-col gap-6 px-(--spacing-grid-margin) py-12 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <div class="font-display text-2xl font-semibold italic text-primary mb-1">HseongH</div>
          <p class="label-md text-on-surface-variant">© 2026 HseongH · 학습 위키</p>
        </div>
        <nav class="flex flex-wrap items-center gap-6">
          <a
            href="https://github.com/HseongH/hseongh-wiki"
            target="_blank"
            rel="noopener"
            class="label-sm text-on-surface-variant hover:text-primary transition-colors"
            >GitHub</a
          >
          <a
            href="https://hseongh-wiki.hh4518.workers.dev/"
            target="_blank"
            rel="noopener"
            class="label-sm text-on-surface-variant hover:text-primary transition-colors"
            >Live</a
          >
        </nav>
      </div>
    </footer>
  `,
})
export class FooterComponent {}

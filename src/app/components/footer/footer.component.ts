import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="mt-16 border-t border-outline-variant py-8 text-on-surface-variant">
      <div class="mx-auto flex max-w-(--container-site) items-center justify-between px-6 label-md">
        <span>© 2026 HseongH</span>
        <a
          href="https://github.com/HseongH/hseongh-wiki"
          target="_blank"
          rel="noopener"
          class="hover:text-primary"
          >GitHub</a
        >
      </div>
    </footer>
  `,
})
export class FooterComponent {}

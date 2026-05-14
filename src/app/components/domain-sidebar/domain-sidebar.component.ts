import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DomainService } from '../../services/domain.service';

@Component({
  selector: 'app-domain-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="w-56">
      <h2 class="label-md mb-3 text-on-surface-variant uppercase tracking-wide">Categories</h2>
      <ul class="space-y-1">
        @for (d of domains; track d.id) {
          <li>
            <a
              [routerLink]="['/domains', d.id]"
              routerLinkActive="bg-surface-high text-primary"
              class="flex items-center justify-between rounded px-3 py-2 hover:bg-surface-low"
            >
              <span class="label-md">{{ d.name }}</span>
              <span class="label-md text-on-surface-variant">{{ d.count }}</span>
            </a>
          </li>
        }
      </ul>
    </aside>
  `,
})
export class DomainSidebarComponent {
  domains = inject(DomainService).listDomains();
}

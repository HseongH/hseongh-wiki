import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ThemeToggleComponent],
  template: `
    <header class="sticky top-0 z-50 border-b border-outline-variant bg-surface/95 backdrop-blur">
      <div class="mx-auto flex max-w-(--container-site) items-center justify-between px-6 py-4">
        <a routerLink="/" class="font-display text-xl font-bold tracking-tight">HseongH</a>
        <nav class="flex items-center gap-6">
          <a routerLink="/" routerLinkActive="text-primary" [routerLinkActiveOptions]="{ exact: true }" class="label-md hover:text-primary">Home</a>
          <a routerLink="/glossary" routerLinkActive="text-primary" class="label-md hover:text-primary">Glossary</a>
          <a routerLink="/about" routerLinkActive="text-primary" class="label-md hover:text-primary">About</a>
          <app-theme-toggle />
        </nav>
      </div>
    </header>
  `,
})
export class HeaderComponent {}

import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ThemeToggleComponent],
  template: `
    <header
      class="sticky top-0 z-50 border-b border-outline-variant bg-background/95 backdrop-blur"
    >
      <div
        class="mx-auto flex max-w-(--container-site) items-center justify-between px-(--spacing-grid-margin) py-5"
      >
        <a
          routerLink="/"
          class="font-display text-3xl font-semibold italic text-primary tracking-tight"
        >
          HseongH
        </a>
        <nav class="flex items-center gap-8">
          <a
            routerLink="/"
            routerLinkActive="text-primary border-b-2 border-primary"
            [routerLinkActiveOptions]="{ exact: true }"
            class="label-sm hover:text-primary pb-1 transition-colors"
            >Home</a
          >
          <a
            routerLink="/projects"
            routerLinkActive="text-primary border-b-2 border-primary"
            class="label-sm hover:text-primary pb-1 transition-colors"
            >Projects</a
          >
          <a
            routerLink="/glossary"
            routerLinkActive="text-primary border-b-2 border-primary"
            class="label-sm hover:text-primary pb-1 transition-colors"
            >Glossary</a
          >
          <a
            routerLink="/about"
            routerLinkActive="text-primary border-b-2 border-primary"
            class="label-sm hover:text-primary pb-1 transition-colors"
            >About</a
          >
          <app-theme-toggle />
        </nav>
      </div>
    </header>
  `,
})
export class HeaderComponent {}

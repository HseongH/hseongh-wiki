import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../badge/badge.component';

export interface PostCardData {
  title: string;
  excerpt: string;
  project: string;
  translatedAt: string;
  href: string;
}

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [RouterLink, BadgeComponent],
  template: `
    <a
      [routerLink]="post().href"
      class="block rounded-lg border border-outline-variant bg-surface-lowest p-6 transition hover:shadow-[0px_4px_20px_rgba(15,23,42,0.05)]"
    >
      <app-badge variant="primary">{{ post().project }}</app-badge>
      <h3 class="headline-md mt-3 line-clamp-2">{{ post().title }}</h3>
      <p class="body-md mt-2 line-clamp-3 text-on-surface-variant">{{ post().excerpt }}</p>
      <time class="label-md mt-4 block text-on-surface-variant">{{ post().translatedAt }}</time>
    </a>
  `,
})
export class PostCardComponent {
  post = input.required<PostCardData>();
}

import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

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
  imports: [RouterLink],
  template: `
    <article class="group">
      <div class="flex items-center gap-3 mb-3">
        <span class="label-sm text-primary bg-primary-fixed px-2 py-1">{{ post().project }}</span>
        <span class="label-sm text-outline">{{ post().translatedAt }}</span>
      </div>
      <h3
        class="headline-md mb-4 text-on-surface group-hover:text-primary transition-colors leading-tight"
      >
        <a [routerLink]="post().href">{{ post().title }}</a>
      </h3>
      @if (post().excerpt) {
        <p class="body-md text-on-surface-variant mb-5 line-clamp-3 max-w-2xl">
          {{ post().excerpt }}
        </p>
      }
      <a
        [routerLink]="post().href"
        class="label-sm inline-flex items-center gap-2 text-primary group-hover:gap-4 transition-all"
      >
        Read more <span aria-hidden="true">→</span>
      </a>
    </article>
  `,
})
export class PostCardComponent {
  post = input.required<PostCardData>();
}

import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button
      type="button"
      class="rounded p-2 hover:bg-surface-high focus:outline focus:outline-2 focus:outline-primary"
      [attr.aria-label]="theme.theme() === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'"
      (click)="theme.toggle()"
    >
      @if (theme.theme() === 'dark') {
        <span>☀</span>
      } @else {
        <span>🌙</span>
      }
    </button>
  `,
})
export class ThemeToggleComponent {
  theme = inject(ThemeService);
}

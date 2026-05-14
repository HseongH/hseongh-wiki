import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span
      class="inline-flex items-center rounded px-2 py-0.5 text-xs uppercase tracking-wide"
      [class.bg-primary-container]="variant() === 'primary'"
      [class.text-on-primary-container]="variant() === 'primary'"
      [class.bg-surface-high]="variant() === 'neutral'"
      [class.text-on-surface-variant]="variant() === 'neutral'"
    >
      <ng-content />
    </span>
  `,
})
export class BadgeComponent {
  variant = input<'primary' | 'neutral'>('neutral');
}

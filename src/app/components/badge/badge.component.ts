import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span
      class="inline-flex items-center"
      [class.label-sm]="true"
      [class.rounded-full]="true"
      [class.px-3]="true"
      [class.py-1]="true"
      [class.bg-primary-fixed]="variant() === 'primary'"
      [class.text-on-primary-fixed]="variant() === 'primary'"
      [class.bg-secondary-container]="variant() === 'neutral'"
      [class.text-on-secondary-container]="variant() === 'neutral'"
      [class.border]="variant() === 'outline'"
      [class.border-primary]="variant() === 'outline'"
      [class.text-primary]="variant() === 'outline'"
    >
      <ng-content />
    </span>
  `,
})
export class BadgeComponent {
  variant = input<'primary' | 'neutral' | 'outline'>('neutral');
}

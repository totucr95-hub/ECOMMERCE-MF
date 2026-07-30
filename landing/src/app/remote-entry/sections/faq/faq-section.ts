import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-faq-section',
  standalone: true,
  templateUrl: './faq-section.html',
  styleUrl: './faq-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqSectionComponent {}
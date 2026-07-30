import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-benefits-section',
  standalone: true,
  templateUrl: './benefits-section.html',
  styleUrl: './benefits-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BenefitsSectionComponent {}
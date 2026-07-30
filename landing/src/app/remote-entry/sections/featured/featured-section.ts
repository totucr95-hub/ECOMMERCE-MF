import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Product } from '@ecommerce-mf/shared-models';

@Component({
  selector: 'app-featured-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured-section.html',
  styleUrl: './featured-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedSectionComponent {
  @Input({ required: true }) featuredProducts: Product[] = [];

  get cards(): Product[] {
    return this.featuredProducts.slice(0, 3);
  }
}
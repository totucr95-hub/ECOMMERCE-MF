import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Product } from '@ecommerce-mf/shared-models';

@Component({
  selector: 'lib-products-ui-product-card',
  standalone: true,
  imports: [],
  templateUrl: './products-ui-product-card.html',
  styleUrl: './products-ui-product-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsUiProductCard {
  @Input({ required: true }) product!: Product;
  @Output() buy = new EventEmitter<Product>();
  @Output() favorite = new EventEmitter<Product>();
  isFavorite = false;

  get badgeLabel(): string | null {
    if (
      this.product.discountPercentage &&
      this.product.discountPercentage > 0
    ) {
      return `${this.product.discountPercentage}% OFF`;
    }

    if (this.product.featured) {
      return 'Destacado';
    }

    return null;
  }

  get hasDiscountBadge(): boolean {
    return Boolean(
      this.product.discountPercentage && this.product.discountPercentage > 0,
    );
  }

  onBuy(): void {
    this.buy.emit(this.product);
  }

  onFavorite(): void {
    this.isFavorite = !this.isFavorite;
    this.favorite.emit(this.product);
  }
}

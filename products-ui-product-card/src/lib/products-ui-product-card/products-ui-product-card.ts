import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@ecommerce-mf/shared-models';

@Component({
  selector: 'lib-products-ui-product-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './products-ui-product-card.html',
  styleUrl: './products-ui-product-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsUiProductCard {
  @Input({ required: true }) product!: Product;
  @Input() quantityInCart = 0;
  @Input() detailLink: string | ReadonlyArray<string> | null = null;
  @Output() buy = new EventEmitter<Product>();
  @Output() decrease = new EventEmitter<Product>();
  @Output() quantityChange = new EventEmitter<number>();
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

  onDecrease(): void {
    this.decrease.emit(this.product);
  }

  onQuantityInput(rawValue: string): void {
    const parsed = Number.parseInt(rawValue, 10);

    if (Number.isNaN(parsed)) {
      return;
    }

    this.quantityChange.emit(Math.max(0, parsed));
  }

  onFavorite(): void {
    this.isFavorite = !this.isFavorite;
    this.favorite.emit(this.product);
  }
}

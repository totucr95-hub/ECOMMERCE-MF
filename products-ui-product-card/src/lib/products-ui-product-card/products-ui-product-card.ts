import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '@ecommerce-mf/shared-models';

@Component({
  selector: 'lib-products-ui-product-card',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
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
  quantityDraft: string | null = null;

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
    this.quantityDraft = null;
    this.buy.emit(this.product);
  }

  onDecrease(): void {
    this.quantityDraft = null;
    this.decrease.emit(this.product);
  }

  get quantityInputValue(): string {
    if (this.quantityDraft !== null) {
      return this.quantityDraft;
    }

    return String(this.quantityInCart);
  }

  onQuantityInput(rawValue: string): void {
    this.quantityDraft = rawValue;
  }

  commitQuantity(): void {
    const rawValue = (this.quantityDraft ?? String(this.quantityInCart)).trim();

    if (rawValue === '') {
      this.quantityDraft = String(this.quantityInCart);
      return;
    }

    const parsed = Number.parseInt(rawValue, 10);

    if (Number.isNaN(parsed)) {
      this.quantityDraft = String(this.quantityInCart);
      return;
    }

    this.quantityDraft = null;
    this.quantityChange.emit(Math.min(99, Math.max(0, parsed)));
  }

  onFavorite(): void {
    this.isFavorite = !this.isFavorite;
    this.favorite.emit(this.product);
  }
}

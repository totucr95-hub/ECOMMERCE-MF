import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
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

  onBuy(): void {
    this.buy.emit(this.product);
  }

  onFavorite(): void {
    this.favorite.emit(this.product);
  }
}

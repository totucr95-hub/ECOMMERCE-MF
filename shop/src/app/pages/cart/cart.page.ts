import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartStore, ProductService } from '@ecommerce-mf/shared-core';
import { Product } from '@ecommerce-mf/shared-models';
import { ProductsUiProductCard } from '@ecommerce-mf/products-ui-product-card';

@Component({
  selector: 'shop-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductsUiProductCard],
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPage implements OnInit {
  readonly store = inject(CartStore);
  private readonly productService = inject(ProductService);
  private readonly products = signal<ReadonlyArray<Product>>([]);

  readonly shippingCost = computed(() => (this.store.subtotal() > 0 ? 8 : 0));
  readonly suggestedProducts = computed(() => {
    const cartProductIds = new Set(
      this.store.items().map((item) => item.product.id),
    );

    return this.products()
      .filter((product) => !cartProductIds.has(product.id))
      .sort((left, right) => Number(right.featured) - Number(left.featured))
      .slice(0, 4);
  });

  async ngOnInit(): Promise<void> {
    this.products.set(await this.productService.getProducts());
  }

  addSuggestedToCart(product: Product): void {
    this.store.add(product);
  }

  decreaseFromCart(product: Product): void {
    const quantity = this.cartQuantity(product.id);

    if (quantity <= 1) {
      this.store.remove(product.id);
      return;
    }

    this.store.updateQuantity(product.id, quantity - 1);
  }

  setCartQuantity(product: Product, quantity: number): void {
    const safeQuantity = Math.max(0, Math.floor(quantity));

    if (safeQuantity === 0) {
      this.store.remove(product.id);
      return;
    }

    this.store.updateQuantity(product.id, safeQuantity);
  }

  cartQuantity(productId: string): number {
    const item = this.store
      .items()
      .find((cartItem) => cartItem.product.id === productId);

    return item?.quantity ?? 0;
  }
}

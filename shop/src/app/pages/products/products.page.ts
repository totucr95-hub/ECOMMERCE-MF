import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CartStore } from '@ecommerce-mf/shared-core';
import { ProductCatalogFacade } from '@ecommerce-mf/products-feature-products';
import { ProductSort } from '@ecommerce-mf/products-domain-products';
import { ProductsUiProductCard } from '@ecommerce-mf/products-ui-product-card';
import { Product } from '@ecommerce-mf/shared-models';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [ProductsUiProductCard],
  templateUrl: './products.page.html',
  styleUrl: './products.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPage implements OnInit {
  readonly catalog = inject(ProductCatalogFacade);
  private readonly cartStore = inject(CartStore);
  isFilterPanelOpen = false;

  async ngOnInit(): Promise<void> {
    await this.catalog.load();
  }

  setQuery(value: string): void {
    this.catalog.setQuery(value);
  }

  setCategory(categoryId: string): void {
    this.catalog.setCategory(categoryId);
  }

  setSort(sort: ProductSort): void {
    this.catalog.setSort(sort);
  }

  toggleFilters(): void {
    this.isFilterPanelOpen = !this.isFilterPanelOpen;
  }

  closeFilters(): void {
    this.isFilterPanelOpen = false;
  }

  clearFilters(): void {
    this.catalog.setQuery('');
    this.catalog.setCategory('');
    this.catalog.setSort('featured');
  }

  hasActiveFilters(): boolean {
    const filters = this.catalog.filters();
    return !!(
      filters.query ||
      filters.categoryId ||
      filters.sort !== 'featured'
    );
  }

  addToCart(product: Product): void {
    this.cartStore.add(product);
  }

  decreaseFromCart(product: Product): void {
    const quantity = this.cartQuantity(product.id);

    if (quantity <= 1) {
      this.cartStore.remove(product.id);
      return;
    }

    this.cartStore.updateQuantity(product.id, quantity - 1);
  }

  setCartQuantity(product: Product, quantity: number): void {
    const safeQuantity = Math.max(0, Math.floor(quantity));

    if (safeQuantity === 0) {
      this.cartStore.remove(product.id);
      return;
    }

    this.cartStore.updateQuantity(product.id, safeQuantity);
  }

  cartQuantity(productId: string): number {
    const item = this.cartStore
      .items()
      .find((cartItem) => cartItem.product.id === productId);

    return item?.quantity ?? 0;
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { ProductsUiProductTable } from '@ecommerce-mf/products-ui-product-table';
import { ProductsUiProductCard } from '@ecommerce-mf/products-ui-product-card';
import { AdminProduct } from '../../domain/entities/admin-product.entity';
import { AdminProductsFacade } from '../../application/facades/admin-products.facade';

@Component({
  selector: 'admin-products-page',
  standalone: true,
  imports: [ProductsUiProductTable, ProductsUiProductCard],
  templateUrl: './products.page.html',
  styleUrl: './products.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductsPage {
  private readonly adminProductsFacade = inject(AdminProductsFacade);
  private readonly cdr = inject(ChangeDetectorRef);

  products: AdminProduct[] = [];
  featuredProducts: AdminProduct[] = [];

  constructor() {
    void this.loadProducts();
  }

  private async loadProducts(): Promise<void> {
    const overview = await this.adminProductsFacade.loadOverview();
    this.products = [...overview.products];
    this.featuredProducts = [...overview.featuredProducts];
    this.cdr.markForCheck();
  }

  onBuy(_product: AdminProduct): void {
    void _product;
    // Hook for checkout workflow integration.
  }

  onFavorite(_product: AdminProduct): void {
    void _product;
    // Hook for wishlist workflow integration.
  }

  canLeave(): boolean {
    return true;
  }
}

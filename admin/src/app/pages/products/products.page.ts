import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { ProductStore } from '@ecommerce-mf/shared-core';
import { Product } from '@ecommerce-mf/shared-models';
import {
  ReusableTableColumn,
  ReusableTableComponent,
} from '../../shared/components/reusable-table/reusable-table.component';

@Component({
  selector: 'admin-products-page',
  standalone: true,
  imports: [ReusableTableComponent],
  templateUrl: './products.page.html',
  styleUrl: './products.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductsPage {
  private readonly productStore = inject(ProductStore);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly columns: ReusableTableColumn[] = [
    { key: 'name', header: 'Producto' },
    { key: 'category', header: 'Categoria' },
    { key: 'price', header: 'Precio', align: 'right' },
    { key: 'stock', header: 'Stock', align: 'right' },
  ];

  rows: ReadonlyArray<Record<string, unknown>> = [];

  constructor() {
    void this.loadProducts();
  }

  private async loadProducts(): Promise<void> {
    await this.productStore.load();
    const categoriesById = new Map(
      this.productStore
        .categories()
        .map((category) => [category.id, category.name]),
    );

    this.rows = this.productStore.products().map((product: Product) => ({
      name: product.name,
      category: categoriesById.get(product.categoryId) ?? product.categoryId,
      price: this.formatCurrency(product.price),
      stock: product.stock,
    }));
    this.cdr.markForCheck();
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(value);
  }
}

import { Injectable, computed, inject, signal } from '@angular/core';
import {
  filterProducts,
  ProductCatalogRepository,
  ProductFilters,
  ProductSort,
} from '@ecommerce-mf/products-domain-products';
import { Category, Product } from '@ecommerce-mf/shared-models';

@Injectable()
export class ProductCatalogFacade {
  private readonly repository = inject(ProductCatalogRepository);
  private readonly productsState = signal<ReadonlyArray<Product>>([]);
  private readonly categoriesState = signal<ReadonlyArray<Category>>([]);
  private readonly filtersState = signal<ProductFilters>({
    query: '',
    categoryId: null,
    sort: 'featured',
  });

  readonly categories = this.categoriesState.asReadonly();
  readonly filters = this.filtersState.asReadonly();
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly products = computed(() =>
    filterProducts(this.productsState(), this.filtersState()),
  );

  async load(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const catalog = await this.repository.loadCatalog();
      this.productsState.set(catalog.products);
      this.categoriesState.set(catalog.categories);
    } catch {
      this.errorMessage.set('No fue posible cargar el catalogo.');
    } finally {
      this.isLoading.set(false);
    }
  }

  setQuery(query: string): void {
    this.updateFilters({ query });
  }

  setCategory(categoryId: string): void {
    this.updateFilters({ categoryId: categoryId || null });
  }

  setSort(sort: ProductSort): void {
    this.updateFilters({ sort });
  }

  private updateFilters(filters: Partial<ProductFilters>): void {
    this.filtersState.update((current) => ({ ...current, ...filters }));
  }
}

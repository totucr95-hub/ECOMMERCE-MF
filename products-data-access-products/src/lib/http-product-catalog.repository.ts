import { Injectable, inject } from '@angular/core';
import { ProductService } from '@ecommerce-mf/shared-core';
import {
  ProductCatalog,
  ProductCatalogRepository,
} from '@ecommerce-mf/products-domain-products';

@Injectable()
export class HttpProductCatalogRepository implements ProductCatalogRepository {
  private readonly productService = inject(ProductService);

  async loadCatalog(): Promise<ProductCatalog> {
    const [products, categories] = await Promise.all([
      this.productService.getProducts(),
      this.productService.getCategories(),
    ]);

    return { products, categories };
  }
}

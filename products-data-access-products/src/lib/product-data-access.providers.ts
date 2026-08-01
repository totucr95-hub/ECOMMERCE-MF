import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ProductCatalogRepository } from '@ecommerce-mf/products-domain-products';
import { InMemoryProductCatalogRepository } from './in-memory-product-catalog.repository';

export const provideProductDataAccess = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    {
      provide: ProductCatalogRepository,
      useClass: InMemoryProductCatalogRepository,
    },
  ]);

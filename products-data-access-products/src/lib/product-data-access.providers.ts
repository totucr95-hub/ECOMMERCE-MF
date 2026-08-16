import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ProductCatalogRepository } from '@ecommerce-mf/products-domain-products';
import { HttpProductCatalogRepository } from './http-product-catalog.repository';

export const provideProductDataAccess = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    {
      provide: ProductCatalogRepository,
      useClass: HttpProductCatalogRepository,
    },
  ]);

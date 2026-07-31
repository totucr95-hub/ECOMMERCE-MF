import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AdminProductsFacade } from './application/facades/admin-products.facade';
import { GetProductsOverviewUseCase } from './application/use-cases/get-products-overview.use-case';
import { AdminProductRepository } from './domain/repositories/admin-product.repository';
import { AdminProductStoreRepository } from './infrastructure/repositories/admin-product-store.repository';

export const provideAdminProductsFeature = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    AdminProductsFacade,
    GetProductsOverviewUseCase,
    {
      provide: AdminProductRepository,
      useClass: AdminProductStoreRepository,
    },
  ]);
};

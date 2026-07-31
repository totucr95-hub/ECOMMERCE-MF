import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AdminProductsFacade } from './application/facades/admin-products.facade';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case';
import { GetProductByIdUseCase } from './application/use-cases/get-product-by-id.use-case';
import { GetProductsOverviewUseCase } from './application/use-cases/get-products-overview.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case';
import { AdminProductRepository } from './domain/repositories/admin-product.repository';
import { AdminProductStoreRepository } from './infrastructure/repositories/admin-product-store.repository';

export const provideAdminProductsFeature = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    AdminProductsFacade,
    CreateProductUseCase,
    DeleteProductUseCase,
    GetProductByIdUseCase,
    GetProductsOverviewUseCase,
    UpdateProductUseCase,
    {
      provide: AdminProductRepository,
      useClass: AdminProductStoreRepository,
    },
  ]);
};

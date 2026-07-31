import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AdminCartsFacade } from './application/facades/admin-carts.facade';
import { CreateCartUseCase } from './application/use-cases/create-cart.use-case';
import { DeleteCartUseCase } from './application/use-cases/delete-cart.use-case';
import { GetCartByIdUseCase } from './application/use-cases/get-cart-by-id.use-case';
import { GetCartsSummaryUseCase } from './application/use-cases/get-carts-summary.use-case';
import { UpdateCartUseCase } from './application/use-cases/update-cart.use-case';
import { CartsRepository } from './domain/repositories/carts.repository';
import { CartsInMemoryRepository } from './infrastructure/repositories/carts-in-memory.repository';

export const provideAdminCartsFeature = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    AdminCartsFacade,
    CreateCartUseCase,
    DeleteCartUseCase,
    GetCartByIdUseCase,
    GetCartsSummaryUseCase,
    UpdateCartUseCase,
    {
      provide: CartsRepository,
      useClass: CartsInMemoryRepository,
    },
  ]);
};

import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AdminOrdersFacade } from './application/facades/admin-orders.facade';
import { GetOrdersSummaryUseCase } from './application/use-cases/get-orders-summary.use-case';
import { OrdersRepository } from './domain/repositories/orders.repository';
import { OrdersInMemoryRepository } from './infrastructure/repositories/orders-in-memory.repository';

export const provideAdminOrdersFeature = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    AdminOrdersFacade,
    GetOrdersSummaryUseCase,
    {
      provide: OrdersRepository,
      useClass: OrdersInMemoryRepository,
    },
  ]);
};

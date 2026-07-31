import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AdminOrdersFacade } from './application/facades/admin-orders.facade';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { DeleteOrderUseCase } from './application/use-cases/delete-order.use-case';
import { GetOrderByIdUseCase } from './application/use-cases/get-order-by-id.use-case';
import { GetOrdersSummaryUseCase } from './application/use-cases/get-orders-summary.use-case';
import { UpdateOrderUseCase } from './application/use-cases/update-order.use-case';
import { OrdersRepository } from './domain/repositories/orders.repository';
import { OrdersInMemoryRepository } from './infrastructure/repositories/orders-in-memory.repository';

export const provideAdminOrdersFeature = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    AdminOrdersFacade,
    CreateOrderUseCase,
    DeleteOrderUseCase,
    GetOrderByIdUseCase,
    GetOrdersSummaryUseCase,
    UpdateOrderUseCase,
    {
      provide: OrdersRepository,
      useClass: OrdersInMemoryRepository,
    },
  ]);
};

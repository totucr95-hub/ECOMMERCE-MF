import { Injectable, inject } from '@angular/core';
import { OrderSummary } from '../../domain/entities/order-summary.entity';
import { OrdersRepository } from '../../domain/repositories/orders.repository';

@Injectable()
export class GetOrdersSummaryUseCase {
  private readonly repository = inject(OrdersRepository);

  execute(): Promise<ReadonlyArray<OrderSummary>> {
    return this.repository.findSummaries();
  }
}

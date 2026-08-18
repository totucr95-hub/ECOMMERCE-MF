import { Injectable, inject } from '@angular/core';
import { OrderSummary } from '../../domain/entities/order-summary.entity';
import { OrderSupportSummary } from '../../domain/order.models';
import { OrdersRepository } from '../../domain/repositories/orders.repository';

@Injectable()
export class GetOrdersSummaryUseCase {
  private readonly repository = inject(OrdersRepository);

  execute(): Promise<ReadonlyArray<OrderSummary>> {
    return this.repository.findSummaries();
  }

  executeByReference(reference: string): Promise<OrderSupportSummary | null> {
    return this.repository.findSupportSummaryByReference(reference);
  }
}

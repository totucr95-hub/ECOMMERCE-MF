import { Injectable, inject } from '@angular/core';
import { GetOrdersSummaryUseCase } from '../use-cases/get-orders-summary.use-case';
import { OrderSummary } from '../../domain/entities/order-summary.entity';

@Injectable()
export class AdminOrdersFacade {
  private readonly getOrdersSummaryUseCase = inject(GetOrdersSummaryUseCase);

  loadSummaries(): Promise<ReadonlyArray<OrderSummary>> {
    return this.getOrdersSummaryUseCase.execute();
  }
}

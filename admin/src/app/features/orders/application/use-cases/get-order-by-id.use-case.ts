import { Injectable, inject } from '@angular/core';
import { OrderSummary } from '../../domain/entities/order-summary.entity';
import { OrdersRepository } from '../../domain/repositories/orders.repository';

@Injectable()
export class GetOrderByIdUseCase {
  private readonly repository = inject(OrdersRepository);

  execute(id: string): Promise<OrderSummary | null> {
    return this.repository.findById(id);
  }
}

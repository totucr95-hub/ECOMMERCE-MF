import { Injectable, inject } from '@angular/core';
import { OrderFormData } from '../../domain/order.models';
import { OrderSummary } from '../../domain/entities/order-summary.entity';
import { OrdersRepository } from '../../domain/repositories/orders.repository';

@Injectable()
export class UpdateOrderUseCase {
  private readonly repository = inject(OrdersRepository);

  execute(id: string, payload: OrderFormData): Promise<OrderSummary | null> {
    return this.repository.update(id, payload);
  }
}

import { Injectable, inject } from '@angular/core';
import { OrderFormData } from '../../domain/order.models';
import { OrderSummary } from '../../domain/entities/order-summary.entity';
import { OrdersRepository } from '../../domain/repositories/orders.repository';

@Injectable()
export class CreateOrderUseCase {
  private readonly repository = inject(OrdersRepository);

  execute(payload: OrderFormData): Promise<OrderSummary> {
    return this.repository.create(payload);
  }
}

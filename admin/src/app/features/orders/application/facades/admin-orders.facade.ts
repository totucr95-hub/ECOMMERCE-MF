import { Injectable, inject } from '@angular/core';
import { CreateOrderUseCase } from '../use-cases/create-order.use-case';
import { DeleteOrderUseCase } from '../use-cases/delete-order.use-case';
import { GetOrderByIdUseCase } from '../use-cases/get-order-by-id.use-case';
import { GetOrdersSummaryUseCase } from '../use-cases/get-orders-summary.use-case';
import { UpdateOrderUseCase } from '../use-cases/update-order.use-case';
import { OrderFormData } from '../../domain/order.models';
import { OrderSummary } from '../../domain/entities/order-summary.entity';

@Injectable()
export class AdminOrdersFacade {
  private readonly getOrdersSummaryUseCase = inject(GetOrdersSummaryUseCase);
  private readonly getOrderByIdUseCase = inject(GetOrderByIdUseCase);
  private readonly createOrderUseCase = inject(CreateOrderUseCase);
  private readonly updateOrderUseCase = inject(UpdateOrderUseCase);
  private readonly deleteOrderUseCase = inject(DeleteOrderUseCase);

  loadSummaries(): Promise<ReadonlyArray<OrderSummary>> {
    return this.getOrdersSummaryUseCase.execute();
  }

  readOrder(id: string): Promise<OrderSummary | null> {
    return this.getOrderByIdUseCase.execute(id);
  }

  createOrder(payload: OrderFormData): Promise<OrderSummary> {
    return this.createOrderUseCase.execute(payload);
  }

  updateOrder(
    id: string,
    payload: OrderFormData,
  ): Promise<OrderSummary | null> {
    return this.updateOrderUseCase.execute(id, payload);
  }

  deleteOrder(id: string): Promise<boolean> {
    return this.deleteOrderUseCase.execute(id);
  }
}

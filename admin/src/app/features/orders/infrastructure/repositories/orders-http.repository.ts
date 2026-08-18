import { Injectable, inject } from '@angular/core';
import { OrderSummary } from '../../domain/entities/order-summary.entity';
import { OrderFormData, OrderSupportSummary } from '../../domain/order.models';
import { OrdersRepository } from '../../domain/repositories/orders.repository';
import { AdminOrdersApiService } from '../services/admin-orders-api.service';

@Injectable()
export class OrdersHttpRepository implements OrdersRepository {
  private readonly api = inject(AdminOrdersApiService);

  async findSummaries(): Promise<ReadonlyArray<OrderSummary>> {
    return this.api.getOrders();
  }

  async findById(id: string): Promise<OrderSummary | null> {
    return this.api.getOrderById(id);
  }

  async create(payload: OrderFormData): Promise<OrderSummary> {
    return this.api.createOrder(payload);
  }

  async update(
    id: string,
    payload: OrderFormData,
  ): Promise<OrderSummary | null> {
    return this.api.updateOrder(id, payload);
  }

  async delete(id: string): Promise<boolean> {
    return this.api.deleteOrder(id);
  }

  async findSupportSummaryByReference(
    reference: string,
  ): Promise<OrderSupportSummary | null> {
    return this.api.getOrderSupportSummaryByReference(reference);
  }
}

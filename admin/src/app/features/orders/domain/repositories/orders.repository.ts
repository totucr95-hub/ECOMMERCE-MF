import { OrderSummary } from '../entities/order-summary.entity';
import { OrderFormData, OrderSupportSummary } from '../order.models';

export abstract class OrdersRepository {
  abstract findSummaries(): Promise<ReadonlyArray<OrderSummary>>;
  abstract findById(id: string): Promise<OrderSummary | null>;
  abstract create(payload: OrderFormData): Promise<OrderSummary>;
  abstract update(
    id: string,
    payload: OrderFormData,
  ): Promise<OrderSummary | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract findSupportSummaryByReference(
    reference: string,
  ): Promise<OrderSupportSummary | null>;
}

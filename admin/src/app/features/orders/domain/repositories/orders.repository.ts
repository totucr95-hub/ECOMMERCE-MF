import { OrderSummary } from '../entities/order-summary.entity';

export abstract class OrdersRepository {
  abstract findSummaries(): Promise<ReadonlyArray<OrderSummary>>;
}

import { CartFormData } from '../cart.models';
import { CartSummary } from '../entities/cart-summary.entity';

export abstract class CartsRepository {
  abstract findSummaries(): Promise<ReadonlyArray<CartSummary>>;
  abstract findById(id: string): Promise<CartSummary | null>;
  abstract create(payload: CartFormData): Promise<CartSummary>;
  abstract update(id: string, payload: CartFormData): Promise<CartSummary | null>;
  abstract delete(id: string): Promise<boolean>;
}

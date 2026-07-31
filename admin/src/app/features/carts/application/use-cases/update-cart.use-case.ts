import { Injectable, inject } from '@angular/core';
import { CartFormData } from '../../domain/cart.models';
import { CartSummary } from '../../domain/entities/cart-summary.entity';
import { CartsRepository } from '../../domain/repositories/carts.repository';

@Injectable()
export class UpdateCartUseCase {
  private readonly repository = inject(CartsRepository);

  execute(id: string, payload: CartFormData): Promise<CartSummary | null> {
    return this.repository.update(id, payload);
  }
}

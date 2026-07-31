import { Injectable, inject } from '@angular/core';
import { CartFormData } from '../../domain/cart.models';
import { CartSummary } from '../../domain/entities/cart-summary.entity';
import { CartsRepository } from '../../domain/repositories/carts.repository';

@Injectable()
export class CreateCartUseCase {
  private readonly repository = inject(CartsRepository);

  execute(payload: CartFormData): Promise<CartSummary> {
    return this.repository.create(payload);
  }
}

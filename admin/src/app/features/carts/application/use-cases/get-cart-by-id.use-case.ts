import { Injectable, inject } from '@angular/core';
import { CartSummary } from '../../domain/entities/cart-summary.entity';
import { CartsRepository } from '../../domain/repositories/carts.repository';

@Injectable()
export class GetCartByIdUseCase {
  private readonly repository = inject(CartsRepository);

  execute(id: string): Promise<CartSummary | null> {
    return this.repository.findById(id);
  }
}

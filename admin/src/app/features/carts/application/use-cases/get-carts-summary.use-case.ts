import { Injectable, inject } from '@angular/core';
import { CartSummary } from '../../domain/entities/cart-summary.entity';
import { CartsRepository } from '../../domain/repositories/carts.repository';

@Injectable()
export class GetCartsSummaryUseCase {
  private readonly repository = inject(CartsRepository);

  execute(): Promise<ReadonlyArray<CartSummary>> {
    return this.repository.findSummaries();
  }
}

import { Injectable, inject } from '@angular/core';
import { OrdersRepository } from '../../domain/repositories/orders.repository';

@Injectable()
export class DeleteOrderUseCase {
  private readonly repository = inject(OrdersRepository);

  execute(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}

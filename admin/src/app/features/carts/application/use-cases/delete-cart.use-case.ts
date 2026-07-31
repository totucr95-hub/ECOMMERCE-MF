import { Injectable, inject } from '@angular/core';
import { CartsRepository } from '../../domain/repositories/carts.repository';

@Injectable()
export class DeleteCartUseCase {
  private readonly repository = inject(CartsRepository);

  execute(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}

import { Injectable, inject } from '@angular/core';
import { AdminProductRepository } from '../../domain/repositories/admin-product.repository';

@Injectable()
export class DeleteProductUseCase {
  private readonly repository = inject(AdminProductRepository);

  execute(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}

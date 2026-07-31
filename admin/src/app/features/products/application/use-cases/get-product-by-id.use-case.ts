import { Injectable, inject } from '@angular/core';
import { AdminProduct } from '../../domain/entities/admin-product.entity';
import { AdminProductRepository } from '../../domain/repositories/admin-product.repository';

@Injectable()
export class GetProductByIdUseCase {
  private readonly repository = inject(AdminProductRepository);

  execute(id: string): Promise<AdminProduct | null> {
    return this.repository.findById(id);
  }
}

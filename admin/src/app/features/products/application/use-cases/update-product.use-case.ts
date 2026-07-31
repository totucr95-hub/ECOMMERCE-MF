import { Injectable, inject } from '@angular/core';
import { AdminProduct } from '../../domain/entities/admin-product.entity';
import { ProductFormData } from '../../domain/product.models';
import { AdminProductRepository } from '../../domain/repositories/admin-product.repository';

@Injectable()
export class UpdateProductUseCase {
  private readonly repository = inject(AdminProductRepository);

  execute(id: string, payload: ProductFormData): Promise<AdminProduct | null> {
    return this.repository.update(id, payload);
  }
}

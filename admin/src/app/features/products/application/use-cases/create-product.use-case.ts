import { Injectable, inject } from '@angular/core';
import { AdminProduct } from '../../domain/entities/admin-product.entity';
import { ProductFormData } from '../../domain/product.models';
import { AdminProductRepository } from '../../domain/repositories/admin-product.repository';

@Injectable()
export class CreateProductUseCase {
  private readonly repository = inject(AdminProductRepository);

  execute(payload: ProductFormData): Promise<AdminProduct> {
    return this.repository.create(payload);
  }
}

import { Injectable, inject } from '@angular/core';
import { AdminProductRepository } from '../../domain/repositories/admin-product.repository';
import { ProductsOverviewVm } from '../view-models/products-overview.vm';

@Injectable()
export class GetProductsOverviewUseCase {
  private readonly repository = inject(AdminProductRepository);

  async execute(): Promise<ProductsOverviewVm> {
    const products = await this.repository.findAll();
    const featuredProducts = products
      .filter((product) => product.featured)
      .slice(0, 4);

    return {
      products,
      featuredProducts,
    };
  }
}

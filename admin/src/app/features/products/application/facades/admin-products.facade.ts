import { Injectable, inject } from '@angular/core';
import { GetProductsOverviewUseCase } from '../use-cases/get-products-overview.use-case';
import { ProductsOverviewVm } from '../view-models/products-overview.vm';

@Injectable()
export class AdminProductsFacade {
  private readonly getProductsOverviewUseCase = inject(
    GetProductsOverviewUseCase,
  );

  loadOverview(): Promise<ProductsOverviewVm> {
    return this.getProductsOverviewUseCase.execute();
  }
}

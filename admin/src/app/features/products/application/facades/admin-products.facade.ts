import { Injectable, inject } from '@angular/core';
import { CreateProductUseCase } from '../use-cases/create-product.use-case';
import { DeleteProductUseCase } from '../use-cases/delete-product.use-case';
import { GetProductByIdUseCase } from '../use-cases/get-product-by-id.use-case';
import { GetProductsOverviewUseCase } from '../use-cases/get-products-overview.use-case';
import { UpdateProductUseCase } from '../use-cases/update-product.use-case';
import { AdminProduct } from '../../domain/entities/admin-product.entity';
import { ProductFormData } from '../../domain/product.models';
import { ProductsOverviewVm } from '../view-models/products-overview.vm';

@Injectable()
export class AdminProductsFacade {
  private readonly getProductsOverviewUseCase = inject(
    GetProductsOverviewUseCase,
  );
  private readonly getProductByIdUseCase = inject(GetProductByIdUseCase);
  private readonly createProductUseCase = inject(CreateProductUseCase);
  private readonly updateProductUseCase = inject(UpdateProductUseCase);
  private readonly deleteProductUseCase = inject(DeleteProductUseCase);

  loadOverview(): Promise<ProductsOverviewVm> {
    return this.getProductsOverviewUseCase.execute();
  }

  readProduct(id: string): Promise<AdminProduct | null> {
    return this.getProductByIdUseCase.execute(id);
  }

  createProduct(payload: ProductFormData): Promise<AdminProduct> {
    return this.createProductUseCase.execute(payload);
  }

  updateProduct(
    id: string,
    payload: ProductFormData,
  ): Promise<AdminProduct | null> {
    return this.updateProductUseCase.execute(id, payload);
  }

  deleteProduct(id: string): Promise<boolean> {
    return this.deleteProductUseCase.execute(id);
  }
}

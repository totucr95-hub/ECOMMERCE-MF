import { Injectable, inject } from '@angular/core';
import { AdminProductApiService } from '../services/admin-product-api.service';
import { AdminProduct } from '../../domain/entities/admin-product.entity';
import { ProductFormData } from '../../domain/product.models';
import { AdminProductRepository } from '../../domain/repositories/admin-product.repository';

@Injectable()
export class AdminProductStoreRepository implements AdminProductRepository {
  private readonly productApi = inject(AdminProductApiService);

  async findAll(): Promise<ReadonlyArray<AdminProduct>> {
    return this.productApi.getProducts();
  }

  async findById(id: string): Promise<AdminProduct | null> {
    return this.productApi.getProductById(id);
  }

  async create(payload: ProductFormData): Promise<AdminProduct> {
    return this.productApi.createProduct(payload);
  }

  async update(
    id: string,
    payload: ProductFormData,
  ): Promise<AdminProduct | null> {
    const previousProduct = await this.productApi.getProductById(id);
    return this.productApi.updateProduct(
      id,
      payload,
      previousProduct?.rating ?? 0,
    );
  }

  async delete(id: string): Promise<boolean> {
    return this.productApi.deleteProduct(id);
  }
}

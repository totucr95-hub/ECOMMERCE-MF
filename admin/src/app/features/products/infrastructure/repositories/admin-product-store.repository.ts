import { Injectable, inject } from '@angular/core';
import { ProductStore } from '@ecommerce-mf/shared-core';
import { Product } from '@ecommerce-mf/shared-models';
import { AdminProduct } from '../../domain/entities/admin-product.entity';
import { AdminProductRepository } from '../../domain/repositories/admin-product.repository';

@Injectable()
export class AdminProductStoreRepository implements AdminProductRepository {
  private readonly productStore = inject(ProductStore);

  async findAll(): Promise<ReadonlyArray<AdminProduct>> {
    await this.productStore.load();

    return this.productStore
      .products()
      .map((product) => this.toEntity(product));
  }

  private toEntity(product: Product): AdminProduct {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      image: product.image,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      featured: product.featured,
      rating: product.rating,
    };
  }
}

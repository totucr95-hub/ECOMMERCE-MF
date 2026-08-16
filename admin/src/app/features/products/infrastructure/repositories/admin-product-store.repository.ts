import { Injectable, inject } from '@angular/core';
import { ProductService } from '@ecommerce-mf/shared-core';
import { Product } from '@ecommerce-mf/shared-models';
import { AdminProduct } from '../../domain/entities/admin-product.entity';
import { ProductFormData } from '../../domain/product.models';
import { AdminProductRepository } from '../../domain/repositories/admin-product.repository';

@Injectable()
export class AdminProductStoreRepository implements AdminProductRepository {
  private readonly productService = inject(ProductService);
  private productsCache: AdminProduct[] | null = null;

  async findAll(): Promise<ReadonlyArray<AdminProduct>> {
    await this.ensureCacheLoaded();
    await this.simulateEndpointLatency();

    return [...(this.productsCache ?? [])];
  }

  async findById(id: string): Promise<AdminProduct | null> {
    await this.ensureCacheLoaded();
    await this.simulateEndpointLatency();

    const product = this.productsCache?.find((item) => item.id === id) ?? null;
    return product ? { ...product } : null;
  }

  async create(payload: ProductFormData): Promise<AdminProduct> {
    await this.ensureCacheLoaded();
    await this.simulateEndpointLatency();

    const createdProduct = this.toEntityFromForm(
      payload,
      this.createProductId(payload),
    );

    this.productsCache = [createdProduct, ...(this.productsCache ?? [])];
    return { ...createdProduct };
  }

  async update(
    id: string,
    payload: ProductFormData,
  ): Promise<AdminProduct | null> {
    await this.ensureCacheLoaded();
    await this.simulateEndpointLatency();

    const index = this.productsCache?.findIndex((item) => item.id === id) ?? -1;
    if (index < 0 || !this.productsCache) {
      return null;
    }

    const previousProduct = this.productsCache[index];
    const updatedProduct = this.toEntityFromForm(
      payload,
      id,
      previousProduct.rating,
    );

    this.productsCache = [
      ...this.productsCache.slice(0, index),
      updatedProduct,
      ...this.productsCache.slice(index + 1),
    ];

    return { ...updatedProduct };
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureCacheLoaded();
    await this.simulateEndpointLatency();

    const currentSize = this.productsCache?.length ?? 0;
    this.productsCache = (this.productsCache ?? []).filter(
      (product) => product.id !== id,
    );

    return (this.productsCache?.length ?? 0) < currentSize;
  }

  private async ensureCacheLoaded(): Promise<void> {
    if (this.productsCache) {
      return;
    }

    const products = await this.productService.getProducts();
    this.productsCache = products.map((product) => this.toEntity(product));
  }

  private createProductId(payload: ProductFormData): string {
    const normalizedSku = payload.sku
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (normalizedSku) {
      return `prd-${normalizedSku}`;
    }

    return `prd-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  private async simulateEndpointLatency(): Promise<void> {
    const delayMs = 280 + Math.floor(Math.random() * 420);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
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

  private toEntityFromForm(
    payload: ProductFormData,
    id: string,
    rating = 0,
  ): AdminProduct {
    const primaryImage = payload.images.find((image) => image.isPrimary)?.url;
    const fallbackImage = payload.images[0]?.url ?? '';

    return {
      id,
      name: payload.name,
      slug: payload.slug,
      description: payload.fullDescription || payload.shortDescription,
      image: primaryImage ?? fallbackImage,
      price: payload.price,
      stock: payload.stock,
      categoryId: payload.categoryId,
      featured: payload.featured,
      rating,
    };
  }
}

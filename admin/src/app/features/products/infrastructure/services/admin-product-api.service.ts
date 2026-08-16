import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appConfig } from '@ecommerce-mf/config';
import { firstValueFrom } from 'rxjs';
import { AdminProduct } from '../../domain/entities/admin-product.entity';
import { ProductFormData } from '../../domain/product.models';

interface AdminProductUpsertPayload {
  name: string;
  slug: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  categoryId: string;
  featured: boolean;
  rating: number;
}

@Injectable({ providedIn: 'root' })
export class AdminProductApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = appConfig.apiBaseUrl.replace(/\/$/, '');

  // El bearer lo agrega el interceptor global cuando el usuario ya esta logeado.
  async getProducts(): Promise<ReadonlyArray<AdminProduct>> {
    try {
      return await firstValueFrom(
        this.http.get<AdminProduct[]>(`${this.apiBaseUrl}/admin/products`),
      );
    } catch {
      return [];
    }
  }

  async getProductById(id: string): Promise<AdminProduct | null> {
    try {
      return await firstValueFrom(
        this.http.get<AdminProduct>(
          `${this.apiBaseUrl}/admin/products/${encodeURIComponent(id)}`,
        ),
      );
    } catch {
      return null;
    }
  }

  async createProduct(payload: ProductFormData): Promise<AdminProduct> {
    // El backend valida rol admin/manager antes de aceptar el alta.
    return firstValueFrom(
      this.http.post<AdminProduct>(
        `${this.apiBaseUrl}/admin/products`,
        this.toRequestPayload(payload),
      ),
    );
  }

  async updateProduct(
    id: string,
    payload: ProductFormData,
    rating = 0,
  ): Promise<AdminProduct | null> {
    try {
      return await firstValueFrom(
        this.http.put<AdminProduct>(
          `${this.apiBaseUrl}/admin/products/${encodeURIComponent(id)}`,
          this.toRequestPayload(payload, rating),
        ),
      );
    } catch {
      return null;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    // La misma proteccion de rol aplica para borrado.
    try {
      await firstValueFrom(
        this.http.delete<void>(
          `${this.apiBaseUrl}/admin/products/${encodeURIComponent(id)}`,
        ),
      );
      return true;
    } catch {
      return false;
    }
  }

  private toRequestPayload(
    payload: ProductFormData,
    rating = 0,
  ): AdminProductUpsertPayload {
    const primaryImage = payload.images.find((image) => image.isPrimary)?.url;
    const fallbackImage = payload.images[0]?.url ?? '';

    return {
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

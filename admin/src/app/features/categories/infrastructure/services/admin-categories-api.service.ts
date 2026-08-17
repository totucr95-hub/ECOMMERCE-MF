import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appConfig } from '@ecommerce-mf/config';
import { firstValueFrom } from 'rxjs';
import { CategorySummary } from '../../domain/entities/category-summary.entity';
import { CategoryFormData } from '../../domain/category.models';

interface AdminCategoryPayload {
  name: string;
  slug: string;
  description: string;
  products: number;
  featured: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminCategoriesApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = appConfig.apiBaseUrl.replace(/\/$/, '');

  async getCategories(): Promise<ReadonlyArray<CategorySummary>> {
    try {
      return await firstValueFrom(
        this.http.get<CategorySummary[]>(`${this.apiBaseUrl}/admin/categories`),
      );
    } catch {
      return [];
    }
  }

  async getCategoryById(id: string): Promise<CategorySummary | null> {
    try {
      return await firstValueFrom(
        this.http.get<CategorySummary>(
          `${this.apiBaseUrl}/admin/categories/${encodeURIComponent(id)}`,
        ),
      );
    } catch {
      return null;
    }
  }

  async createCategory(payload: CategoryFormData): Promise<CategorySummary> {
    return firstValueFrom(
      this.http.post<CategorySummary>(
        `${this.apiBaseUrl}/admin/categories`,
        this.toRequestPayload(payload),
      ),
    );
  }

  async updateCategory(
    id: string,
    payload: CategoryFormData,
  ): Promise<CategorySummary | null> {
    try {
      return await firstValueFrom(
        this.http.put<CategorySummary>(
          `${this.apiBaseUrl}/admin/categories/${encodeURIComponent(id)}`,
          this.toRequestPayload(payload),
        ),
      );
    } catch {
      return null;
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.delete<void>(
          `${this.apiBaseUrl}/admin/categories/${encodeURIComponent(id)}`,
        ),
      );
      return true;
    } catch {
      return false;
    }
  }

  private toRequestPayload(payload: CategoryFormData): AdminCategoryPayload {
    return {
      name: payload.name,
      slug: payload.slug,
      description: payload.description,
      products: payload.products,
      featured: payload.featured,
    };
  }
}

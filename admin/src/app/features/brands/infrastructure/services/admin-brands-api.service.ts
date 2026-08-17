import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appConfig } from '@ecommerce-mf/config';
import { firstValueFrom } from 'rxjs';
import { BrandSummary } from '../../domain/entities/brand-summary.entity';
import { BrandFormData } from '../../domain/brand.models';

interface AdminBrandPayload {
  code: string;
  name: string;
  categoryFocus: string;
  country: string;
  activeProducts: number;
  status: string;
  manager: string;
  updatedAt: string;
  notes: string;
}

@Injectable({ providedIn: 'root' })
export class AdminBrandsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = appConfig.apiBaseUrl.replace(/\/$/, '');

  async getBrands(): Promise<ReadonlyArray<BrandSummary>> {
    try {
      return await firstValueFrom(
        this.http.get<BrandSummary[]>(`${this.apiBaseUrl}/admin/brands`),
      );
    } catch {
      return [];
    }
  }

  async getBrandById(id: string): Promise<BrandSummary | null> {
    try {
      return await firstValueFrom(
        this.http.get<BrandSummary>(
          `${this.apiBaseUrl}/admin/brands/${encodeURIComponent(id)}`,
        ),
      );
    } catch {
      return null;
    }
  }

  async createBrand(payload: BrandFormData): Promise<BrandSummary> {
    return firstValueFrom(
      this.http.post<BrandSummary>(
        `${this.apiBaseUrl}/admin/brands`,
        this.toRequestPayload(payload),
      ),
    );
  }

  async updateBrand(
    id: string,
    payload: BrandFormData,
  ): Promise<BrandSummary | null> {
    try {
      return await firstValueFrom(
        this.http.put<BrandSummary>(
          `${this.apiBaseUrl}/admin/brands/${encodeURIComponent(id)}`,
          this.toRequestPayload(payload),
        ),
      );
    } catch {
      return null;
    }
  }

  async deleteBrand(id: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.delete<void>(
          `${this.apiBaseUrl}/admin/brands/${encodeURIComponent(id)}`,
        ),
      );
      return true;
    } catch {
      return false;
    }
  }

  private toRequestPayload(payload: BrandFormData): AdminBrandPayload {
    return {
      code: payload.code,
      name: payload.name,
      categoryFocus: payload.categoryFocus,
      country: payload.country,
      activeProducts: payload.activeProducts,
      status: payload.status,
      manager: payload.manager,
      updatedAt: payload.updatedAt,
      notes: payload.notes,
    };
  }
}

import { Injectable, inject } from '@angular/core';
import { BrandFormData } from '../../domain/brand.models';
import { BrandSummary } from '../../domain/entities/brand-summary.entity';
import { BrandsRepository } from '../../domain/repositories/brands.repository';
import { AdminBrandsApiService } from '../services/admin-brands-api.service';

@Injectable()
export class BrandsHttpRepository implements BrandsRepository {
  private readonly api = inject(AdminBrandsApiService);

  async findSummaries(): Promise<ReadonlyArray<BrandSummary>> {
    return this.api.getBrands();
  }

  async findById(id: string): Promise<BrandSummary | null> {
    return this.api.getBrandById(id);
  }

  async create(payload: BrandFormData): Promise<BrandSummary> {
    return this.api.createBrand(payload);
  }

  async update(
    id: string,
    payload: BrandFormData,
  ): Promise<BrandSummary | null> {
    return this.api.updateBrand(id, payload);
  }

  async delete(id: string): Promise<boolean> {
    return this.api.deleteBrand(id);
  }
}

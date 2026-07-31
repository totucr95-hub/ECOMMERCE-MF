import { Injectable, inject } from '@angular/core';
import { BrandFormData } from '../../domain/brand.models';
import { BrandSummary } from '../../domain/entities/brand-summary.entity';
import { BrandsRepository } from '../../domain/repositories/brands.repository';

@Injectable()
export class UpdateBrandUseCase {
  private readonly repository = inject(BrandsRepository);

  execute(id: string, payload: BrandFormData): Promise<BrandSummary | null> {
    return this.repository.update(id, payload);
  }
}

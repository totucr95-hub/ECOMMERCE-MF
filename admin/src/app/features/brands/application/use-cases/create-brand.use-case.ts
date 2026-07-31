import { Injectable, inject } from '@angular/core';
import { BrandFormData } from '../../domain/brand.models';
import { BrandSummary } from '../../domain/entities/brand-summary.entity';
import { BrandsRepository } from '../../domain/repositories/brands.repository';

@Injectable()
export class CreateBrandUseCase {
  private readonly repository = inject(BrandsRepository);

  execute(payload: BrandFormData): Promise<BrandSummary> {
    return this.repository.create(payload);
  }
}

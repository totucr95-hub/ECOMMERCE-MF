import { Injectable, inject } from '@angular/core';
import { BrandSummary } from '../../domain/entities/brand-summary.entity';
import { BrandsRepository } from '../../domain/repositories/brands.repository';

@Injectable()
export class GetBrandByIdUseCase {
  private readonly repository = inject(BrandsRepository);

  execute(id: string): Promise<BrandSummary | null> {
    return this.repository.findById(id);
  }
}

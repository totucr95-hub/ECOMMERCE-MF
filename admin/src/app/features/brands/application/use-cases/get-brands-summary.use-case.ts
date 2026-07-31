import { Injectable, inject } from '@angular/core';
import { BrandSummary } from '../../domain/entities/brand-summary.entity';
import { BrandsRepository } from '../../domain/repositories/brands.repository';

@Injectable()
export class GetBrandsSummaryUseCase {
  private readonly repository = inject(BrandsRepository);

  execute(): Promise<ReadonlyArray<BrandSummary>> {
    return this.repository.findSummaries();
  }
}

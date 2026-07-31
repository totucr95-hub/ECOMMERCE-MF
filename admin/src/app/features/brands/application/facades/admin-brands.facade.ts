import { Injectable, inject } from '@angular/core';
import { BrandFormData } from '../../domain/brand.models';
import { BrandSummary } from '../../domain/entities/brand-summary.entity';
import { CreateBrandUseCase } from '../use-cases/create-brand.use-case';
import { DeleteBrandUseCase } from '../use-cases/delete-brand.use-case';
import { GetBrandByIdUseCase } from '../use-cases/get-brand-by-id.use-case';
import { GetBrandsSummaryUseCase } from '../use-cases/get-brands-summary.use-case';
import { UpdateBrandUseCase } from '../use-cases/update-brand.use-case';

@Injectable()
export class AdminBrandsFacade {
  private readonly getBrandsSummaryUseCase = inject(GetBrandsSummaryUseCase);
  private readonly getBrandByIdUseCase = inject(GetBrandByIdUseCase);
  private readonly createBrandUseCase = inject(CreateBrandUseCase);
  private readonly updateBrandUseCase = inject(UpdateBrandUseCase);
  private readonly deleteBrandUseCase = inject(DeleteBrandUseCase);

  loadSummaries(): Promise<ReadonlyArray<BrandSummary>> {
    return this.getBrandsSummaryUseCase.execute();
  }

  readBrand(id: string): Promise<BrandSummary | null> {
    return this.getBrandByIdUseCase.execute(id);
  }

  createBrand(payload: BrandFormData): Promise<BrandSummary> {
    return this.createBrandUseCase.execute(payload);
  }

  updateBrand(id: string, payload: BrandFormData): Promise<BrandSummary | null> {
    return this.updateBrandUseCase.execute(id, payload);
  }

  deleteBrand(id: string): Promise<boolean> {
    return this.deleteBrandUseCase.execute(id);
  }
}

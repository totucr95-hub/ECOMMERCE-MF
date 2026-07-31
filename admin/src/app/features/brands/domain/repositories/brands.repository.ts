import { BrandFormData } from '../brand.models';
import { BrandSummary } from '../entities/brand-summary.entity';

export abstract class BrandsRepository {
  abstract findSummaries(): Promise<ReadonlyArray<BrandSummary>>;
  abstract findById(id: string): Promise<BrandSummary | null>;
  abstract create(payload: BrandFormData): Promise<BrandSummary>;
  abstract update(
    id: string,
    payload: BrandFormData,
  ): Promise<BrandSummary | null>;
  abstract delete(id: string): Promise<boolean>;
}

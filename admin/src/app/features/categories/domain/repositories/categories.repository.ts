import { CategorySummary } from '../entities/category-summary.entity';
import { CategoryFormData } from '../category.models';

export abstract class CategoriesRepository {
  abstract findSummaries(): Promise<ReadonlyArray<CategorySummary>>;
  abstract findById(id: string): Promise<CategorySummary | null>;
  abstract create(payload: CategoryFormData): Promise<CategorySummary>;
  abstract update(
    id: string,
    payload: CategoryFormData,
  ): Promise<CategorySummary | null>;
  abstract delete(id: string): Promise<boolean>;
}

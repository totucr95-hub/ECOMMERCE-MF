import { CategorySummary } from '../entities/category-summary.entity';

export abstract class CategoriesRepository {
  abstract findSummaries(): Promise<ReadonlyArray<CategorySummary>>;
}

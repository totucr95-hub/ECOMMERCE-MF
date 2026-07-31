import { Injectable, inject } from '@angular/core';
import { CategorySummary } from '../../domain/entities/category-summary.entity';
import { CategoriesRepository } from '../../domain/repositories/categories.repository';

@Injectable()
export class GetCategoriesSummaryUseCase {
  private readonly repository = inject(CategoriesRepository);

  execute(): Promise<ReadonlyArray<CategorySummary>> {
    return this.repository.findSummaries();
  }
}

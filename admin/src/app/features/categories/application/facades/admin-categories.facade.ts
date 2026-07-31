import { Injectable, inject } from '@angular/core';
import { GetCategoriesSummaryUseCase } from '../use-cases/get-categories-summary.use-case';
import { CategorySummary } from '../../domain/entities/category-summary.entity';

@Injectable()
export class AdminCategoriesFacade {
  private readonly getCategoriesSummaryUseCase = inject(
    GetCategoriesSummaryUseCase,
  );

  loadSummaries(): Promise<ReadonlyArray<CategorySummary>> {
    return this.getCategoriesSummaryUseCase.execute();
  }
}

import { Injectable, inject } from '@angular/core';
import { CreateCategoryUseCase } from '../use-cases/create-category.use-case';
import { DeleteCategoryUseCase } from '../use-cases/delete-category.use-case';
import { GetCategoryByIdUseCase } from '../use-cases/get-category-by-id.use-case';
import { GetCategoriesSummaryUseCase } from '../use-cases/get-categories-summary.use-case';
import { UpdateCategoryUseCase } from '../use-cases/update-category.use-case';
import { CategoryFormData } from '../../domain/category.models';
import { CategorySummary } from '../../domain/entities/category-summary.entity';

@Injectable()
export class AdminCategoriesFacade {
  private readonly getCategoriesSummaryUseCase = inject(
    GetCategoriesSummaryUseCase,
  );
  private readonly getCategoryByIdUseCase = inject(GetCategoryByIdUseCase);
  private readonly createCategoryUseCase = inject(CreateCategoryUseCase);
  private readonly updateCategoryUseCase = inject(UpdateCategoryUseCase);
  private readonly deleteCategoryUseCase = inject(DeleteCategoryUseCase);

  loadSummaries(): Promise<ReadonlyArray<CategorySummary>> {
    return this.getCategoriesSummaryUseCase.execute();
  }

  readCategory(id: string): Promise<CategorySummary | null> {
    return this.getCategoryByIdUseCase.execute(id);
  }

  createCategory(payload: CategoryFormData): Promise<CategorySummary> {
    return this.createCategoryUseCase.execute(payload);
  }

  updateCategory(
    id: string,
    payload: CategoryFormData,
  ): Promise<CategorySummary | null> {
    return this.updateCategoryUseCase.execute(id, payload);
  }

  deleteCategory(id: string): Promise<boolean> {
    return this.deleteCategoryUseCase.execute(id);
  }
}

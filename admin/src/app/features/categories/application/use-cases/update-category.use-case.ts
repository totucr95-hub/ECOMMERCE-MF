import { Injectable, inject } from '@angular/core';
import { CategoryFormData } from '../../domain/category.models';
import { CategorySummary } from '../../domain/entities/category-summary.entity';
import { CategoriesRepository } from '../../domain/repositories/categories.repository';

@Injectable()
export class UpdateCategoryUseCase {
  private readonly repository = inject(CategoriesRepository);

  execute(
    id: string,
    payload: CategoryFormData,
  ): Promise<CategorySummary | null> {
    return this.repository.update(id, payload);
  }
}

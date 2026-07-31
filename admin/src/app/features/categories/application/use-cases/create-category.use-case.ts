import { Injectable, inject } from '@angular/core';
import { CategoryFormData } from '../../domain/category.models';
import { CategorySummary } from '../../domain/entities/category-summary.entity';
import { CategoriesRepository } from '../../domain/repositories/categories.repository';

@Injectable()
export class CreateCategoryUseCase {
  private readonly repository = inject(CategoriesRepository);

  execute(payload: CategoryFormData): Promise<CategorySummary> {
    return this.repository.create(payload);
  }
}

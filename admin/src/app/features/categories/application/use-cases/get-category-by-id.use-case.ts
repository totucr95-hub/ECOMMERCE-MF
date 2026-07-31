import { Injectable, inject } from '@angular/core';
import { CategorySummary } from '../../domain/entities/category-summary.entity';
import { CategoriesRepository } from '../../domain/repositories/categories.repository';

@Injectable()
export class GetCategoryByIdUseCase {
  private readonly repository = inject(CategoriesRepository);

  execute(id: string): Promise<CategorySummary | null> {
    return this.repository.findById(id);
  }
}

import { Injectable, inject } from '@angular/core';
import { CategorySummary } from '../../domain/entities/category-summary.entity';
import { CategoryFormData } from '../../domain/category.models';
import { CategoriesRepository } from '../../domain/repositories/categories.repository';
import { AdminCategoriesApiService } from '../services/admin-categories-api.service';

@Injectable()
export class CategoriesHttpRepository implements CategoriesRepository {
  private readonly api = inject(AdminCategoriesApiService);

  async findSummaries(): Promise<ReadonlyArray<CategorySummary>> {
    return this.api.getCategories();
  }

  async findById(id: string): Promise<CategorySummary | null> {
    return this.api.getCategoryById(id);
  }

  async create(payload: CategoryFormData): Promise<CategorySummary> {
    return this.api.createCategory(payload);
  }

  async update(
    id: string,
    payload: CategoryFormData,
  ): Promise<CategorySummary | null> {
    return this.api.updateCategory(id, payload);
  }

  async delete(id: string): Promise<boolean> {
    return this.api.deleteCategory(id);
  }
}

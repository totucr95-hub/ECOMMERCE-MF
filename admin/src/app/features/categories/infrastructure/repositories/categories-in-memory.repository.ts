import { Injectable } from '@angular/core';
import { CategorySummary } from '../../domain/entities/category-summary.entity';
import { CategoriesRepository } from '../../domain/repositories/categories.repository';

@Injectable()
export class CategoriesInMemoryRepository implements CategoriesRepository {
  async findSummaries(): Promise<ReadonlyArray<CategorySummary>> {
    return [
      { name: 'Electronica', products: 32, featured: 'Si' },
      { name: 'Hogar', products: 21, featured: 'No' },
      { name: 'Deportes', products: 14, featured: 'Si' },
      { name: 'Moda', products: 28, featured: 'No' },
    ];
  }
}

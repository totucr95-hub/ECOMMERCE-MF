import { Injectable, inject } from '@angular/core';
import { CategoriesRepository } from '../../domain/repositories/categories.repository';

@Injectable()
export class DeleteCategoryUseCase {
  private readonly repository = inject(CategoriesRepository);

  execute(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}

import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AdminCategoriesFacade } from './application/facades/admin-categories.facade';
import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case';
import { DeleteCategoryUseCase } from './application/use-cases/delete-category.use-case';
import { GetCategoryByIdUseCase } from './application/use-cases/get-category-by-id.use-case';
import { GetCategoriesSummaryUseCase } from './application/use-cases/get-categories-summary.use-case';
import { UpdateCategoryUseCase } from './application/use-cases/update-category.use-case';
import { CategoriesRepository } from './domain/repositories/categories.repository';
import { CategoriesHttpRepository } from './infrastructure/repositories/categories-http.repository';

export const provideAdminCategoriesFeature = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    AdminCategoriesFacade,
    CreateCategoryUseCase,
    DeleteCategoryUseCase,
    GetCategoryByIdUseCase,
    GetCategoriesSummaryUseCase,
    UpdateCategoryUseCase,
    {
      provide: CategoriesRepository,
      useClass: CategoriesHttpRepository,
    },
  ]);
};

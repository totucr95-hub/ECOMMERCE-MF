import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AdminCategoriesFacade } from './application/facades/admin-categories.facade';
import { GetCategoriesSummaryUseCase } from './application/use-cases/get-categories-summary.use-case';
import { CategoriesRepository } from './domain/repositories/categories.repository';
import { CategoriesInMemoryRepository } from './infrastructure/repositories/categories-in-memory.repository';

export const provideAdminCategoriesFeature = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    AdminCategoriesFacade,
    GetCategoriesSummaryUseCase,
    {
      provide: CategoriesRepository,
      useClass: CategoriesInMemoryRepository,
    },
  ]);
};

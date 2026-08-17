import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AdminBrandsFacade } from './application/facades/admin-brands.facade';
import { CreateBrandUseCase } from './application/use-cases/create-brand.use-case';
import { DeleteBrandUseCase } from './application/use-cases/delete-brand.use-case';
import { GetBrandByIdUseCase } from './application/use-cases/get-brand-by-id.use-case';
import { GetBrandsSummaryUseCase } from './application/use-cases/get-brands-summary.use-case';
import { UpdateBrandUseCase } from './application/use-cases/update-brand.use-case';
import { BrandsRepository } from './domain/repositories/brands.repository';
import { BrandsHttpRepository } from './infrastructure/repositories/brands-http.repository';

export const provideAdminBrandsFeature = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    AdminBrandsFacade,
    CreateBrandUseCase,
    DeleteBrandUseCase,
    GetBrandByIdUseCase,
    GetBrandsSummaryUseCase,
    UpdateBrandUseCase,
    {
      provide: BrandsRepository,
      useClass: BrandsHttpRepository,
    },
  ]);
};

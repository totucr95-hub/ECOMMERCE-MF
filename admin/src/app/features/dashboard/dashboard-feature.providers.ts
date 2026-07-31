import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AdminDashboardFacade } from './application/facades/admin-dashboard.facade';
import { GetDashboardKpisUseCase } from './application/use-cases/get-dashboard-kpis.use-case';
import { DashboardRepository } from './domain/repositories/dashboard.repository';
import { DashboardInMemoryRepository } from './infrastructure/repositories/dashboard-in-memory.repository';

export const provideAdminDashboardFeature = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    AdminDashboardFacade,
    GetDashboardKpisUseCase,
    {
      provide: DashboardRepository,
      useClass: DashboardInMemoryRepository,
    },
  ]);
};

import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AdminReportsFacade } from './application/facades/admin-reports.facade';
import { GenerateReportUseCase } from './application/use-cases/generate-report.use-case';
import { ReportsRepository } from './domain/repositories/reports.repository';
import { ReportsInMemoryRepository } from './infrastructure/repositories/reports-in-memory.repository';

export const provideAdminReportsFeature = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    AdminReportsFacade,
    GenerateReportUseCase,
    {
      provide: ReportsRepository,
      useClass: ReportsInMemoryRepository,
    },
  ]);
};

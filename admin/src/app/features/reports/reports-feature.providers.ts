import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AdminReportsFacade } from './application/facades/admin-reports.facade';
import { GenerateReportUseCase } from './application/use-cases/generate-report.use-case';
import { ReportsRepository } from './domain/repositories/reports.repository';
import { ReportsHttpRepository } from './infrastructure/repositories/reports-http.repository';

export const provideAdminReportsFeature = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    AdminReportsFacade,
    GenerateReportUseCase,
    {
      provide: ReportsRepository,
      useClass: ReportsHttpRepository,
    },
  ]);
};

import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AdminLeadsFacade } from './application/facades/admin-leads.facade';
import { LeadsRepository } from './domain/repositories/leads.repository';
import { LeadsHttpRepository } from './infrastructure/repositories/leads-http.repository';

export const provideAdminLeadsFeature = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    AdminLeadsFacade,
    {
      provide: LeadsRepository,
      useClass: LeadsHttpRepository,
    },
  ]);
};

import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AdminSettingsFacade } from './application/facades/admin-settings.facade';
import { GetSettingsSummaryUseCase } from './application/use-cases/get-settings-summary.use-case';
import { SettingsRepository } from './domain/repositories/settings.repository';
import { SettingsInMemoryRepository } from './infrastructure/repositories/settings-in-memory.repository';

export const provideAdminSettingsFeature = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    AdminSettingsFacade,
    GetSettingsSummaryUseCase,
    {
      provide: SettingsRepository,
      useClass: SettingsInMemoryRepository,
    },
  ]);
};

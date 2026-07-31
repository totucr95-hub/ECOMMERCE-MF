import { Injectable, inject } from '@angular/core';
import { GetSettingsSummaryUseCase } from '../use-cases/get-settings-summary.use-case';
import { SettingSummary } from '../../domain/entities/setting-summary.entity';

@Injectable()
export class AdminSettingsFacade {
  private readonly getSettingsSummaryUseCase = inject(
    GetSettingsSummaryUseCase,
  );

  loadSummaries(): Promise<ReadonlyArray<SettingSummary>> {
    return this.getSettingsSummaryUseCase.execute();
  }
}

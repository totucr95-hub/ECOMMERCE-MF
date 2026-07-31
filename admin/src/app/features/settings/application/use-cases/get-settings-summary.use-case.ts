import { Injectable, inject } from '@angular/core';
import { SettingSummary } from '../../domain/entities/setting-summary.entity';
import { SettingsRepository } from '../../domain/repositories/settings.repository';

@Injectable()
export class GetSettingsSummaryUseCase {
  private readonly repository = inject(SettingsRepository);

  execute(): Promise<ReadonlyArray<SettingSummary>> {
    return this.repository.findSummaries();
  }
}

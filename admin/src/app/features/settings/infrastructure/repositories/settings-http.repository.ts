import { Injectable, inject } from '@angular/core';
import { SettingSummary } from '../../domain/entities/setting-summary.entity';
import { SettingsRepository } from '../../domain/repositories/settings.repository';
import { AdminSettingsApiService } from '../services/admin-settings-api.service';

@Injectable()
export class SettingsHttpRepository implements SettingsRepository {
  private readonly api = inject(AdminSettingsApiService);

  async findSummaries(): Promise<ReadonlyArray<SettingSummary>> {
    return this.api.getSettings();
  }
}

import { SettingSummary } from '../entities/setting-summary.entity';

export abstract class SettingsRepository {
  abstract findSummaries(): Promise<ReadonlyArray<SettingSummary>>;
}

import { ReportsFilterInput } from '../report.models';
import { ReportResult } from '../entities/report-result.entity';

export abstract class ReportsRepository {
  abstract generate(filters: ReportsFilterInput): Promise<ReportResult>;
}

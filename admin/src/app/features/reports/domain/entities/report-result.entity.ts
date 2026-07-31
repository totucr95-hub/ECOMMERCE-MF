import { ReportKpi } from './report-kpi.entity';
import { ReportRow } from './report-row.entity';

export interface ReportResult {
  generatedAt: string;
  title: string;
  summary: string;
  kpis: ReadonlyArray<ReportKpi>;
  rows: ReadonlyArray<ReportRow>;
}

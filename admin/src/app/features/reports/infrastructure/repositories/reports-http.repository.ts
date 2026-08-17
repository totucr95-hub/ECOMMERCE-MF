import { Injectable, inject } from '@angular/core';
import { ReportResult } from '../../domain/entities/report-result.entity';
import { ReportsFilterInput } from '../../domain/report.models';
import { ReportsRepository } from '../../domain/repositories/reports.repository';
import { AdminReportsApiService } from '../services/admin-reports-api.service';

@Injectable()
export class ReportsHttpRepository implements ReportsRepository {
  private readonly api = inject(AdminReportsApiService);

  async generate(filters: ReportsFilterInput): Promise<ReportResult> {
    return this.api.generateReport(filters);
  }
}

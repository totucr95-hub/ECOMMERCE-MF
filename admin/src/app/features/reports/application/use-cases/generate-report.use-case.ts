import { Injectable, inject } from '@angular/core';
import { ReportsFilterInput } from '../../domain/report.models';
import { ReportResult } from '../../domain/entities/report-result.entity';
import { ReportsRepository } from '../../domain/repositories/reports.repository';

@Injectable()
export class GenerateReportUseCase {
  private readonly repository = inject(ReportsRepository);

  execute(filters: ReportsFilterInput): Promise<ReportResult> {
    return this.repository.generate(filters);
  }
}

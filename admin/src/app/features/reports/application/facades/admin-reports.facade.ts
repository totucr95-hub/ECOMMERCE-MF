import { Injectable, inject } from '@angular/core';
import { ReportsFilterInput } from '../../domain/report.models';
import { ReportResult } from '../../domain/entities/report-result.entity';
import { GenerateReportUseCase } from '../use-cases/generate-report.use-case';

@Injectable()
export class AdminReportsFacade {
  private readonly generateReportUseCase = inject(GenerateReportUseCase);

  generate(filters: ReportsFilterInput): Promise<ReportResult> {
    return this.generateReportUseCase.execute(filters);
  }
}

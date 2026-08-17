import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appConfig } from '@ecommerce-mf/config';
import { firstValueFrom } from 'rxjs';
import { ReportResult } from '../../domain/entities/report-result.entity';
import { ReportsFilterInput } from '../../domain/report.models';

@Injectable({ providedIn: 'root' })
export class AdminReportsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = appConfig.apiBaseUrl.replace(/\/$/, '');

  async generateReport(filters: ReportsFilterInput): Promise<ReportResult> {
    return firstValueFrom(
      this.http.post<ReportResult>(
        `${this.apiBaseUrl}/admin/reports/generate`,
        {
          period: filters.period,
          channel: filters.channel,
          status: filters.status,
          country: filters.country,
        },
      ),
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appConfig } from '@ecommerce-mf/config';
import { firstValueFrom } from 'rxjs';
import { DashboardKpi } from '../../domain/entities/dashboard-kpi.entity';

@Injectable({ providedIn: 'root' })
export class AdminDashboardApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = appConfig.apiBaseUrl.replace(/\/$/, '');

  async getKpis(): Promise<ReadonlyArray<DashboardKpi>> {
    try {
      return await firstValueFrom(
        this.http.get<DashboardKpi[]>(
          `${this.apiBaseUrl}/admin/dashboard/kpis`,
        ),
      );
    } catch {
      return [];
    }
  }
}

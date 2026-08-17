import { Injectable, inject } from '@angular/core';
import { DashboardKpi } from '../../domain/entities/dashboard-kpi.entity';
import { DashboardRepository } from '../../domain/repositories/dashboard.repository';
import { AdminDashboardApiService } from '../services/admin-dashboard-api.service';

@Injectable()
export class DashboardHttpRepository implements DashboardRepository {
  private readonly api = inject(AdminDashboardApiService);

  async findKpis(): Promise<ReadonlyArray<DashboardKpi>> {
    return this.api.getKpis();
  }
}

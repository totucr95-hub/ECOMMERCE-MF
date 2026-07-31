import { Injectable, inject } from '@angular/core';
import { DashboardKpi } from '../../domain/entities/dashboard-kpi.entity';
import { DashboardRepository } from '../../domain/repositories/dashboard.repository';

@Injectable()
export class GetDashboardKpisUseCase {
  private readonly repository = inject(DashboardRepository);

  execute(): Promise<ReadonlyArray<DashboardKpi>> {
    return this.repository.findKpis();
  }
}

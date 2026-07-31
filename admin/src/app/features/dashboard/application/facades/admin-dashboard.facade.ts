import { Injectable, inject } from '@angular/core';
import { GetDashboardKpisUseCase } from '../use-cases/get-dashboard-kpis.use-case';
import { DashboardKpi } from '../../domain/entities/dashboard-kpi.entity';

@Injectable()
export class AdminDashboardFacade {
  private readonly getDashboardKpisUseCase = inject(GetDashboardKpisUseCase);

  loadKpis(): Promise<ReadonlyArray<DashboardKpi>> {
    return this.getDashboardKpisUseCase.execute();
  }
}

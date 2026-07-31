import { DashboardKpi } from '../entities/dashboard-kpi.entity';

export abstract class DashboardRepository {
  abstract findKpis(): Promise<ReadonlyArray<DashboardKpi>>;
}

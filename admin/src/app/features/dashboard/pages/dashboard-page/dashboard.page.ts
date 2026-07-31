import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import {
  ReusableTableColumn,
  ReusableTableComponent,
} from '../../../../shared/components/reusable-table/reusable-table.component';
import { AdminDashboardFacade } from '../../application/facades/admin-dashboard.facade';

@Component({
  selector: 'admin-dashboard-page',
  standalone: true,
  imports: [ReusableTableComponent],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  private readonly facade = inject(AdminDashboardFacade);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly columns: ReusableTableColumn[] = [
    { key: 'module', header: 'Modulo' },
    { key: 'kpi', header: 'KPI' },
    { key: 'value', header: 'Valor', align: 'right' },
    { key: 'status', header: 'Estado', align: 'center' },
  ];

  rows: ReadonlyArray<Record<string, unknown>> = [];

  constructor() {
    void this.loadRows();
  }

  private async loadRows(): Promise<void> {
    const kpis = await this.facade.loadKpis();
    this.rows = kpis.map((item) => ({ ...item }));
    this.cdr.markForCheck();
  }
}

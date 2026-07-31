import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ReusableTableColumn,
  ReusableTableComponent,
} from '../../shared/components/reusable-table/reusable-table.component';

@Component({
  selector: 'admin-dashboard-page',
  standalone: true,
  imports: [ReusableTableComponent],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  readonly columns: ReusableTableColumn[] = [
    { key: 'module', header: 'Modulo' },
    { key: 'kpi', header: 'KPI' },
    { key: 'value', header: 'Valor', align: 'right' },
    { key: 'status', header: 'Estado', align: 'center' },
  ];

  readonly rows: ReadonlyArray<Record<string, unknown>> = [
    {
      module: 'Ventas',
      kpi: 'Ingresos diarios',
      value: '$12,450',
      status: 'OK',
    },
    { module: 'Pedidos', kpi: 'Pendientes', value: '19', status: 'Atencion' },
    { module: 'Usuarios', kpi: 'Activos', value: '2,381', status: 'OK' },
    {
      module: 'Catalogo',
      kpi: 'Productos sin stock',
      value: '14',
      status: 'Revisar',
    },
  ];
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ReusableTableColumn,
  ReusableTableComponent,
} from '../../shared/components/reusable-table/reusable-table.component';

@Component({
  selector: 'admin-orders-page',
  standalone: true,
  imports: [ReusableTableComponent],
  templateUrl: './orders.page.html',
  styleUrl: './orders.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPage {
  readonly columns: ReusableTableColumn[] = [
    { key: 'orderId', header: 'Pedido' },
    { key: 'customer', header: 'Cliente' },
    { key: 'total', header: 'Total', align: 'right' },
    { key: 'status', header: 'Estado', align: 'center' },
  ];

  readonly rows: ReadonlyArray<Record<string, unknown>> = [
    {
      orderId: 'ORD-1042',
      customer: 'Maria Gomez',
      total: '$480.000',
      status: 'Pagado',
    },
    {
      orderId: 'ORD-1043',
      customer: 'Diego Ruiz',
      total: '$220.000',
      status: 'Pendiente',
    },
    {
      orderId: 'ORD-1044',
      customer: 'Juliana Mora',
      total: '$94.000',
      status: 'Despachado',
    },
    {
      orderId: 'ORD-1045',
      customer: 'Camilo Rojas',
      total: '$1.280.000',
      status: 'Pagado',
    },
  ];
}

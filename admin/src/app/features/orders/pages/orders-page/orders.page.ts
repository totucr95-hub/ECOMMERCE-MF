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
import { AdminOrdersFacade } from '../../application/facades/admin-orders.facade';

@Component({
  selector: 'admin-orders-page',
  standalone: true,
  imports: [ReusableTableComponent],
  templateUrl: './orders.page.html',
  styleUrl: './orders.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPage {
  private readonly facade = inject(AdminOrdersFacade);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly columns: ReusableTableColumn[] = [
    { key: 'orderId', header: 'Pedido' },
    { key: 'customer', header: 'Cliente' },
    { key: 'total', header: 'Total', align: 'right' },
    { key: 'status', header: 'Estado', align: 'center' },
  ];

  rows: ReadonlyArray<Record<string, unknown>> = [];

  constructor() {
    void this.loadRows();
  }

  private async loadRows(): Promise<void> {
    const summaries = await this.facade.loadSummaries();
    this.rows = summaries.map((item) => ({ ...item }));
    this.cdr.markForCheck();
  }
}

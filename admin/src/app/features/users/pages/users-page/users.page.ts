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
import { AdminUsersFacade } from '../../application/facades/admin-users.facade';

@Component({
  selector: 'admin-users-page',
  standalone: true,
  imports: [ReusableTableComponent],
  templateUrl: './users.page.html',
  styleUrl: './users.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPage {
  private readonly facade = inject(AdminUsersFacade);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly columns: ReusableTableColumn[] = [
    { key: 'name', header: 'Usuario' },
    { key: 'email', header: 'Correo' },
    { key: 'role', header: 'Rol', align: 'center' },
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

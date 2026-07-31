import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import {
  ReusableSortDirection,
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

  allRows: ReadonlyArray<Record<string, unknown>> = [];
  rows: ReadonlyArray<Record<string, unknown>> = [];
  totalItems = 0;
  pageIndex = 0;
  pageSize = 5;
  sortKey = 'name';
  sortDirection: ReusableSortDirection = 'asc';
  readonly pageSizeOptions: ReadonlyArray<number> = [5, 10, 20, 50];

  readonly columns: ReusableTableColumn[] = [
    { key: 'name', header: 'Usuario' },
    { key: 'email', header: 'Correo' },
    { key: 'role', header: 'Rol', align: 'center' },
    { key: 'status', header: 'Estado', align: 'center' },
  ];

  readonly tablePageChangeHandler = (nextPage: number, nextSize: number): void => {
    this.onTablePageChange(nextPage, nextSize);
  };
  readonly tableSortChangeHandler = (
    columnKey: string,
    direction: ReusableSortDirection,
  ): void => {
    this.onTableSortChange(columnKey, direction);
  };

  constructor() {
    void this.loadRows();
  }

  private async loadRows(): Promise<void> {
    const summaries = await this.facade.loadSummaries();
    this.allRows = summaries.map((item) => ({ ...item }));
    this.applyServerQueryState();
    this.cdr.markForCheck();
  }

  onTablePageChange(nextPage: number, nextSize: number): void {
    this.pageIndex = Math.max(0, nextPage);
    this.pageSize = Math.max(1, nextSize);
    this.applyServerQueryState();
    this.cdr.markForCheck();
  }

  onTableSortChange(columnKey: string, direction: ReusableSortDirection): void {
    this.sortKey = columnKey;
    this.sortDirection = direction;
    this.pageIndex = 0;
    this.applyServerQueryState();
    this.cdr.markForCheck();
  }

  private applyServerQueryState(): void {
    const sorted = [...this.allRows].sort((left, right) => {
      const leftValue = this.toSortableValue(left, this.sortKey);
      const rightValue = this.toSortableValue(right, this.sortKey);

      if (leftValue === rightValue) {
        return 0;
      }

      const directionFactor = this.sortDirection === 'asc' ? 1 : -1;
      return leftValue > rightValue ? directionFactor : -directionFactor;
    });

    this.totalItems = sorted.length;
    const totalPages = Math.max(1, Math.ceil(this.totalItems / this.pageSize));
    if (this.pageIndex >= totalPages) {
      this.pageIndex = totalPages - 1;
    }

    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.rows = sorted.slice(start, end);
  }

  private toSortableValue(
    row: Record<string, unknown>,
    key: string,
  ): number | string {
    const value = row[key];
    if (typeof value === 'number') {
      return value;
    }

    return String(value ?? '').toLocaleLowerCase('es');
  }
}

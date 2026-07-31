import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface ReusableTableColumn {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
}

export interface ReusableTableAction {
  id: string;
  label: string;
  variant?: 'default' | 'danger';
}

export type ReusableSortDirection = 'asc' | 'desc';

@Component({
  selector: 'admin-reusable-table',
  standalone: true,
  templateUrl: './reusable-table.component.html',
  styleUrl: './reusable-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReusableTableComponent {
  readonly title = input<string>('Tabla');
  readonly subtitle = input<string>('');
  readonly columns = input.required<ReadonlyArray<ReusableTableColumn>>();
  readonly rows = input<ReadonlyArray<Record<string, unknown>>>([]);
  readonly emptyMessage = input<string>('No hay datos para mostrar.');
  readonly actions = input<ReadonlyArray<ReusableTableAction>>([]);
  readonly onAction = input<
    ((actionId: string, row: Record<string, unknown>) => void) | null
  >(null);
  readonly pageIndex = input<number>(0);
  readonly pageSize = input<number>(10);
  readonly totalItems = input<number | null>(null);
  readonly pageSizeOptions = input<ReadonlyArray<number>>([5, 10, 20, 50]);
  readonly onPageChange = input<
    ((pageIndex: number, pageSize: number) => void) | null
  >(null);
  readonly sortKey = input<string | null>(null);
  readonly sortDirection = input<ReusableSortDirection | null>(null);
  readonly onSortChange = input<
    ((columnKey: string, direction: ReusableSortDirection) => void) | null
  >(null);
  readonly sortableColumns = input<ReadonlyArray<string> | null>(null);

  hasActions(): boolean {
    return this.actions().length > 0;
  }

  executeAction(actionId: string, row: Record<string, unknown>): void {
    const callback = this.onAction();
    if (!callback) {
      return;
    }

    callback(actionId, row);
  }

  getCellValue(row: Record<string, unknown>, key: string): string {
    const value = row[key];
    if (value === null || value === undefined || value === '') {
      return '—';
    }

    return String(value);
  }

  isSortable(column: ReusableTableColumn): boolean {
    const onSort = this.onSortChange();
    if (!onSort) {
      return false;
    }

    const allowedColumns = this.sortableColumns();
    if (!allowedColumns) {
      return true;
    }

    return allowedColumns.includes(column.key);
  }

  toggleSort(column: ReusableTableColumn): void {
    if (!this.isSortable(column)) {
      return;
    }

    const currentKey = this.sortKey();
    const currentDirection = this.sortDirection();
    const nextDirection: ReusableSortDirection =
      currentKey === column.key && currentDirection === 'asc' ? 'desc' : 'asc';

    this.onSortChange()?.(column.key, nextDirection);
  }

  getSortState(column: ReusableTableColumn): 'none' | ReusableSortDirection {
    return this.sortKey() === column.key ? (this.sortDirection() ?? 'none') : 'none';
  }

  getSortLabel(column: ReusableTableColumn): string {
    const state = this.getSortState(column);
    if (state === 'asc') {
      return 'Ascendente';
    }

    if (state === 'desc') {
      return 'Descendente';
    }

    return 'Sin ordenar';
  }

  resolvedTotalItems(): number {
    const providedTotal = this.totalItems();
    if (providedTotal === null || providedTotal === undefined) {
      return this.rows().length;
    }

    return Math.max(0, providedTotal);
  }

  resolvedPageSize(): number {
    return Math.max(1, this.pageSize());
  }

  totalPages(): number {
    return Math.max(
      1,
      Math.ceil(this.resolvedTotalItems() / this.resolvedPageSize()),
    );
  }

  currentPageNumber(): number {
    const current = this.pageIndex() + 1;
    return Math.min(Math.max(1, current), this.totalPages());
  }

  canGoPreviousPage(): boolean {
    return this.currentPageNumber() > 1;
  }

  canGoNextPage(): boolean {
    return this.currentPageNumber() < this.totalPages();
  }

  pageRangeStart(): number {
    const total = this.resolvedTotalItems();
    if (total === 0) {
      return 0;
    }

    return (this.currentPageNumber() - 1) * this.resolvedPageSize() + 1;
  }

  pageRangeEnd(): number {
    const total = this.resolvedTotalItems();
    if (total === 0) {
      return 0;
    }

    return Math.min(this.currentPageNumber() * this.resolvedPageSize(), total);
  }

  shouldShowPagination(): boolean {
    return this.onPageChange() !== null || this.totalPages() > 1;
  }

  goToPreviousPage(): void {
    if (!this.canGoPreviousPage()) {
      return;
    }

    this.emitPageChange(this.currentPageNumber() - 2, this.resolvedPageSize());
  }

  goToNextPage(): void {
    if (!this.canGoNextPage()) {
      return;
    }

    this.emitPageChange(this.currentPageNumber(), this.resolvedPageSize());
  }

  onPageSizeSelection(value: string): void {
    const nextPageSize = Number(value);
    if (!Number.isFinite(nextPageSize) || nextPageSize < 1) {
      return;
    }

    this.emitPageChange(0, nextPageSize);
  }

  private emitPageChange(nextPageIndex: number, nextPageSize: number): void {
    const callback = this.onPageChange();
    if (!callback) {
      return;
    }

    callback(Math.max(0, nextPageIndex), Math.max(1, nextPageSize));
  }
}

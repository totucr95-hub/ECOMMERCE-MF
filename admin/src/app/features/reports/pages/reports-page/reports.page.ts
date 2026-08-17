import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ReusableSortDirection,
  ReusableTableColumn,
  ReusableTableComponent,
} from '../../../../shared/components/reusable-table/reusable-table.component';
import { AdminReportsFacade } from '../../application/facades/admin-reports.facade';
import { ReportResult } from '../../domain/entities/report-result.entity';
import { ReportsFilterInput } from '../../domain/report.models';

@Component({
  selector: 'admin-reports-page',
  standalone: true,
  imports: [FormsModule, DatePipe, ReusableTableComponent],
  templateUrl: './reports.page.html',
  styleUrl: './reports.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsPage {
  private readonly facade = inject(AdminReportsFacade);
  private readonly cdr = inject(ChangeDetectorRef);

  allRows: ReadonlyArray<Record<string, unknown>> = [];
  rows: ReadonlyArray<Record<string, unknown>> = [];
  totalItems = 0;
  pageIndex = 0;
  pageSize = 5;
  sortKey = 'metric';
  sortDirection: ReusableSortDirection = 'asc';
  readonly pageSizeOptions: ReadonlyArray<number> = [5, 10, 20, 50];
  isLoading = false;
  feedbackMessage = 'Define filtros y ejecuta el reporte.';
  result: ReportResult | null = null;

  readonly columns: ReusableTableColumn[] = [
    { key: 'metric', header: 'Metrica' },
    { key: 'value', header: 'Valor', align: 'right' },
    { key: 'comparison', header: 'Comparativa', align: 'center' },
    { key: 'status', header: 'Estado', align: 'center' },
    { key: 'owner', header: 'Responsable', align: 'center' },
  ];

  filters: ReportsFilterInput = {
    period: 'Ultimos 30 dias',
    channel: 'Todos',
    status: 'Todos',
    country: 'Colombia',
  };

  readonly tablePageChangeHandler = (
    nextPage: number,
    nextSize: number,
  ): void => {
    this.onTablePageChange(nextPage, nextSize);
  };
  readonly tableSortChangeHandler = (
    columnKey: string,
    direction: ReusableSortDirection,
  ): void => {
    this.onTableSortChange(columnKey, direction);
  };

  async runReport(): Promise<void> {
    this.isLoading = true;
    this.feedbackMessage = 'Generando reporte desde la API...';
    this.cdr.markForCheck();

    this.result = await this.facade.generate({ ...this.filters });
    this.allRows = this.result.rows.map((row) => ({ ...row }));
    this.pageIndex = 0;
    this.applyServerQueryState();
    this.isLoading = false;
    this.feedbackMessage = `Reporte generado: ${this.result.summary}`;
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

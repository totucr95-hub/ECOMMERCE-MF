import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
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

  get rows(): ReadonlyArray<Record<string, unknown>> {
    if (!this.result) {
      return [];
    }

    return this.result.rows.map((row) => ({ ...row }));
  }

  async runReport(): Promise<void> {
    this.isLoading = true;
    this.feedbackMessage = 'Generando reporte desde endpoint simulado...';
    this.cdr.markForCheck();

    this.result = await this.facade.generate({ ...this.filters });
    this.isLoading = false;
    this.feedbackMessage = `Reporte generado: ${this.result.summary}`;
    this.cdr.markForCheck();
  }
}

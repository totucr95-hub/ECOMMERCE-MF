import { Injectable } from '@angular/core';
import { ReportsFilterInput } from '../../domain/report.models';
import { ReportResult } from '../../domain/entities/report-result.entity';
import { ReportRow } from '../../domain/entities/report-row.entity';
import { ReportsRepository } from '../../domain/repositories/reports.repository';

@Injectable()
export class ReportsInMemoryRepository implements ReportsRepository {
  private readonly baseRows: ReadonlyArray<ReportRow> = this.buildRows();

  async generate(filters: ReportsFilterInput): Promise<ReportResult> {
    await this.simulateEndpointLatency();

    const summary = this.composeSummary(filters);

    return {
      generatedAt: new Date().toISOString(),
      title: 'Reporte ejecutivo de negocio',
      summary,
      kpis: [
        {
          key: 'revenue',
          label: 'Revenue',
          value: '$182.4M',
          trend: '+12.8%',
        },
        {
          key: 'orders',
          label: 'Pedidos',
          value: '3,241',
          trend: '+8.1%',
        },
        {
          key: 'aov',
          label: 'Ticket medio',
          value: '$286k',
          trend: '+4.2%',
        },
        {
          key: 'refunds',
          label: 'Reembolsos',
          value: '1.4%',
          trend: '-0.3 pts',
        },
      ],
      rows: this.baseRows,
    };
  }

  private composeSummary(filters: ReportsFilterInput): string {
    return `Periodo ${filters.period} - Canal ${filters.channel} - Estado ${filters.status} - Pais ${filters.country}`;
  }

  private async simulateEndpointLatency(): Promise<void> {
    const delayMs = 280 + Math.floor(Math.random() * 420);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  private buildRows(): ReadonlyArray<ReportRow> {
    const metrics = [
      'Ingresos netos',
      'Conversion checkout',
      'Ticket promedio',
      'Reembolsos',
      'CAC',
      'Retencion 30d',
      'NPS',
      'Margen bruto',
    ];
    const statuses = ['Saludable', 'Mejorando', 'Estable', 'Controlado', 'Riesgo'];
    const owners = ['Finanzas', 'CRO', 'Comercial', 'Operaciones', 'BI'];

    return Array.from({ length: 100 }, (_unused, index) => {
      const item = index + 1;
      const metric = metrics[index % metrics.length];
      const isPercentMetric = metric.includes('Conversion') || metric.includes('Retencion');
      const value = isPercentMetric
        ? `${(2 + ((item * 0.17) % 8)).toFixed(1)}%`
        : `$${(120000 + item * 9300).toLocaleString('es-CO')}`;

      return {
        id: `r-${item}`,
        metric: `${metric} ${Math.ceil(item / metrics.length)}`,
        value,
        comparison: `${item % 2 === 0 ? '+' : '-'}${(0.3 + ((item * 0.11) % 4)).toFixed(1)}% vs periodo anterior`,
        status: statuses[index % statuses.length],
        owner: owners[index % owners.length],
      };
    });
  }
}

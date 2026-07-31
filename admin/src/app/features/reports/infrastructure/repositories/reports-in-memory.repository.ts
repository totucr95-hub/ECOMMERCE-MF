import { Injectable } from '@angular/core';
import { ReportsFilterInput } from '../../domain/report.models';
import { ReportResult } from '../../domain/entities/report-result.entity';
import { ReportRow } from '../../domain/entities/report-row.entity';
import { ReportsRepository } from '../../domain/repositories/reports.repository';

@Injectable()
export class ReportsInMemoryRepository implements ReportsRepository {
  private readonly baseRows: ReadonlyArray<ReportRow> = [
    {
      id: 'r-1',
      metric: 'Ingresos netos',
      value: '$182.4M',
      comparison: '+12.8% vs periodo anterior',
      status: 'Saludable',
      owner: 'Finanzas',
    },
    {
      id: 'r-2',
      metric: 'Conversion checkout',
      value: '3.9%',
      comparison: '+0.6 pts',
      status: 'Mejorando',
      owner: 'CRO',
    },
    {
      id: 'r-3',
      metric: 'Ticket promedio',
      value: '$286.000',
      comparison: '+4.2%',
      status: 'Estable',
      owner: 'Comercial',
    },
    {
      id: 'r-4',
      metric: 'Reembolsos',
      value: '1.4%',
      comparison: '-0.3 pts',
      status: 'Controlado',
      owner: 'Operaciones',
    },
  ];

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
}

import { Injectable } from '@angular/core';
import { DashboardKpi } from '../../domain/entities/dashboard-kpi.entity';
import { DashboardRepository } from '../../domain/repositories/dashboard.repository';

@Injectable()
export class DashboardInMemoryRepository implements DashboardRepository {
  async findKpis(): Promise<ReadonlyArray<DashboardKpi>> {
    return [
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
}

import { Injectable } from '@angular/core';
import { DashboardKpi } from '../../domain/entities/dashboard-kpi.entity';
import { DashboardRepository } from '../../domain/repositories/dashboard.repository';

@Injectable()
export class DashboardInMemoryRepository implements DashboardRepository {
  async findKpis(): Promise<ReadonlyArray<DashboardKpi>> {
    const modules = [
      'Ventas',
      'Pedidos',
      'Usuarios',
      'Catalogo',
      'Pagos',
      'Logistica',
    ];
    const kpis = [
      'Ingresos diarios',
      'Pendientes',
      'Activos',
      'Productos sin stock',
      'Aprobacion pagos',
      'Despachos en SLA',
    ];
    const statuses = ['OK', 'OK', 'Atencion', 'Revisar'];

    return Array.from({ length: 100 }, (_unused, index) => {
      const item = index + 1;
      const module = modules[index % modules.length];
      const kpi = kpis[index % kpis.length];
      const value =
        index % 2 === 0
          ? `$${(8000 + item * 320).toLocaleString('en-US')}`
          : (5 + (item % 97)).toString();

      return {
        module,
        kpi,
        value,
        status: statuses[index % statuses.length],
      };
    });
  }
}

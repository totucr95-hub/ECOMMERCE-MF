import { Injectable } from '@angular/core';
import { SettingSummary } from '../../domain/entities/setting-summary.entity';
import { SettingsRepository } from '../../domain/repositories/settings.repository';

@Injectable()
export class SettingsInMemoryRepository implements SettingsRepository {
  async findSummaries(): Promise<ReadonlyArray<SettingSummary>> {
    return [
      {
        group: 'Seguridad',
        setting: '2FA obligatorio',
        value: 'Habilitado',
        updated: '2026-07-28',
      },
      {
        group: 'Pedidos',
        setting: 'Autoconfirmacion',
        value: 'Manual',
        updated: '2026-07-24',
      },
      {
        group: 'Inventario',
        setting: 'Alerta de stock',
        value: 'Menor a 10',
        updated: '2026-07-20',
      },
      {
        group: 'Notificaciones',
        setting: 'Reporte diario',
        value: '08:00 AM',
        updated: '2026-07-31',
      },
    ];
  }
}

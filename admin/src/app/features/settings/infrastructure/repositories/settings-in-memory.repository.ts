import { Injectable } from '@angular/core';
import { SettingSummary } from '../../domain/entities/setting-summary.entity';
import { SettingsRepository } from '../../domain/repositories/settings.repository';

@Injectable()
export class SettingsInMemoryRepository implements SettingsRepository {
  async findSummaries(): Promise<ReadonlyArray<SettingSummary>> {
    const groups = [
      'Seguridad',
      'Pedidos',
      'Inventario',
      'Notificaciones',
      'Pagos',
      'Integraciones',
    ];
    const settings = [
      '2FA obligatorio',
      'Autoconfirmacion',
      'Alerta de stock',
      'Reporte diario',
      'Webhook de pagos',
      'Ventana de mantenimiento',
    ];
    const values = [
      'Habilitado',
      'Manual',
      'Menor a 10',
      '08:00 AM',
      'Activo',
      'Domingos 02:00',
    ];

    return Array.from({ length: 100 }, (_unused, index) => ({
      group: groups[index % groups.length],
      setting: `${settings[index % settings.length]} #${index + 1}`,
      value: values[index % values.length],
      updated: this.formatDate(index % 40),
    }));
  }

  private formatDate(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().slice(0, 10);
  }
}

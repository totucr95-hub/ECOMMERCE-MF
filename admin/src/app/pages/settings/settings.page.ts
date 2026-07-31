import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ReusableTableColumn,
  ReusableTableComponent,
} from '../../shared/components/reusable-table/reusable-table.component';

@Component({
  selector: 'admin-settings-page',
  standalone: true,
  imports: [ReusableTableComponent],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage {
  readonly columns: ReusableTableColumn[] = [
    { key: 'group', header: 'Grupo' },
    { key: 'setting', header: 'Configuracion' },
    { key: 'value', header: 'Valor actual' },
    { key: 'updated', header: 'Ultima actualizacion', align: 'center' },
  ];

  readonly rows: ReadonlyArray<Record<string, unknown>> = [
    {
      group: 'Seguridad',
      setting: '2FA obligatorio',
      value: 'Habilitado',
      updated: '2026-07-28',
    },
    {
      group: 'Pedidos',
      setting: 'Autoconfirmación',
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

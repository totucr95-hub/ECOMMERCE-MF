import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import {
  ReusableTableColumn,
  ReusableTableComponent,
} from '../../../../shared/components/reusable-table/reusable-table.component';
import { AdminSettingsFacade } from '../../application/facades/admin-settings.facade';

@Component({
  selector: 'admin-settings-page',
  standalone: true,
  imports: [ReusableTableComponent],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage {
  private readonly facade = inject(AdminSettingsFacade);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly columns: ReusableTableColumn[] = [
    { key: 'group', header: 'Grupo' },
    { key: 'setting', header: 'Configuracion' },
    { key: 'value', header: 'Valor actual' },
    { key: 'updated', header: 'Ultima actualizacion', align: 'center' },
  ];

  rows: ReadonlyArray<Record<string, unknown>> = [];

  constructor() {
    void this.loadRows();
  }

  private async loadRows(): Promise<void> {
    const summaries = await this.facade.loadSummaries();
    this.rows = summaries.map((item) => ({ ...item }));
    this.cdr.markForCheck();
  }
}

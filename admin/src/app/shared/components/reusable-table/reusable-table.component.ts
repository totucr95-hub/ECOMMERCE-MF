import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface ReusableTableColumn {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
}

export interface ReusableTableAction {
  id: string;
  label: string;
  variant?: 'default' | 'danger';
}

@Component({
  selector: 'admin-reusable-table',
  standalone: true,
  templateUrl: './reusable-table.component.html',
  styleUrl: './reusable-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReusableTableComponent {
  readonly title = input<string>('Tabla');
  readonly subtitle = input<string>('');
  readonly columns = input.required<ReadonlyArray<ReusableTableColumn>>();
  readonly rows = input<ReadonlyArray<Record<string, unknown>>>([]);
  readonly emptyMessage = input<string>('No hay datos para mostrar.');
  readonly actions = input<ReadonlyArray<ReusableTableAction>>([]);
  readonly onAction = input<
    ((actionId: string, row: Record<string, unknown>) => void) | null
  >(null);

  hasActions(): boolean {
    return this.actions().length > 0;
  }

  executeAction(actionId: string, row: Record<string, unknown>): void {
    const callback = this.onAction();
    if (!callback) {
      return;
    }

    callback(actionId, row);
  }

  getCellValue(row: Record<string, unknown>, key: string): string {
    const value = row[key];
    if (value === null || value === undefined || value === '') {
      return '—';
    }

    return String(value);
  }
}

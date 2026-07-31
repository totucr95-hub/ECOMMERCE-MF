import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface ReusableTableColumn {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
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

  getCellValue(row: Record<string, unknown>, key: string): string {
    const value = row[key];
    if (value === null || value === undefined || value === '') {
      return '—';
    }

    return String(value);
  }
}

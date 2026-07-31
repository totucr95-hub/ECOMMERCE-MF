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
import { AdminCategoriesFacade } from '../../application/facades/admin-categories.facade';

@Component({
  selector: 'admin-categories-page',
  standalone: true,
  imports: [ReusableTableComponent],
  templateUrl: './categories.page.html',
  styleUrl: './categories.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPage {
  private readonly facade = inject(AdminCategoriesFacade);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly columns: ReusableTableColumn[] = [
    { key: 'name', header: 'Categoria' },
    { key: 'products', header: 'Productos', align: 'right' },
    { key: 'featured', header: 'Destacada', align: 'center' },
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

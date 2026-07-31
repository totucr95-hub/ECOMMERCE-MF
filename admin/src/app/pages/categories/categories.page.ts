import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ReusableTableColumn,
  ReusableTableComponent,
} from '../../shared/components/reusable-table/reusable-table.component';

@Component({
  selector: 'admin-categories-page',
  standalone: true,
  imports: [ReusableTableComponent],
  templateUrl: './categories.page.html',
  styleUrl: './categories.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPage {
  readonly columns: ReusableTableColumn[] = [
    { key: 'name', header: 'Categoria' },
    { key: 'products', header: 'Productos', align: 'right' },
    { key: 'featured', header: 'Destacada', align: 'center' },
  ];

  readonly rows: ReadonlyArray<Record<string, unknown>> = [
    { name: 'Electronica', products: 32, featured: 'Si' },
    { name: 'Hogar', products: 21, featured: 'No' },
    { name: 'Deportes', products: 14, featured: 'Si' },
    { name: 'Moda', products: 28, featured: 'No' },
  ];
}

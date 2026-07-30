import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '@ecommerce-mf/shared-models';

@Component({
  selector: 'lib-products-ui-product-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-ui-product-table.html',
  styleUrl: './products-ui-product-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsUiProductTable {
  @Input() products: Product[] = [];
}

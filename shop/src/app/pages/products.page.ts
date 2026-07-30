import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore, ProductStore } from '@ecommerce-mf/shared-core';
import { ProductsUiProductCard } from '@ecommerce-mf/products-ui-product-card';

@Component({
  selector: 'shop-products-page',
  standalone: true,
  imports: [RouterLink, ProductsUiProductCard],
  template: `
    <section>
      <div class="toolbar">
        <h1>Listado de productos</h1>
        <input [value]="store.query()" (input)="setQuery($any($event.target).value)" placeholder="Buscar producto" />
      </div>

      <div class="grid">
        @for (product of store.filteredProducts(); track product.id) {
          <div class="card-wrap">
            <lib-products-ui-product-card [product]="product" (buy)="addToCart(product.id)"></lib-products-ui-product-card>
            <a class="detail-link" [routerLink]="['/shop/product', product.id]">Detalle</a>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`.toolbar{display:flex;justify-content:space-between;gap:1rem;align-items:center;margin-bottom:1rem}.toolbar input{padding:.6rem .75rem;border:1px solid #cbd5e1;border-radius:10px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:1rem}.card-wrap{display:grid;gap:.5rem}.detail-link{text-decoration:none;color:#0f766e;font-weight:700}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPage implements OnInit {
  readonly store = inject(ProductStore);
  private readonly cartStore = inject(CartStore);

  async ngOnInit(): Promise<void> {
    await this.store.load();
  }

  setQuery(value: string): void {
    this.store.query.set(value);
  }

  addToCart(productId: string): void {
    const product = this.store.products().find((item) => item.id === productId);
    if (product) {
      this.cartStore.add(product);
    }
  }
}

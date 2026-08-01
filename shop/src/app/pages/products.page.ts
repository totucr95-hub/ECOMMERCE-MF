import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '@ecommerce-mf/shared-core';
import { ProductCatalogFacade } from '@ecommerce-mf/products-feature-products';
import { ProductSort } from '@ecommerce-mf/products-domain-products';
import { ProductsUiProductCard } from '@ecommerce-mf/products-ui-product-card';
import { Product } from '@ecommerce-mf/shared-models';

@Component({
  selector: 'shop-products-page',
  standalone: true,
  imports: [RouterLink, ProductsUiProductCard],
  template: `
    <section class="catalog">
      <div class="toolbar">
        <div>
          <p class="eyebrow">Catalogo</p>
          <h1>Encuentra tu proximo producto</h1>
        </div>
        <a class="cart-link" routerLink="/shop/cart">Ver carrito</a>
      </div>

      <div class="filters" aria-label="Filtros del catalogo">
        <label>
          <span>Buscar</span>
          <input
            type="search"
            [value]="catalog.filters().query"
            (input)="setQuery($any($event.target).value)"
            placeholder="Nombre o descripcion"
          />
        </label>

        <label>
          <span>Categoria</span>
          <select
            [value]="catalog.filters().categoryId ?? ''"
            (change)="setCategory($any($event.target).value)"
          >
            <option value="">Todas</option>
            @for (category of catalog.categories(); track category.id) {
              <option [value]="category.id">{{ category.name }}</option>
            }
          </select>
        </label>

        <label>
          <span>Ordenar</span>
          <select
            [value]="catalog.filters().sort"
            (change)="setSort($any($event.target).value)"
          >
            <option value="featured">Destacados</option>
            <option value="name-asc">Nombre A-Z</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
          </select>
        </label>
      </div>

      @if (catalog.isLoading()) {
        <p class="status">Cargando catalogo...</p>
      } @else if (catalog.errorMessage()) {
        <p class="status status--error">{{ catalog.errorMessage() }}</p>
      } @else if (catalog.products().length === 0) {
        <p class="status">No encontramos productos con estos filtros.</p>
      } @else {
        <p class="result-count">{{ catalog.products().length }} productos</p>
        <div class="grid">
          @for (product of catalog.products(); track product.id) {
            <div class="card-wrap">
              <lib-products-ui-product-card
                [product]="product"
                (buy)="addToCart(product)"
              ></lib-products-ui-product-card>
              <a
                class="detail-link"
                [routerLink]="['/shop/product', product.id]"
                >Detalle</a
              >
            </div>
          }
        </div>
      }
    </section>
  `,
  styles: [
    `
      .catalog {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem 4rem;
      }
      .toolbar {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: end;
        margin-bottom: 1.5rem;
      }
      .eyebrow {
        margin: 0 0 0.35rem;
        color: #0d9d3e;
        font-size: 0.75rem;
        font-weight: 800;
        text-transform: uppercase;
      }
      .toolbar h1 {
        margin: 0;
      }
      .cart-link,
      .detail-link {
        text-decoration: none;
        color: #0d9d3e;
        font-weight: 700;
      }
      .cart-link {
        border: 1px solid #17bd55;
        border-radius: 999px;
        padding: 0.52rem 0.85rem;
        background: #0d9d3e;
        color: #fff;
      }
      .filters {
        display: grid;
        grid-template-columns: minmax(220px, 2fr) repeat(2, minmax(160px, 1fr));
        gap: 1rem;
        padding: 1rem;
        background: #f7fafc;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
      }
      .filters label {
        display: grid;
        gap: 0.35rem;
        font-size: 0.8rem;
        font-weight: 700;
        color: #334155;
      }
      .filters input,
      .filters select {
        min-height: 42px;
        padding: 0.6rem 0.75rem;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        background: #fff;
        color: #0f172a;
      }
      .filters input:focus,
      .filters select:focus {
        outline: 3px solid rgba(13, 157, 62, 0.18);
        border-color: #0d9d3e;
      }
      .result-count {
        margin: 1.25rem 0 0.75rem;
        color: #64748b;
      }
      .status {
        padding: 3rem 1rem;
        text-align: center;
        color: #64748b;
      }
      .status--error {
        color: #b91c1c;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(262px, 262px));
        justify-content: center;
        gap: 1.1rem;
      }
      .card-wrap {
        display: grid;
        gap: 0.5rem;
        width: 262px;
      }
      .detail-link {
        border-radius: 10px;
        padding: 0.48rem;
        text-align: center;
        background: #ecfdf3;
        border: 1px solid #c7f2d6;
      }
      .detail-link:hover {
        background: #dff9ea;
      }
      @media (max-width: 720px) {
        .toolbar {
          align-items: start;
        }
        .filters {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPage implements OnInit {
  readonly catalog = inject(ProductCatalogFacade);
  private readonly cartStore = inject(CartStore);

  async ngOnInit(): Promise<void> {
    await this.catalog.load();
  }

  setQuery(value: string): void {
    this.catalog.setQuery(value);
  }

  setCategory(categoryId: string): void {
    this.catalog.setCategory(categoryId);
  }

  setSort(sort: ProductSort): void {
    this.catalog.setSort(sort);
  }

  addToCart(product: Product): void {
    this.cartStore.add(product);
  }
}

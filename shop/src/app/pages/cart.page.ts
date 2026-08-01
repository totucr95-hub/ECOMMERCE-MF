import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartStore, ProductService } from '@ecommerce-mf/shared-core';
import { Product } from '@ecommerce-mf/shared-models';
import { ProductsUiProductCard } from '@ecommerce-mf/products-ui-product-card';

@Component({
  selector: 'shop-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductsUiProductCard],
  template: `
    <section class="cart-page">
      <header class="cart-page__header">
        <h1>Carrito</h1>
        <a routerLink="/shop">Seguir comprando</a>
      </header>

      @if (store.items().length === 0) {
        <article class="empty-state">
          <h2>Tu carrito esta vacio</h2>
          <p>Agrega productos para ver el resumen de compra.</p>
          <a class="btn-primary" routerLink="/shop">Ir al catalogo</a>
        </article>
      } @else {
        <div class="cart-layout">
          <div class="cart-main">
            <div class="cart-table-head">
              <span>Producto</span>
              <span>Total</span>
            </div>

            <ul class="items">
              @for (item of store.items(); track item.product.id) {
                <li>
                  <div class="item-content">
                    <img
                      [src]="item.product.image"
                      [alt]="item.product.name"
                      class="item-image"
                    />
                    <div class="item-info">
                      <strong>{{ item.product.name }}</strong>
                      <small>
                        {{
                          item.product.price
                            | currency: 'USD' : 'symbol' : '1.2-2'
                        }}
                        c/u
                      </small>
                      <div class="controls">
                        <button
                          type="button"
                          aria-label="Disminuir cantidad"
                          (click)="
                            store.updateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          "
                        >
                          -
                        </button>
                        <span>{{ item.quantity }}</span>
                        <button
                          type="button"
                          aria-label="Aumentar cantidad"
                          (click)="
                            store.updateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          "
                        >
                          +
                        </button>
                        <button
                          type="button"
                          class="remove"
                          (click)="store.remove(item.product.id)"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="item-total">
                    {{
                      item.product.price * item.quantity
                        | currency: 'USD' : 'symbol' : '1.2-2'
                    }}
                  </div>
                </li>
              }
            </ul>
          </div>

          <aside class="summary">
            <h2>Totales del carrito</h2>
            <div class="line">
              <span>Subtotal</span>
              <strong>{{
                store.subtotal() | currency: 'USD' : 'symbol' : '1.2-2'
              }}</strong>
            </div>
            <div class="line">
              <span>Impuestos</span>
              <strong>{{
                store.taxes() | currency: 'USD' : 'symbol' : '1.2-2'
              }}</strong>
            </div>
            <div class="line">
              <span>Envio</span>
              <strong>{{
                shippingCost() | currency: 'USD' : 'symbol' : '1.2-2'
              }}</strong>
            </div>
            <div class="line line--total">
              <span>Total estimado</span>
              <strong>
                {{
                  store.total() + shippingCost()
                    | currency: 'USD' : 'symbol' : '1.2-2'
                }}
              </strong>
            </div>
            <a class="btn-primary" routerLink="/shop/checkout"
              >Finalizar compra</a
            >
          </aside>
        </div>
      }

      @if (suggestedProducts().length > 0) {
        <section class="suggested">
          <div class="suggested__head">
            <h2>Productos sugeridos</h2>
            <p>Complementa tu compra con estos destacados.</p>
          </div>

          <div class="suggested__grid">
            @for (product of suggestedProducts(); track product.id) {
              <div class="suggested__card">
                <lib-products-ui-product-card
                  [product]="product"
                  (buy)="addSuggestedToCart(product)"
                ></lib-products-ui-product-card>
                <a [routerLink]="['/shop/product', product.id]">Ver detalle</a>
              </div>
            }
          </div>
        </section>
      }
    </section>
  `,
  styles: [
    `
      .cart-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem 4rem;
        display: grid;
        gap: 1.5rem;
      }
      .cart-page__header {
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 1rem;
      }
      .cart-page__header h1 {
        margin: 0;
      }
      .cart-page__header a {
        text-decoration: none;
        color: #0d9d3e;
        font-weight: 700;
      }
      .cart-layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
        gap: 1.5rem;
        align-items: start;
      }
      .cart-main,
      .summary,
      .empty-state {
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        background: #fff;
      }
      .empty-state {
        padding: 1.2rem;
      }
      .empty-state h2 {
        margin: 0;
      }
      .empty-state p {
        margin: 0.4rem 0 1rem;
        color: #64748b;
      }
      .cart-table-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #e2e8f0;
        color: #1e3a5f;
        font-size: 0.85rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .items {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .items li {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem;
        border-bottom: 1px solid #edf2f7;
      }
      .items li:last-child {
        border-bottom: 0;
      }
      .item-content {
        display: grid;
        grid-template-columns: 82px minmax(0, 1fr);
        gap: 0.9rem;
        align-items: center;
        min-width: 0;
      }
      .item-image {
        width: 82px;
        height: 82px;
        object-fit: cover;
        border-radius: 10px;
        border: 1px solid #e2e8f0;
      }
      .item-info {
        display: grid;
        gap: 0.3rem;
      }
      .item-info strong {
        color: #0f172a;
      }
      .item-info small {
        color: #475569;
      }
      .controls {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        margin-top: 0.2rem;
      }
      .controls button {
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        padding: 0.3rem 0.55rem;
        background: #fff;
        color: #0f172a;
        cursor: pointer;
      }
      .controls span {
        min-width: 20px;
        text-align: center;
        font-weight: 700;
      }
      .controls .remove {
        margin-left: 0.35rem;
        color: #1e3a5f;
      }
      .item-total {
        font-weight: 700;
        color: #1e3a5f;
        white-space: nowrap;
      }
      .summary {
        padding: 1rem;
      }
      .summary h2 {
        margin: 0 0 0.9rem;
        color: #1e3a5f;
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.7rem 0;
        border-bottom: 1px solid #edf2f7;
      }
      .line--total {
        margin-top: 0.2rem;
        border-bottom: 0;
        font-size: 1.05rem;
      }
      .btn-primary {
        display: inline-flex;
        width: 100%;
        justify-content: center;
        text-decoration: none;
        margin-top: 0.8rem;
        border-radius: 10px;
        padding: 0.75rem 1rem;
        border: 1px solid #17bd55;
        background: #0d9d3e;
        color: #fff;
        font-weight: 800;
      }
      .btn-primary:hover {
        background: #0b8a36;
      }
      .suggested {
        display: grid;
        gap: 0.8rem;
      }
      .suggested__head h2 {
        margin: 0;
      }
      .suggested__head p {
        margin: 0.25rem 0 0;
        color: #64748b;
      }
      .suggested__grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(262px, 262px));
        justify-content: center;
        gap: 1rem;
      }
      .suggested__card {
        display: grid;
        gap: 0.45rem;
      }
      .suggested__card a {
        text-decoration: none;
        color: #0d9d3e;
        font-weight: 700;
        border-radius: 10px;
        padding: 0.48rem;
        text-align: center;
        background: #ecfdf3;
        border: 1px solid #c7f2d6;
      }
      .suggested__card a:hover {
        background: #dff9ea;
      }
      @media (max-width: 920px) {
        .cart-layout {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 640px) {
        .cart-page__header {
          align-items: start;
        }
        .items li {
          flex-direction: column;
        }
        .item-content {
          width: 100%;
        }
        .item-total {
          align-self: end;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPage implements OnInit {
  readonly store = inject(CartStore);
  private readonly productService = inject(ProductService);
  private readonly products = signal<ReadonlyArray<Product>>([]);

  readonly shippingCost = computed(() => (this.store.subtotal() > 0 ? 8 : 0));
  readonly suggestedProducts = computed(() => {
    const cartProductIds = new Set(
      this.store.items().map((item) => item.product.id),
    );

    return this.products()
      .filter((product) => !cartProductIds.has(product.id))
      .sort((left, right) => Number(right.featured) - Number(left.featured))
      .slice(0, 4);
  });

  async ngOnInit(): Promise<void> {
    this.products.set(await this.productService.getProducts());
  }

  addSuggestedToCart(product: Product): void {
    this.store.add(product);
  }
}

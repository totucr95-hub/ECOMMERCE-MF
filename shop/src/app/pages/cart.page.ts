import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartStore } from '@ecommerce-mf/shared-core';

@Component({
  selector: 'shop-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section>
      <h1>Carrito</h1>
      @if (store.items().length === 0) {
        <p>Tu carrito esta vacio.</p>
      } @else {
        <ul class="items">
          @for (item of store.items(); track item.product.id) {
            <li>
              <div>
                <strong>{{ item.product.name }}</strong>
                <p>{{ item.product.price | currency:'USD':'symbol':'1.2-2' }} x {{ item.quantity }}</p>
              </div>
              <div class="controls">
                <button (click)="store.updateQuantity(item.product.id, item.quantity - 1)">-</button>
                <button (click)="store.updateQuantity(item.product.id, item.quantity + 1)">+</button>
                <button (click)="store.remove(item.product.id)">Eliminar</button>
              </div>
            </li>
          }
        </ul>

        <div class="summary">
          <p>Subtotal: {{ store.subtotal() | currency:'USD':'symbol':'1.2-2' }}</p>
          <p>Impuestos: {{ store.taxes() | currency:'USD':'symbol':'1.2-2' }}</p>
          <p><strong>Total: {{ store.total() | currency:'USD':'symbol':'1.2-2' }}</strong></p>
          <a routerLink="/shop/checkout">Ir a checkout</a>
        </div>
      }
    </section>
  `,
  styles: [`.items{list-style:none;padding:0;display:grid;gap:.8rem}.items li{display:flex;justify-content:space-between;align-items:center;border:1px solid #e2e8f0;border-radius:12px;padding:.8rem;background:#fff}.controls{display:flex;gap:.5rem}.controls button{border:1px solid #cbd5e1;border-radius:8px;padding:.35rem .6rem;background:#fff}.summary{margin-top:1rem;border:1px solid #e2e8f0;border-radius:12px;padding:1rem;background:#fff}a{display:inline-block;margin-top:.6rem;text-decoration:none;color:#0f766e;font-weight:700}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPage {
  readonly store = inject(CartStore);
}

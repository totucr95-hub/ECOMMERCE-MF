import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartStore, NotificationService, PaymentService } from '@ecommerce-mf/shared-core';

@Component({
  selector: 'shop-checkout-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="checkout">
      <h1>Checkout</h1>
      <div class="grid">
        <form (ngSubmit)="confirmPurchase()" #form="ngForm">
          <label>Nombre<input required name="name" ngModel /></label>
          <label>Email<input required name="email" ngModel /></label>
          <label>Direccion<input required name="address" ngModel /></label>
          <label>Metodo de pago
            <select required [(ngModel)]="paymentMethod" name="paymentMethod">
              <option value="card">Tarjeta</option>
              <option value="pse">PSE</option>
              <option value="cash">Efectivo</option>
            </select>
          </label>
          <button type="submit" [disabled]="store.items().length === 0">Confirmar compra</button>
        </form>

        <aside>
          <h2>Resumen</h2>
          <p>Subtotal: {{ store.subtotal() | currency:'USD':'symbol':'1.2-2' }}</p>
          <p>Impuestos: {{ store.taxes() | currency:'USD':'symbol':'1.2-2' }}</p>
          <p><strong>Total: {{ store.total() | currency:'USD':'symbol':'1.2-2' }}</strong></p>
        </aside>
      </div>
    </section>
  `,
  styles: [`.grid{display:grid;grid-template-columns:2fr 1fr;gap:1rem}form,aside{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:1rem}label{display:grid;gap:.4rem;margin-bottom:.75rem}input,select{padding:.55rem .7rem;border:1px solid #cbd5e1;border-radius:8px}button{border:0;background:#0f766e;color:white;border-radius:10px;padding:.6rem .9rem}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPage {
  readonly store = inject(CartStore);
  private readonly paymentService = inject(PaymentService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  readonly paymentMethod = signal<'card' | 'pse' | 'cash'>('card');

  async confirmPurchase(): Promise<void> {
    if (!this.store.items().length) {
      return;
    }

    await this.paymentService.pay(this.store.total(), this.paymentMethod());
    this.notifications.push('Compra confirmada correctamente');
    this.store.clear();
    void this.router.navigate(['/shop/order-completed']);
  }
}

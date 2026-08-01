import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  CartStore,
  NotificationService,
  PaymentService,
} from '@ecommerce-mf/shared-core';

type DeliveryMethod = 'shipping' | 'pickup';
type PaymentMethod = 'card' | 'pse' | 'cash';

@Component({
  selector: 'shop-checkout-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.page.html',
  styleUrl: './checkout.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPage {
  readonly store = inject(CartStore);
  private readonly paymentService = inject(PaymentService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);

  readonly isSubmitting = signal(false);

  deliveryMethod: DeliveryMethod = 'pickup';
  paymentMethod: PaymentMethod = 'pse';
  selectedBank = '';
  documentType = 'CC';
  billingCountry = 'Colombia';
  acceptedTerms = false;
  orderNote = '';
  couponCode = '';

  selectDeliveryMethod(method: DeliveryMethod): void {
    this.deliveryMethod = method;
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.paymentMethod = method;
  }

  shippingCost(): number {
    return this.deliveryMethod === 'shipping' && this.store.items().length > 0
      ? 8
      : 0;
  }

  orderTotal(): number {
    return this.store.total() + this.shippingCost();
  }

  async confirmPurchase(form: NgForm): Promise<void> {
    if (form.invalid || !this.acceptedTerms || !this.store.items().length) {
      form.control.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      await this.paymentService.pay(this.orderTotal(), this.paymentMethod);
      this.notifications.push('Compra confirmada correctamente');
      this.store.clear();
      await this.router.navigate(['/shop/order-completed']);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

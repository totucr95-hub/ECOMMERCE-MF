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
  StorageService,
} from '@ecommerce-mf/shared-core';
import {
  COMPLETED_ORDER_STORAGE_KEY,
  CompletedOrder,
} from '../order-completed/completed-order.model';

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
  private readonly storage = inject(StorageService);

  readonly isSubmitting = signal(false);

  deliveryMethod: DeliveryMethod = 'pickup';
  paymentMethod: PaymentMethod = 'pse';
  contactEmail = '';
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
      const payment = await this.paymentService.pay(
        this.orderTotal(),
        this.paymentMethod,
      );
      const completedOrder: CompletedOrder = {
        orderNumber: `PED-${Date.now().toString().slice(-8)}`,
        transactionReference: payment.transactionRef,
        createdAt: new Date().toISOString(),
        contactEmail: this.contactEmail,
        deliveryMethod: this.deliveryMethod,
        paymentMethod: this.paymentMethod,
        items: this.store.items().map((item) => ({
          product: { ...item.product },
          quantity: item.quantity,
        })),
        subtotal: this.store.subtotal(),
        taxes: this.store.taxes(),
        shipping: this.shippingCost(),
        total: this.orderTotal(),
      };

      this.storage.set(COMPLETED_ORDER_STORAGE_KEY, completedOrder);
      this.notifications.push('Compra confirmada correctamente');
      this.store.clear();
      await this.router.navigate(['/shop/order-completed']);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

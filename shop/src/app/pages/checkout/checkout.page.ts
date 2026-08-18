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
  CheckoutService,
  NotificationService,
  StorageService,
} from '@ecommerce-mf/shared-core';
import {
  COMPLETED_ORDER_STORAGE_KEY,
  CompletedOrder,
} from '../order-completed/completed-order.model';

type DeliveryMethod = 'shipping' | 'pickup';
type PaymentMethod = 'card' | 'pse' | 'cash';
type SimulatedPaymentOutcome = 'approved' | 'rejected';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.page.html',
  styleUrl: './checkout.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPage {
  readonly store = inject(CartStore);
  private readonly checkoutService = inject(CheckoutService);
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
  simulatedPaymentOutcome: SimulatedPaymentOutcome = 'approved';
  acceptedTerms = false;
  orderNote = '';

  selectDeliveryMethod(method: DeliveryMethod): void {
    this.deliveryMethod = method;
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.paymentMethod = method;
  }

  shippingCost(): number {
    return this.deliveryMethod === 'shipping' && this.store.items().length > 0
      ? 35000
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
      const formValue = form.value as {
        firstName?: string;
        lastName?: string;
        address?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        phone?: string;
        personType?: string;
        documentNumber?: string;
      };

      const cartSnapshot = this.store.items().map((item) => ({
        product: { ...item.product },
        quantity: item.quantity,
      }));

      const createdSession = await this.checkoutService.createSession({
        contactEmail: this.contactEmail,
        deliveryMethod: this.deliveryMethod,
        paymentMethod: this.paymentMethod,
        firstName: formValue.firstName?.trim() ?? '',
        lastName: formValue.lastName?.trim() ?? '',
        billingCountry: this.billingCountry,
        city: formValue.city?.trim() ?? '',
        state: formValue.state?.trim() ?? '',
        addressLine: formValue.address?.trim() ?? '',
        postalCode: formValue.postalCode?.trim() ?? '',
        phone: formValue.phone?.trim() ?? '',
        documentType: this.documentType,
        documentNumber: formValue.documentNumber?.trim() ?? '',
        personType: formValue.personType?.trim() ?? 'individual',
        selectedBank: this.selectedBank,
        orderNote: this.orderNote,
        acceptedTerms: this.acceptedTerms,
        items: cartSnapshot.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      const confirmed = await this.checkoutService.confirmSession(
        createdSession.id,
      );
      let finalized = confirmed;

      if (
        this.paymentMethod !== 'cash' &&
        confirmed.paymentStatus !== 'approved'
      ) {
        const webhookResult = await this.checkoutService.simulatePaymentResult({
          orderNumber: confirmed.orderNumber,
          status: this.simulatedPaymentOutcome,
          eventName: 'checkout.simulated-from-ui',
        });

        if (webhookResult.paymentStatus === 'rejected') {
          this.notifications.push(
            'Pago rechazado por simulacion. Puedes ajustar datos e intentar de nuevo.',
          );
          return;
        }

        finalized = await this.checkoutService.getOrderByReference(
          confirmed.orderNumber,
        );
      }

      const completedOrder: CompletedOrder = {
        orderNumber: finalized.orderNumber,
        orderStatus: finalized.orderStatus,
        paymentStatus: finalized.paymentStatus,
        transactionReference: finalized.transactionReference,
        createdAt: finalized.createdAt,
        contactEmail: finalized.contactEmail,
        deliveryMethod: finalized.deliveryMethod,
        paymentMethod: finalized.paymentMethod,
        items: cartSnapshot,
        subtotal: finalized.subtotal,
        taxes: finalized.taxes,
        shipping: finalized.shipping,
        total: finalized.total,
      };

      this.storage.set(COMPLETED_ORDER_STORAGE_KEY, completedOrder);
      this.notifications.push('Compra confirmada correctamente');
      this.store.clear();
      await this.router.navigate(['/shop/order-completed'], {
        queryParams: { reference: completedOrder.orderNumber },
      });
    } catch {
      this.notifications.push(
        'No se pudo finalizar la compra. Intenta nuevamente.',
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

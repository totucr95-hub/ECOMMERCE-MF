import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StorageService } from '@ecommerce-mf/shared-core';
import {
  COMPLETED_ORDER_STORAGE_KEY,
  CompletedOrder,
} from './completed-order.model';

@Component({
  selector: 'shop-order-completed-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-completed.page.html',
  styleUrl: './order-completed.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCompletedPage {
  private readonly storage = inject(StorageService);

  readonly order = signal(
    this.storage.get<CompletedOrder | null>(COMPLETED_ORDER_STORAGE_KEY, null),
  );

  itemCount(order: CompletedOrder): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }

  deliveryLabel(method: CompletedOrder['deliveryMethod']): string {
    return method === 'pickup' ? 'Recogida en tienda' : 'Envío a domicilio';
  }

  paymentLabel(method: CompletedOrder['paymentMethod']): string {
    switch (method) {
      case 'card':
        return 'Tarjeta de crédito o débito';
      case 'cash':
        return 'Pago contra entrega';
      case 'pse':
      default:
        return 'PSE';
    }
  }
}

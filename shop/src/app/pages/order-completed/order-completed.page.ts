import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '@ecommerce-mf/shared-models';
import {
  CheckoutConfirmResult,
  CheckoutService,
  StorageService,
} from '@ecommerce-mf/shared-core';
import {
  COMPLETED_ORDER_STORAGE_KEY,
  CompletedOrder,
} from './completed-order.model';

@Component({
  selector: 'app-order-completed-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-completed.page.html',
  styleUrl: './order-completed.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCompletedPage implements OnInit {
  private readonly storage = inject(StorageService);
  private readonly route = inject(ActivatedRoute);
  private readonly checkout = inject(CheckoutService);

  readonly order = signal(
    this.storage.get<CompletedOrder | null>(COMPLETED_ORDER_STORAGE_KEY, null),
  );

  async ngOnInit(): Promise<void> {
    if (this.order()) {
      return;
    }

    const reference = this.route.snapshot.queryParamMap
      .get('reference')
      ?.trim();
    if (!reference) {
      return;
    }

    try {
      const backendOrder = await this.checkout.getOrderByReference(reference);
      const mapped = this.toCompletedOrder(backendOrder);
      this.order.set(mapped);
      this.storage.set(COMPLETED_ORDER_STORAGE_KEY, mapped);
    } catch {
      // Si falla la consulta, se conserva el estado vacio y la UI muestra fallback.
    }
  }

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

  private toCompletedOrder(order: CheckoutConfirmResult): CompletedOrder {
    return {
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      transactionReference: order.transactionReference,
      createdAt: order.createdAt,
      contactEmail: order.contactEmail,
      deliveryMethod: order.deliveryMethod,
      paymentMethod: order.paymentMethod,
      items: order.items.map((item) => ({
        product: this.toProduct(
          item.productId,
          item.productName,
          item.productImage,
          item.unitPrice,
        ),
        quantity: item.quantity,
      })),
      subtotal: order.subtotal,
      taxes: order.taxes,
      shipping: order.shipping,
      total: order.total,
    };
  }

  private toProduct(
    id: string,
    name: string,
    image: string,
    price: number,
  ): Product {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return {
      id,
      name,
      slug: slug || id,
      description: 'Producto del pedido',
      image,
      price,
      stock: 0,
      featured: false,
      categoryId: 'unknown',
      rating: 0,
    };
  }
}

import { Injectable } from '@angular/core';
import { OrderFormData } from '../../domain/order.models';
import { OrderSummary } from '../../domain/entities/order-summary.entity';
import { OrdersRepository } from '../../domain/repositories/orders.repository';

@Injectable()
export class OrdersInMemoryRepository implements OrdersRepository {
  private ordersCache: OrderSummary[] = [
    {
      id: 'ord-1042',
      orderNumber: 'ORD-1042',
      customer: 'Maria Gomez',
      total: 480000,
      status: 'Pagado',
      paymentMethod: 'Tarjeta',
      shippingAddress: 'Calle 98 #15-42, Bogota',
      notes: 'Entregar en porteria.',
      createdAt: '2026-07-28',
    },
    {
      id: 'ord-1043',
      orderNumber: 'ORD-1043',
      customer: 'Diego Ruiz',
      total: 220000,
      status: 'Pendiente',
      paymentMethod: 'PSE',
      shippingAddress: 'Carrera 40 #10-15, Medellin',
      notes: 'Cliente solicita llamada previa.',
      createdAt: '2026-07-29',
    },
    {
      id: 'ord-1044',
      orderNumber: 'ORD-1044',
      customer: 'Juliana Mora',
      total: 94000,
      status: 'Despachado',
      paymentMethod: 'Transferencia',
      shippingAddress: 'Calle 5 #72-11, Cali',
      notes: 'Paquete fragil.',
      createdAt: '2026-07-30',
    },
    {
      id: 'ord-1045',
      orderNumber: 'ORD-1045',
      customer: 'Camilo Rojas',
      total: 1280000,
      status: 'Pagado',
      paymentMethod: 'Tarjeta',
      shippingAddress: 'Avenida 68 #24-30, Bogota',
      notes: 'Facturar a empresa.',
      createdAt: '2026-07-31',
    },
  ];

  async findSummaries(): Promise<ReadonlyArray<OrderSummary>> {
    await this.simulateEndpointLatency();
    return [...this.ordersCache];
  }

  async findById(id: string): Promise<OrderSummary | null> {
    await this.simulateEndpointLatency();
    const order = this.ordersCache.find((item) => item.id === id);
    return order ? { ...order } : null;
  }

  async create(payload: OrderFormData): Promise<OrderSummary> {
    await this.simulateEndpointLatency();

    const order: OrderSummary = {
      id: payload.id ?? this.createOrderId(),
      orderNumber: payload.orderNumber,
      customer: payload.customer,
      total: payload.total,
      status: payload.status,
      paymentMethod: payload.paymentMethod,
      shippingAddress: payload.shippingAddress,
      notes: payload.notes,
      createdAt: payload.createdAt,
    };

    this.ordersCache = [order, ...this.ordersCache];
    return { ...order };
  }

  async update(
    id: string,
    payload: OrderFormData,
  ): Promise<OrderSummary | null> {
    await this.simulateEndpointLatency();

    const index = this.ordersCache.findIndex((item) => item.id === id);
    if (index < 0) {
      return null;
    }

    const updated: OrderSummary = {
      id,
      orderNumber: payload.orderNumber,
      customer: payload.customer,
      total: payload.total,
      status: payload.status,
      paymentMethod: payload.paymentMethod,
      shippingAddress: payload.shippingAddress,
      notes: payload.notes,
      createdAt: payload.createdAt,
    };

    this.ordersCache = [
      ...this.ordersCache.slice(0, index),
      updated,
      ...this.ordersCache.slice(index + 1),
    ];

    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    await this.simulateEndpointLatency();

    const before = this.ordersCache.length;
    this.ordersCache = this.ordersCache.filter((item) => item.id !== id);
    return this.ordersCache.length < before;
  }

  private createOrderId(): string {
    return `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  private async simulateEndpointLatency(): Promise<void> {
    const delayMs = 240 + Math.floor(Math.random() * 380);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}

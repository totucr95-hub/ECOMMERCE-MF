import { Injectable } from '@angular/core';
import { OrderFormData } from '../../domain/order.models';
import { OrderSummary } from '../../domain/entities/order-summary.entity';
import { OrdersRepository } from '../../domain/repositories/orders.repository';

@Injectable()
export class OrdersInMemoryRepository implements OrdersRepository {
  private ordersCache: OrderSummary[] = this.buildInitialOrders();

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

  private buildInitialOrders(): OrderSummary[] {
    const customers = [
      'Maria Gomez',
      'Diego Ruiz',
      'Juliana Mora',
      'Camilo Rojas',
      'Ana Torres',
      'Laura Perez',
      'Pablo Cruz',
      'Sofia Lemos',
    ];
    const statuses = ['Pendiente', 'Pagado', 'Despachado', 'Entregado', 'Cancelado'];
    const methods = ['Tarjeta', 'PSE', 'Transferencia', 'Contraentrega'];
    const cities = ['Bogota', 'Medellin', 'Cali', 'Barranquilla', 'Bucaramanga'];

    return Array.from({ length: 100 }, (_unused, index) => {
      const item = index + 1;
      const city = cities[index % cities.length];

      return {
        id: `ord-${1000 + item}`,
        orderNumber: `ORD-${1000 + item}`,
        customer: customers[index % customers.length],
        total: 70000 + item * 21000,
        status: statuses[index % statuses.length],
        paymentMethod: methods[index % methods.length],
        shippingAddress: `Calle ${10 + (item % 80)} #${5 + (item % 70)}-${10 + (item % 40)}, ${city}`,
        notes: `Pedido masivo de prueba #${item}.`,
        createdAt: this.formatDate(index % 31),
      };
    });
  }

  private formatDate(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().slice(0, 10);
  }
}

import { Injectable } from '@angular/core';
import { PaymentFormData } from '../../domain/payment.models';
import { PaymentSummary } from '../../domain/entities/payment-summary.entity';
import { PaymentsRepository } from '../../domain/repositories/payments.repository';

@Injectable()
export class PaymentsInMemoryRepository implements PaymentsRepository {
  private paymentsCache: PaymentSummary[] = this.buildInitialPayments();

  async findSummaries(): Promise<ReadonlyArray<PaymentSummary>> {
    await this.simulateEndpointLatency();
    return [...this.paymentsCache];
  }

  async findById(id: string): Promise<PaymentSummary | null> {
    await this.simulateEndpointLatency();
    const payment = this.paymentsCache.find((item) => item.id === id);
    return payment ? { ...payment } : null;
  }

  async create(payload: PaymentFormData): Promise<PaymentSummary> {
    await this.simulateEndpointLatency();

    const payment: PaymentSummary = {
      id: payload.id ?? this.createPaymentId(),
      paymentRef: payload.paymentRef,
      orderNumber: payload.orderNumber,
      customer: payload.customer,
      method: payload.method,
      status: payload.status,
      amount: payload.amount,
      currency: payload.currency,
      gateway: payload.gateway,
      lastAttemptAt: payload.lastAttemptAt,
      notes: payload.notes,
    };

    this.paymentsCache = [payment, ...this.paymentsCache];
    return { ...payment };
  }

  async update(
    id: string,
    payload: PaymentFormData,
  ): Promise<PaymentSummary | null> {
    await this.simulateEndpointLatency();

    const index = this.paymentsCache.findIndex((item) => item.id === id);
    if (index < 0) {
      return null;
    }

    const updated: PaymentSummary = {
      id,
      paymentRef: payload.paymentRef,
      orderNumber: payload.orderNumber,
      customer: payload.customer,
      method: payload.method,
      status: payload.status,
      amount: payload.amount,
      currency: payload.currency,
      gateway: payload.gateway,
      lastAttemptAt: payload.lastAttemptAt,
      notes: payload.notes,
    };

    this.paymentsCache = [
      ...this.paymentsCache.slice(0, index),
      updated,
      ...this.paymentsCache.slice(index + 1),
    ];

    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    await this.simulateEndpointLatency();

    const before = this.paymentsCache.length;
    this.paymentsCache = this.paymentsCache.filter((item) => item.id !== id);
    return this.paymentsCache.length < before;
  }

  private createPaymentId(): string {
    return `pay-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  private async simulateEndpointLatency(): Promise<void> {
    const delayMs = 250 + Math.floor(Math.random() * 420);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  private buildInitialPayments(): PaymentSummary[] {
    const customers = [
      'Camilo Rojas',
      'Laura Perez',
      'Pablo Cruz',
      'Ana Torres',
      'Maria Gomez',
      'Diego Ruiz',
      'Juliana Mora',
      'Sofia Lemos',
    ];
    const methods = ['Tarjeta', 'PSE', 'Transferencia', 'Contraentrega'];
    const statuses = [
      'Pendiente',
      'Aprobado',
      'Rechazado',
      'Conciliado',
      'Reembolsado',
    ];
    const gateways = ['Wompi', 'PayU', 'MercadoPago', 'Bancolombia'];
    const currencies = ['COP'];

    return Array.from({ length: 100 }, (_unused, index) => {
      const item = index + 1;
      const amount = 95000 + item * 28750;

      return {
        id: `pay-${2000 + item}`,
        paymentRef: `TXN-${770000 + item}`,
        orderNumber: `ORD-${1000 + item}`,
        customer: customers[index % customers.length],
        method: methods[index % methods.length],
        status: statuses[index % statuses.length],
        amount,
        currency: currencies[index % currencies.length],
        gateway: gateways[index % gateways.length],
        lastAttemptAt: this.formatDate(index % 31),
        notes: `Intento de cobro simulado #${item}.`,
      };
    });
  }

  private formatDate(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().slice(0, 10);
  }
}

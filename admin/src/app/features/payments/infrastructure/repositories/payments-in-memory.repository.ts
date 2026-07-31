import { Injectable } from '@angular/core';
import { PaymentFormData } from '../../domain/payment.models';
import { PaymentSummary } from '../../domain/entities/payment-summary.entity';
import { PaymentsRepository } from '../../domain/repositories/payments.repository';

@Injectable()
export class PaymentsInMemoryRepository implements PaymentsRepository {
  private paymentsCache: PaymentSummary[] = [
    {
      id: 'pay-2001',
      paymentRef: 'TXN-774901',
      orderNumber: 'ORD-1045',
      customer: 'Camilo Rojas',
      method: 'Tarjeta',
      status: 'Aprobado',
      amount: 1280000,
      currency: 'COP',
      gateway: 'Wompi',
      lastAttemptAt: '2026-07-31',
      notes: 'Cobro exitoso al primer intento.',
    },
    {
      id: 'pay-2002',
      paymentRef: 'TXN-774902',
      orderNumber: 'ORD-1046',
      customer: 'Laura Perez',
      method: 'PSE',
      status: 'Pendiente',
      amount: 360000,
      currency: 'COP',
      gateway: 'PayU',
      lastAttemptAt: '2026-07-31',
      notes: 'Validacion bancaria en progreso.',
    },
    {
      id: 'pay-2003',
      paymentRef: 'TXN-774903',
      orderNumber: 'ORD-1047',
      customer: 'Pablo Cruz',
      method: 'Tarjeta',
      status: 'Rechazado',
      amount: 189000,
      currency: 'COP',
      gateway: 'MercadoPago',
      lastAttemptAt: '2026-07-30',
      notes: 'Fondos insuficientes.',
    },
    {
      id: 'pay-2004',
      paymentRef: 'TXN-774904',
      orderNumber: 'ORD-1048',
      customer: 'Ana Torres',
      method: 'Transferencia',
      status: 'Conciliado',
      amount: 940000,
      currency: 'COP',
      gateway: 'Bancolombia',
      lastAttemptAt: '2026-07-29',
      notes: 'Comprobante verificado por finanzas.',
    },
  ];

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
}

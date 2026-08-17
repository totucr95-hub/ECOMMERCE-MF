import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appConfig } from '@ecommerce-mf/config';
import { firstValueFrom } from 'rxjs';
import { PaymentSummary } from '../../domain/entities/payment-summary.entity';
import { PaymentFormData } from '../../domain/payment.models';

interface AdminPaymentPayload {
  paymentRef: string;
  orderNumber: string;
  customer: string;
  method: string;
  status: string;
  amount: number;
  currency: string;
  gateway: string;
  lastAttemptAt: string;
  notes: string;
}

@Injectable({ providedIn: 'root' })
export class AdminPaymentsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = appConfig.apiBaseUrl.replace(/\/$/, '');

  async getPayments(): Promise<ReadonlyArray<PaymentSummary>> {
    try {
      return await firstValueFrom(
        this.http.get<PaymentSummary[]>(`${this.apiBaseUrl}/admin/payments`),
      );
    } catch {
      return [];
    }
  }

  async getPaymentById(id: string): Promise<PaymentSummary | null> {
    try {
      return await firstValueFrom(
        this.http.get<PaymentSummary>(
          `${this.apiBaseUrl}/admin/payments/${encodeURIComponent(id)}`,
        ),
      );
    } catch {
      return null;
    }
  }

  async createPayment(payload: PaymentFormData): Promise<PaymentSummary> {
    return firstValueFrom(
      this.http.post<PaymentSummary>(
        `${this.apiBaseUrl}/admin/payments`,
        this.toRequestPayload(payload),
      ),
    );
  }

  async updatePayment(
    id: string,
    payload: PaymentFormData,
  ): Promise<PaymentSummary | null> {
    try {
      return await firstValueFrom(
        this.http.put<PaymentSummary>(
          `${this.apiBaseUrl}/admin/payments/${encodeURIComponent(id)}`,
          this.toRequestPayload(payload),
        ),
      );
    } catch {
      return null;
    }
  }

  async deletePayment(id: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.delete<void>(
          `${this.apiBaseUrl}/admin/payments/${encodeURIComponent(id)}`,
        ),
      );
      return true;
    } catch {
      return false;
    }
  }

  private toRequestPayload(payload: PaymentFormData): AdminPaymentPayload {
    return {
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
  }
}

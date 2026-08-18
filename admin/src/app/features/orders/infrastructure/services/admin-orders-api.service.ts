import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appConfig } from '@ecommerce-mf/config';
import { firstValueFrom } from 'rxjs';
import { OrderSummary } from '../../domain/entities/order-summary.entity';
import { OrderFormData, OrderSupportSummary } from '../../domain/order.models';

interface AdminOrderPayload {
  orderNumber: string;
  customer: string;
  total: number;
  status: string;
  paymentMethod: string;
  shippingAddress: string;
  notes: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminOrdersApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = appConfig.apiBaseUrl.replace(/\/$/, '');

  async getOrders(): Promise<ReadonlyArray<OrderSummary>> {
    try {
      return await firstValueFrom(
        this.http.get<OrderSummary[]>(`${this.apiBaseUrl}/admin/orders`),
      );
    } catch {
      return [];
    }
  }

  async getOrderById(id: string): Promise<OrderSummary | null> {
    try {
      return await firstValueFrom(
        this.http.get<OrderSummary>(
          `${this.apiBaseUrl}/admin/orders/${encodeURIComponent(id)}`,
        ),
      );
    } catch {
      return null;
    }
  }

  async createOrder(payload: OrderFormData): Promise<OrderSummary> {
    return firstValueFrom(
      this.http.post<OrderSummary>(
        `${this.apiBaseUrl}/admin/orders`,
        this.toRequestPayload(payload),
      ),
    );
  }

  async updateOrder(
    id: string,
    payload: OrderFormData,
  ): Promise<OrderSummary | null> {
    try {
      return await firstValueFrom(
        this.http.put<OrderSummary>(
          `${this.apiBaseUrl}/admin/orders/${encodeURIComponent(id)}`,
          this.toRequestPayload(payload),
        ),
      );
    } catch {
      return null;
    }
  }

  async deleteOrder(id: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.delete<void>(
          `${this.apiBaseUrl}/admin/orders/${encodeURIComponent(id)}`,
        ),
      );
      return true;
    } catch {
      return false;
    }
  }

  async getOrderSupportSummaryByReference(
    reference: string,
  ): Promise<OrderSupportSummary | null> {
    try {
      return await firstValueFrom(
        this.http.get<OrderSupportSummary>(
          `${this.apiBaseUrl}/orders/by-reference/${encodeURIComponent(reference)}/summary`,
        ),
      );
    } catch {
      return null;
    }
  }

  private toRequestPayload(payload: OrderFormData): AdminOrderPayload {
    return {
      orderNumber: payload.orderNumber,
      customer: payload.customer,
      total: payload.total,
      status: payload.status,
      paymentMethod: payload.paymentMethod,
      shippingAddress: payload.shippingAddress,
      notes: payload.notes,
      createdAt: payload.createdAt,
    };
  }
}

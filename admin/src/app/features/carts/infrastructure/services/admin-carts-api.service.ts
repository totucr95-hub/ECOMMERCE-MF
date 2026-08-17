import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appConfig } from '@ecommerce-mf/config';
import { firstValueFrom } from 'rxjs';
import { CartSummary } from '../../domain/entities/cart-summary.entity';
import { CartFormData } from '../../domain/cart.models';

interface AdminCartPayload {
  cartCode: string;
  customer: string;
  itemsCount: number;
  subtotal: number;
  taxes: number;
  total: number;
  status: string;
  updatedAt: string;
  notes: string;
}

@Injectable({ providedIn: 'root' })
export class AdminCartsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = appConfig.apiBaseUrl.replace(/\/$/, '');

  async getCarts(): Promise<ReadonlyArray<CartSummary>> {
    try {
      return await firstValueFrom(
        this.http.get<CartSummary[]>(`${this.apiBaseUrl}/admin/carts`),
      );
    } catch {
      return [];
    }
  }

  async getCartById(id: string): Promise<CartSummary | null> {
    try {
      return await firstValueFrom(
        this.http.get<CartSummary>(
          `${this.apiBaseUrl}/admin/carts/${encodeURIComponent(id)}`,
        ),
      );
    } catch {
      return null;
    }
  }

  async createCart(payload: CartFormData): Promise<CartSummary> {
    return firstValueFrom(
      this.http.post<CartSummary>(
        `${this.apiBaseUrl}/admin/carts`,
        this.toRequestPayload(payload),
      ),
    );
  }

  async updateCart(
    id: string,
    payload: CartFormData,
  ): Promise<CartSummary | null> {
    try {
      return await firstValueFrom(
        this.http.put<CartSummary>(
          `${this.apiBaseUrl}/admin/carts/${encodeURIComponent(id)}`,
          this.toRequestPayload(payload),
        ),
      );
    } catch {
      return null;
    }
  }

  async deleteCart(id: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.delete<void>(
          `${this.apiBaseUrl}/admin/carts/${encodeURIComponent(id)}`,
        ),
      );
      return true;
    } catch {
      return false;
    }
  }

  private toRequestPayload(payload: CartFormData): AdminCartPayload {
    return {
      cartCode: payload.cartCode,
      customer: payload.customer,
      itemsCount: payload.itemsCount,
      subtotal: payload.subtotal,
      taxes: payload.taxes,
      total: payload.total,
      status: payload.status,
      updatedAt: payload.updatedAt,
      notes: payload.notes,
    };
  }
}

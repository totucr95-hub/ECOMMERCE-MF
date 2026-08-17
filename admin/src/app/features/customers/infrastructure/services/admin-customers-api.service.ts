import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appConfig } from '@ecommerce-mf/config';
import { firstValueFrom } from 'rxjs';
import { CustomerSummary } from '../../domain/entities/customer-summary.entity';
import { CustomerFormData } from '../../domain/customer.models';

interface AdminCustomerPayload {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  status: string;
  segment: string;
  notes: string;
  lastOrderAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminCustomersApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = appConfig.apiBaseUrl.replace(/\/$/, '');

  async getCustomers(): Promise<ReadonlyArray<CustomerSummary>> {
    try {
      return await firstValueFrom(
        this.http.get<CustomerSummary[]>(`${this.apiBaseUrl}/admin/customers`),
      );
    } catch {
      return [];
    }
  }

  async getCustomerById(id: string): Promise<CustomerSummary | null> {
    try {
      return await firstValueFrom(
        this.http.get<CustomerSummary>(
          `${this.apiBaseUrl}/admin/customers/${encodeURIComponent(id)}`,
        ),
      );
    } catch {
      return null;
    }
  }

  async createCustomer(payload: CustomerFormData): Promise<CustomerSummary> {
    return firstValueFrom(
      this.http.post<CustomerSummary>(
        `${this.apiBaseUrl}/admin/customers`,
        this.toRequestPayload(payload),
      ),
    );
  }

  async updateCustomer(
    id: string,
    payload: CustomerFormData,
  ): Promise<CustomerSummary | null> {
    try {
      return await firstValueFrom(
        this.http.put<CustomerSummary>(
          `${this.apiBaseUrl}/admin/customers/${encodeURIComponent(id)}`,
          this.toRequestPayload(payload),
        ),
      );
    } catch {
      return null;
    }
  }

  async deleteCustomer(id: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.delete<void>(
          `${this.apiBaseUrl}/admin/customers/${encodeURIComponent(id)}`,
        ),
      );
      return true;
    } catch {
      return false;
    }
  }

  private toRequestPayload(payload: CustomerFormData): AdminCustomerPayload {
    return {
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      city: payload.city,
      totalOrders: payload.totalOrders,
      totalSpent: payload.totalSpent,
      status: payload.status,
      segment: payload.segment,
      notes: payload.notes,
      lastOrderAt: payload.lastOrderAt,
    };
  }
}

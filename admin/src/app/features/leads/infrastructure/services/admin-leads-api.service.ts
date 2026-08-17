import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appConfig } from '@ecommerce-mf/config';
import { firstValueFrom } from 'rxjs';
import { LeadSummary } from '../../domain/entities/lead-summary.entity';
import { LeadFormData, LeadQueryFilters } from '../../domain/lead.models';

@Injectable({ providedIn: 'root' })
export class AdminLeadsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = appConfig.apiBaseUrl.replace(/\/$/, '');

  async getLeads(
    filters?: LeadQueryFilters,
  ): Promise<ReadonlyArray<LeadSummary>> {
    try {
      const params = this.buildQueryParams(filters);
      return await firstValueFrom(
        this.http.get<LeadSummary[]>(`${this.apiBaseUrl}/contact/leads`, {
          params,
        }),
      );
    } catch {
      return [];
    }
  }

  async exportLeadsCsv(filters?: LeadQueryFilters): Promise<Blob> {
    const params = this.buildQueryParams(filters);
    return firstValueFrom(
      this.http.get(`${this.apiBaseUrl}/contact/leads/export/csv`, {
        params,
        responseType: 'blob',
      }),
    );
  }

  async getLeadById(id: string): Promise<LeadSummary | null> {
    try {
      return await firstValueFrom(
        this.http.get<LeadSummary>(
          `${this.apiBaseUrl}/contact/leads/${encodeURIComponent(id)}`,
        ),
      );
    } catch {
      return null;
    }
  }

  async createLead(payload: LeadFormData): Promise<LeadSummary> {
    return firstValueFrom(
      this.http.post<LeadSummary>(`${this.apiBaseUrl}/contact/leads`, {
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        message: payload.message,
        status: payload.status,
        source: payload.source,
      }),
    );
  }

  async updateLead(
    id: string,
    payload: LeadFormData,
  ): Promise<LeadSummary | null> {
    try {
      return await firstValueFrom(
        this.http.put<LeadSummary>(
          `${this.apiBaseUrl}/contact/leads/${encodeURIComponent(id)}`,
          {
            fullName: payload.fullName,
            email: payload.email,
            phone: payload.phone,
            message: payload.message,
            status: payload.status,
            source: payload.source,
          },
        ),
      );
    } catch {
      return null;
    }
  }

  async updateLeadStatus(
    id: string,
    status: string,
  ): Promise<LeadSummary | null> {
    try {
      return await firstValueFrom(
        this.http.patch<LeadSummary>(
          `${this.apiBaseUrl}/contact/leads/${encodeURIComponent(id)}/status`,
          { status },
        ),
      );
    } catch {
      return null;
    }
  }

  async deleteLead(id: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.delete<void>(
          `${this.apiBaseUrl}/contact/leads/${encodeURIComponent(id)}`,
        ),
      );
      return true;
    } catch {
      return false;
    }
  }

  private buildQueryParams(filters?: LeadQueryFilters): HttpParams {
    let params = new HttpParams();

    if (filters?.status) {
      params = params.set('status', filters.status);
    }

    if (filters?.from) {
      params = params.set('from', filters.from);
    }

    if (filters?.to) {
      params = params.set('to', filters.to);
    }

    return params;
  }
}

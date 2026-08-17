import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appConfig } from '@ecommerce-mf/config';
import { firstValueFrom } from 'rxjs';
import { SettingSummary } from '../../domain/entities/setting-summary.entity';

@Injectable({ providedIn: 'root' })
export class AdminSettingsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = appConfig.apiBaseUrl.replace(/\/$/, '');

  async getSettings(): Promise<ReadonlyArray<SettingSummary>> {
    try {
      return await firstValueFrom(
        this.http.get<SettingSummary[]>(`${this.apiBaseUrl}/admin/settings`),
      );
    } catch {
      return [];
    }
  }
}

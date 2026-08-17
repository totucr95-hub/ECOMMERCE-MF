import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appConfig } from '@ecommerce-mf/config';
import { firstValueFrom } from 'rxjs';
import { UserSummary } from '../../domain/entities/user-summary.entity';
import { UsersRepository } from '../../domain/repositories/users.repository';

@Injectable()
export class UsersInMemoryRepository implements UsersRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = appConfig.apiBaseUrl.replace(/\/$/, '');

  async findSummaries(): Promise<ReadonlyArray<UserSummary>> {
    return firstValueFrom(
      this.http.get<UserSummary[]>(`${this.apiBaseUrl}/admin/users`),
    );
  }

  async create(
    payload: Partial<UserSummary> & { password?: string },
  ): Promise<UserSummary | null> {
    try {
      return await firstValueFrom(
        this.http.post<UserSummary>(`${this.apiBaseUrl}/admin/users`, {
          username: payload.username ?? '',
          firstName: payload.firstName ?? '',
          lastName: payload.lastName ?? '',
          email: payload.email ?? '',
          password: payload.password ?? '',
          enabled: payload.enabled ?? true,
          emailVerified: payload.emailVerified ?? true,
          roles: payload.roles ?? [],
        }),
      );
    } catch {
      return null;
    }
  }

  async findById(id: string): Promise<UserSummary | null> {
    try {
      return await firstValueFrom(
        this.http.get<UserSummary>(
          `${this.apiBaseUrl}/admin/users/${encodeURIComponent(id)}`,
        ),
      );
    } catch {
      return null;
    }
  }

  async update(
    id: string,
    payload: Partial<UserSummary>,
  ): Promise<UserSummary | null> {
    try {
      return await firstValueFrom(
        this.http.put<UserSummary>(
          `${this.apiBaseUrl}/admin/users/${encodeURIComponent(id)}`,
          {
            username: payload.username ?? '',
            firstName: payload.firstName ?? '',
            lastName: payload.lastName ?? '',
            email: payload.email ?? '',
            enabled: payload.enabled ?? true,
            emailVerified: payload.emailVerified ?? false,
            roles: payload.roles ?? [],
          },
        ),
      );
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.delete<void>(
          `${this.apiBaseUrl}/admin/users/${encodeURIComponent(id)}`,
        ),
      );
      return true;
    } catch {
      return false;
    }
  }
}

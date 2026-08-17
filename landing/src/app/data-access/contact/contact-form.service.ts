import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { ContactFormPayload, ContactFormResponse } from '../../domain';

@Injectable({ providedIn: 'root' })
export class ContactFormService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = this.resolveApiBaseUrl();

  private resolveApiBaseUrl(): string {
    const configured = localStorage.getItem('api.baseUrl')?.trim();
    const fallback = 'http://localhost:5015/api';
    return (
      configured && configured.length > 0 ? configured : fallback
    ).replace(/\/$/, '');
  }

  submit(payload: ContactFormPayload): Observable<ContactFormResponse> {
    return this.http
      .post<ContactFormResponse>(`${this.apiBaseUrl}/contact/lead`, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const message =
            (error.error?.message as string | undefined) ??
            'No se pudo enviar el formulario. Intenta nuevamente.';

          return throwError(() => new Error(message));
        }),
      );
  }
}

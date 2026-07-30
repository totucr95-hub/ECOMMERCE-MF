import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { ContactFormPayload, ContactFormResponse, CONTACT_SIMULATION_RULES } from '../../domain';

@Injectable({ providedIn: 'root' })
export class ContactFormService {
  submit(payload: ContactFormPayload): Observable<ContactFormResponse> {
    return of(payload).pipe(
      delay(CONTACT_SIMULATION_RULES.delayMs),
      switchMap((request) => {
        if (request.website.trim()) {
          return throwError(() => new Error('Solicitud rechazada por validacion anti-spam.'));
        }

        if (!request.captchaToken.trim()) {
          return throwError(() => new Error('Debes validar el captcha antes de enviar.'));
        }

        if (request.message.toLowerCase().includes(CONTACT_SIMULATION_RULES.forcedErrorKeyword)) {
          return throwError(() => new Error('Error simulado del endpoint. Intenta de nuevo.'));
        }

        return of({
          ok: true,
          message: 'Mensaje enviado con exito (simulado). Te contactaremos pronto.',
        });
      })
    );
  }
}
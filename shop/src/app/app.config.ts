import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import {
  errorInterceptor,
  jwtInterceptor,
  loadingInterceptor,
} from '@ecommerce-mf/shared-core';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    // Los requests del shop tambien llevan bearer cuando el usuario esta autenticado.
    provideHttpClient(
      withInterceptors([jwtInterceptor, loadingInterceptor, errorInterceptor]),
    ),
  ],
};

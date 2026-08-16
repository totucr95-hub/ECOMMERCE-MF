import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  AuthStore,
  errorInterceptor,
  jwtInterceptor,
  loadingInterceptor,
} from '@ecommerce-mf/shared-core';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AuthStore],
      // Carga Keycloak antes de montar la app para que guards e interceptores tengan sesion lista.
      useFactory: (authStore: AuthStore) => () => authStore.init(),
    },
    provideRouter(appRoutes),
    provideAnimations(),
    // Los interceptores agregan el token, muestran carga y normalizan errores en cada request.
    provideHttpClient(
      withInterceptors([jwtInterceptor, loadingInterceptor, errorInterceptor]),
    ),
  ],
};

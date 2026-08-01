import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
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
      useFactory: (authStore: AuthStore) => () => authStore.init(),
    },
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
    provideHttpClient(
      withInterceptors([jwtInterceptor, loadingInterceptor, errorInterceptor]),
    ),
  ],
};

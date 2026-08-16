import {
  HttpContext,
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, finalize, from, switchMap, throwError } from 'rxjs';
import { appConfig } from '@ecommerce-mf/config';
import { AuthService, LoadingService, NotificationService } from './services';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.init();

  if (auth.isAuthenticated()) {
    return true;
  }

  void router.navigate(['/auth/login']);
  return false;
};

export const adminGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.init();

  if (auth.isAdmin()) {
    return true;
  }

  void router.navigate(['/403']);
  return false;
};

export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.init();

  if (!auth.isAuthenticated()) {
    return true;
  }

  void router.navigate(['/']);
  return false;
};

export const AuthGuard = authGuard;
export const AdminGuard = adminGuard;
export const GuestGuard = guestGuard;

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const auth = inject(AuthService);

  const isApiRequest =
    req.url.startsWith(appConfig.apiBaseUrl) || req.url.startsWith('/api/');
  if (!isApiRequest) {
    return next(req);
  }

  return from(auth.refreshToken()).pipe(
    switchMap((token) => {
      if (!token) {
        return next(req);
      }

      return next(
        req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );
    }),
  );
};

export const SKIP_GLOBAL_LOADER = new HttpContextToken<boolean>(() => false);

export const skipGlobalLoaderContext = (): HttpContext =>
  new HttpContext().set(SKIP_GLOBAL_LOADER, true);

export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  if (req.context.get(SKIP_GLOBAL_LOADER)) {
    return next(req);
  }

  const loading = inject(LoadingService);
  loading.start();

  return next(req).pipe(finalize(() => loading.stop()));
};

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const notifier = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      notifier.push(error.message || 'Unexpected error');
      return throwError(() => error);
    }),
  );
};

export const JwtInterceptor = jwtInterceptor;
export const LoadingInterceptor = loadingInterceptor;
export const ErrorInterceptor = errorInterceptor;

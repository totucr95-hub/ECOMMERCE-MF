import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, finalize, throwError } from 'rxjs';
import { AuthService, LoadingService, NotificationService } from './services';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  void router.navigate(['/auth/login']);
  return false;
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdmin()) {
    return true;
  }

  void router.navigate(['/403']);
  return false;
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return true;
  }

  void router.navigate(['/']);
  return false;
};

export const AuthGuard = authGuard;
export const AdminGuard = adminGuard;
export const GuestGuard = guestGuard;

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const token = localStorage.getItem('auth.token') ?? 'mock-token';
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};

export const loadingInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const loading = inject(LoadingService);
  loading.start();

  return next(req).pipe(finalize(() => loading.stop()));
};

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const notifier = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      notifier.push(error.message || 'Unexpected error');
      return throwError(() => error);
    })
  );
};

export const JwtInterceptor = jwtInterceptor;
export const LoadingInterceptor = loadingInterceptor;
export const ErrorInterceptor = errorInterceptor;

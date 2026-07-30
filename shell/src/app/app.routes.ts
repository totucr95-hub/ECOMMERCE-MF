import { Route } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime';
import { adminGuard, authGuard, guestGuard } from '@ecommerce-mf/shared-core';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => loadRemote<typeof import('auth/Routes')>('auth/Routes').then(m => m!.remoteRoutes)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => loadRemote<typeof import('admin/Routes')>('admin/Routes').then(m => m!.remoteRoutes)
  },
  {
    path: 'shop',
    loadChildren: () => loadRemote<typeof import('shop/Routes')>('shop/Routes').then(m => m!.remoteRoutes)
  },
  {
    path: 'landing',
    loadChildren: () => loadRemote<typeof import('landing/Routes')>('landing/Routes').then(m => m!.remoteRoutes)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'landing',
  },
  {
    path: '403',
    loadComponent: () => import('./pages/forbidden.page').then((m) => m.ForbiddenPage),
  },
  {
    path: '500',
    loadComponent: () => import('./pages/server-error.page').then((m) => m.ServerErrorPage),
  },
  {
    path: 'loading',
    loadComponent: () => import('./pages/loading.page').then((m) => m.LoadingPage),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found.page').then((m) => m.NotFoundPage),
  },
];

import { Route } from '@angular/router';
import { adminGuard, authGuard } from '@ecommerce-mf/shared-core';

export const appRoutes: Route[] = [
  {
    path: '',
    canActivate: [authGuard, adminGuard],
    loadChildren: () =>
      import('./remote-entry/entry.routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () =>
      import('./remote-entry/entry.routes').then((m) => m.remoteRoutes),
  },
];

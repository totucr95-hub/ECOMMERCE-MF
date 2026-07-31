import { Route } from '@angular/router';
import { AdminLayoutComponent } from './entry';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../pages/dashboard/dashboard.page').then(
            (m) => m.DashboardPage,
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('../pages/products/products.page').then(
            (m) => m.AdminProductsPage,
          ),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('../pages/categories/categories.page').then(
            (m) => m.CategoriesPage,
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('../pages/orders/orders.page').then((m) => m.OrdersPage),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('../pages/users/users.page').then((m) => m.UsersPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../pages/settings/settings.page').then((m) => m.SettingsPage),
      },
    ],
  },
];

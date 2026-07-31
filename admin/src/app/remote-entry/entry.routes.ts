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
          import(
            '../features/dashboard/pages/dashboard-page/dashboard.page'
          ).then((m) => m.DashboardPage),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('../features/products/pages/products-page/products.page').then(
            (m) => m.AdminProductsPage,
          ),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import(
            '../features/categories/pages/categories-page/categories.page'
          ).then((m) => m.CategoriesPage),
      },
      {
        path: 'carts',
        loadComponent: () =>
          import('../features/carts/pages/carts-page/carts.page').then(
            (m) => m.CartsPage,
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('../features/orders/pages/orders-page/orders.page').then(
            (m) => m.OrdersPage,
          ),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import(
            '../features/customers/pages/customers-page/customers.page'
          ).then((m) => m.CustomersPage),
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('../features/payments/pages/payments-page/payments.page').then(
            (m) => m.PaymentsPage,
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('../features/users/pages/users-page/users.page').then(
            (m) => m.UsersPage,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../features/settings/pages/settings-page/settings.page').then(
            (m) => m.SettingsPage,
          ),
      },
    ],
  },
];

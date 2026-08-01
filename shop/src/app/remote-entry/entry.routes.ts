import { Route } from '@angular/router';
import { provideProductDataAccess } from '@ecommerce-mf/products-data-access-products';
import { ProductCatalogFacade } from '@ecommerce-mf/products-feature-products';
import { RemoteEntry } from './entry';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntry,
    providers: [provideProductDataAccess(), ProductCatalogFacade],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../pages/products/products.page').then((m) => m.ProductsPage),
      },
      {
        path: 'product/:id',
        loadComponent: () =>
          import('../pages/product-detail/product-detail.page').then(
            (m) => m.ProductDetailPage,
          ),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('../pages/cart/cart.page').then((m) => m.CartPage),
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('../pages/checkout/checkout.page').then((m) => m.CheckoutPage),
      },
      {
        path: 'order-completed',
        loadComponent: () =>
          import('../pages/order-completed/order-completed.page').then(
            (m) => m.OrderCompletedPage,
          ),
      },
    ],
  },
];

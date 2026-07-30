import { Route } from '@angular/router';
import { RemoteEntry } from './entry';

export const remoteRoutes: Route[] = [
	{
		path: '',
		component: RemoteEntry,
		children: [
			{
				path: '',
				loadComponent: () => import('../pages/products.page').then((m) => m.ProductsPage),
			},
			{
				path: 'product/:id',
				loadComponent: () => import('../pages/product-detail.page').then((m) => m.ProductDetailPage),
			},
			{
				path: 'cart',
				loadComponent: () => import('../pages/cart.page').then((m) => m.CartPage),
			},
			{
				path: 'checkout',
				loadComponent: () => import('../pages/checkout.page').then((m) => m.CheckoutPage),
			},
			{
				path: 'order-completed',
				loadComponent: () => import('../pages/order-completed.page').then((m) => m.OrderCompletedPage),
			},
		],
	},
];
import { Route } from '@angular/router';
import { RemoteEntry } from './entry';

export const remoteRoutes: Route[] = [
	{
		path: '',
		component: RemoteEntry,
		children: [
			{
				path: '',
				loadComponent: () => import('../pages/dashboard.page').then((m) => m.DashboardPage),
			},
			{
				path: 'products',
				loadComponent: () => import('../pages/products.page').then((m) => m.AdminProductsPage),
			},
			{
				path: 'categories',
				loadComponent: () => import('../pages/categories.page').then((m) => m.CategoriesPage),
			},
			{
				path: 'orders',
				loadComponent: () => import('../pages/orders.page').then((m) => m.OrdersPage),
			},
			{
				path: 'users',
				loadComponent: () => import('../pages/users.page').then((m) => m.UsersPage),
			},
			{
				path: 'settings',
				loadComponent: () => import('../pages/settings.page').then((m) => m.SettingsPage),
			},
		],
	},
];
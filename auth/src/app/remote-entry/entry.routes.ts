import { Route } from '@angular/router';
import { RemoteEntry } from './entry';

export const remoteRoutes: Route[] = [
	{
		path: '',
		component: RemoteEntry,
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'login',
			},
			{
				path: 'login',
				loadComponent: () => import('../pages/login.page').then((m) => m.LoginPage),
			},
			{
				path: 'register',
				loadComponent: () => import('../pages/register.page').then((m) => m.RegisterPage),
			},
			{
				path: 'forgot-password',
				loadComponent: () => import('../pages/forgot-password.page').then((m) => m.ForgotPasswordPage),
			},
		],
	},
];
export interface AdminNavigationItem {
  label: string;
  path: string;
  icon: string;
  exact?: boolean;
}

export interface AdminQuickStat {
  label: string;
  value: string;
}

export const ADMIN_NAVIGATION_ITEMS: AdminNavigationItem[] = [
  { label: 'Dashboard', path: '/admin', exact: true, icon: '⌂' },
  { label: 'Productos', path: '/admin/products', icon: '▦' },
  { label: 'Categorias', path: '/admin/categories', icon: '◫' },
  { label: 'Carritos', path: '/admin/carts', icon: '◎' },
  { label: 'Marcas', path: '/admin/brands', icon: '◈' },
  { label: 'Pedidos', path: '/admin/orders', icon: '◔' },
  { label: 'Clientes', path: '/admin/customers', icon: '◍' },
  { label: 'Pagos', path: '/admin/payments', icon: '◌' },
  { label: 'Reportes', path: '/admin/reports', icon: '◍' },
  { label: 'Usuarios', path: '/admin/users', icon: '◉' },
  { label: 'Configuracion', path: '/admin/settings', icon: '⚙' },
];

export const ADMIN_QUICK_STATS: AdminQuickStat[] = [
  { label: 'Ventas', value: '$24.8k' },
  { label: 'Pedidos', value: '1,248' },
  { label: 'Activos', value: '98%' },
];

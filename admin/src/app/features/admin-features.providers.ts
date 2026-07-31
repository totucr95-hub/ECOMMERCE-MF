import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideAdminProductsFeature } from './products/product-feature.providers';
import { provideAdminDashboardFeature } from './dashboard/dashboard-feature.providers';
import { provideAdminCategoriesFeature } from './categories/categories-feature.providers';
import { provideAdminCartsFeature } from './carts/carts-feature.providers';
import { provideAdminCustomersFeature } from './customers/customers-feature.providers';
import { provideAdminOrdersFeature } from './orders/orders-feature.providers';
import { provideAdminPaymentsFeature } from './payments/payments-feature.providers';
import { provideAdminUsersFeature } from './users/users-feature.providers';
import { provideAdminSettingsFeature } from './settings/settings-feature.providers';

export const provideAdminFeatures = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideAdminProductsFeature(),
    provideAdminDashboardFeature(),
    provideAdminCategoriesFeature(),
    provideAdminCartsFeature(),
    provideAdminCustomersFeature(),
    provideAdminOrdersFeature(),
    provideAdminPaymentsFeature(),
    provideAdminUsersFeature(),
    provideAdminSettingsFeature(),
  ]);
};

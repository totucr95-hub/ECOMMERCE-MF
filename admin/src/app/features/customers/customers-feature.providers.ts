import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AdminCustomersFacade } from './application/facades/admin-customers.facade';
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use-case';
import { DeleteCustomerUseCase } from './application/use-cases/delete-customer.use-case';
import { GetCustomerByIdUseCase } from './application/use-cases/get-customer-by-id.use-case';
import { GetCustomersSummaryUseCase } from './application/use-cases/get-customers-summary.use-case';
import { UpdateCustomerUseCase } from './application/use-cases/update-customer.use-case';
import { CustomersRepository } from './domain/repositories/customers.repository';
import { CustomersInMemoryRepository } from './infrastructure/repositories/customers-in-memory.repository';

export const provideAdminCustomersFeature = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    AdminCustomersFacade,
    CreateCustomerUseCase,
    DeleteCustomerUseCase,
    GetCustomerByIdUseCase,
    GetCustomersSummaryUseCase,
    UpdateCustomerUseCase,
    {
      provide: CustomersRepository,
      useClass: CustomersInMemoryRepository,
    },
  ]);
};

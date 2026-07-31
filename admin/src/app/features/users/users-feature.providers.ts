import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AdminUsersFacade } from './application/facades/admin-users.facade';
import { GetUsersSummaryUseCase } from './application/use-cases/get-users-summary.use-case';
import { UsersRepository } from './domain/repositories/users.repository';
import { UsersInMemoryRepository } from './infrastructure/repositories/users-in-memory.repository';

export const provideAdminUsersFeature = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    AdminUsersFacade,
    GetUsersSummaryUseCase,
    {
      provide: UsersRepository,
      useClass: UsersInMemoryRepository,
    },
  ]);
};

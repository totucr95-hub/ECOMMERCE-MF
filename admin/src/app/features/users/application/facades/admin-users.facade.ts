import { Injectable, inject } from '@angular/core';
import { GetUsersSummaryUseCase } from '../use-cases/get-users-summary.use-case';
import { UserSummary } from '../../domain/entities/user-summary.entity';
import { UsersRepository } from '../../domain/repositories/users.repository';

@Injectable()
export class AdminUsersFacade {
  private readonly getUsersSummaryUseCase = inject(GetUsersSummaryUseCase);
  private readonly usersRepository = inject(UsersRepository);

  loadSummaries(): Promise<ReadonlyArray<UserSummary>> {
    return this.getUsersSummaryUseCase.execute();
  }

  createUser(
    payload: Partial<UserSummary> & { password?: string },
  ): Promise<UserSummary | null> {
    return this.usersRepository.create(payload);
  }

  readUser(id: string): Promise<UserSummary | null> {
    return this.usersRepository.findById(id);
  }

  updateUser(
    id: string,
    payload: Partial<UserSummary>,
  ): Promise<UserSummary | null> {
    return this.usersRepository.update(id, payload);
  }

  deleteUser(id: string): Promise<boolean> {
    return this.usersRepository.delete(id);
  }
}

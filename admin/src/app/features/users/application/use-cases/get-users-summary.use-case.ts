import { Injectable, inject } from '@angular/core';
import { UserSummary } from '../../domain/entities/user-summary.entity';
import { UsersRepository } from '../../domain/repositories/users.repository';

@Injectable()
export class GetUsersSummaryUseCase {
  private readonly repository = inject(UsersRepository);

  execute(): Promise<ReadonlyArray<UserSummary>> {
    return this.repository.findSummaries();
  }
}

import { Injectable, inject } from '@angular/core';
import { GetUsersSummaryUseCase } from '../use-cases/get-users-summary.use-case';
import { UserSummary } from '../../domain/entities/user-summary.entity';

@Injectable()
export class AdminUsersFacade {
  private readonly getUsersSummaryUseCase = inject(GetUsersSummaryUseCase);

  loadSummaries(): Promise<ReadonlyArray<UserSummary>> {
    return this.getUsersSummaryUseCase.execute();
  }
}

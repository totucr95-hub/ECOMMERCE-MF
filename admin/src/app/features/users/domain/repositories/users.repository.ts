import { UserSummary } from '../entities/user-summary.entity';

export abstract class UsersRepository {
  abstract findSummaries(): Promise<ReadonlyArray<UserSummary>>;
}

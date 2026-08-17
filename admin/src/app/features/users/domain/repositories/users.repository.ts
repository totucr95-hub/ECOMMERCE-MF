import { UserSummary } from '../entities/user-summary.entity';

export abstract class UsersRepository {
  abstract findSummaries(): Promise<ReadonlyArray<UserSummary>>;
  abstract create(
    payload: Partial<UserSummary> & { password?: string },
  ): Promise<UserSummary | null>;
  abstract findById(id: string): Promise<UserSummary | null>;
  abstract update(
    id: string,
    payload: Partial<UserSummary>,
  ): Promise<UserSummary | null>;
  abstract delete(id: string): Promise<boolean>;
}

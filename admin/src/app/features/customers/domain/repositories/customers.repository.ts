import { CustomerFormData } from '../customer.models';
import { CustomerSummary } from '../entities/customer-summary.entity';

export abstract class CustomersRepository {
  abstract findSummaries(): Promise<ReadonlyArray<CustomerSummary>>;
  abstract findById(id: string): Promise<CustomerSummary | null>;
  abstract create(payload: CustomerFormData): Promise<CustomerSummary>;
  abstract update(
    id: string,
    payload: CustomerFormData,
  ): Promise<CustomerSummary | null>;
  abstract delete(id: string): Promise<boolean>;
}

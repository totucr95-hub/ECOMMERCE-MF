import { Injectable, inject } from '@angular/core';
import { CustomerFormData } from '../../domain/customer.models';
import { CustomerSummary } from '../../domain/entities/customer-summary.entity';
import { CustomersRepository } from '../../domain/repositories/customers.repository';

@Injectable()
export class UpdateCustomerUseCase {
  private readonly repository = inject(CustomersRepository);

  execute(
    id: string,
    payload: CustomerFormData,
  ): Promise<CustomerSummary | null> {
    return this.repository.update(id, payload);
  }
}

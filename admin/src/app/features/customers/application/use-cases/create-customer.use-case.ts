import { Injectable, inject } from '@angular/core';
import { CustomerFormData } from '../../domain/customer.models';
import { CustomerSummary } from '../../domain/entities/customer-summary.entity';
import { CustomersRepository } from '../../domain/repositories/customers.repository';

@Injectable()
export class CreateCustomerUseCase {
  private readonly repository = inject(CustomersRepository);

  execute(payload: CustomerFormData): Promise<CustomerSummary> {
    return this.repository.create(payload);
  }
}

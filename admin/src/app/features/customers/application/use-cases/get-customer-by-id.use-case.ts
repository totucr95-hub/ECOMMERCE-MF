import { Injectable, inject } from '@angular/core';
import { CustomerSummary } from '../../domain/entities/customer-summary.entity';
import { CustomersRepository } from '../../domain/repositories/customers.repository';

@Injectable()
export class GetCustomerByIdUseCase {
  private readonly repository = inject(CustomersRepository);

  execute(id: string): Promise<CustomerSummary | null> {
    return this.repository.findById(id);
  }
}

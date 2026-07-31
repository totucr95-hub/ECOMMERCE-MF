import { Injectable, inject } from '@angular/core';
import { CustomerSummary } from '../../domain/entities/customer-summary.entity';
import { CustomersRepository } from '../../domain/repositories/customers.repository';

@Injectable()
export class GetCustomersSummaryUseCase {
  private readonly repository = inject(CustomersRepository);

  execute(): Promise<ReadonlyArray<CustomerSummary>> {
    return this.repository.findSummaries();
  }
}

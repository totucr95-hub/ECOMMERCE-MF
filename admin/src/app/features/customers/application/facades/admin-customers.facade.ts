import { Injectable, inject } from '@angular/core';
import { CustomerFormData } from '../../domain/customer.models';
import { CustomerSummary } from '../../domain/entities/customer-summary.entity';
import { CreateCustomerUseCase } from '../use-cases/create-customer.use-case';
import { DeleteCustomerUseCase } from '../use-cases/delete-customer.use-case';
import { GetCustomerByIdUseCase } from '../use-cases/get-customer-by-id.use-case';
import { GetCustomersSummaryUseCase } from '../use-cases/get-customers-summary.use-case';
import { UpdateCustomerUseCase } from '../use-cases/update-customer.use-case';

@Injectable()
export class AdminCustomersFacade {
  private readonly getCustomersSummaryUseCase = inject(
    GetCustomersSummaryUseCase,
  );
  private readonly getCustomerByIdUseCase = inject(GetCustomerByIdUseCase);
  private readonly createCustomerUseCase = inject(CreateCustomerUseCase);
  private readonly updateCustomerUseCase = inject(UpdateCustomerUseCase);
  private readonly deleteCustomerUseCase = inject(DeleteCustomerUseCase);

  loadSummaries(): Promise<ReadonlyArray<CustomerSummary>> {
    return this.getCustomersSummaryUseCase.execute();
  }

  readCustomer(id: string): Promise<CustomerSummary | null> {
    return this.getCustomerByIdUseCase.execute(id);
  }

  createCustomer(payload: CustomerFormData): Promise<CustomerSummary> {
    return this.createCustomerUseCase.execute(payload);
  }

  updateCustomer(
    id: string,
    payload: CustomerFormData,
  ): Promise<CustomerSummary | null> {
    return this.updateCustomerUseCase.execute(id, payload);
  }

  deleteCustomer(id: string): Promise<boolean> {
    return this.deleteCustomerUseCase.execute(id);
  }
}

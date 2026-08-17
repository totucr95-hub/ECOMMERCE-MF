import { Injectable, inject } from '@angular/core';
import { CustomerFormData } from '../../domain/customer.models';
import { CustomerSummary } from '../../domain/entities/customer-summary.entity';
import { CustomersRepository } from '../../domain/repositories/customers.repository';
import { AdminCustomersApiService } from '../services/admin-customers-api.service';

@Injectable()
export class CustomersHttpRepository implements CustomersRepository {
  private readonly api = inject(AdminCustomersApiService);

  async findSummaries(): Promise<ReadonlyArray<CustomerSummary>> {
    return this.api.getCustomers();
  }

  async findById(id: string): Promise<CustomerSummary | null> {
    return this.api.getCustomerById(id);
  }

  async create(payload: CustomerFormData): Promise<CustomerSummary> {
    return this.api.createCustomer(payload);
  }

  async update(
    id: string,
    payload: CustomerFormData,
  ): Promise<CustomerSummary | null> {
    return this.api.updateCustomer(id, payload);
  }

  async delete(id: string): Promise<boolean> {
    return this.api.deleteCustomer(id);
  }
}

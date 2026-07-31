import { Injectable, inject } from '@angular/core';
import { CustomersRepository } from '../../domain/repositories/customers.repository';

@Injectable()
export class DeleteCustomerUseCase {
  private readonly repository = inject(CustomersRepository);

  execute(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}

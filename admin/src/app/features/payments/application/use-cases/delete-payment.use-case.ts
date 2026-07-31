import { Injectable, inject } from '@angular/core';
import { PaymentsRepository } from '../../domain/repositories/payments.repository';

@Injectable()
export class DeletePaymentUseCase {
  private readonly repository = inject(PaymentsRepository);

  execute(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}

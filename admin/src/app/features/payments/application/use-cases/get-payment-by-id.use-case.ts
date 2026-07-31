import { Injectable, inject } from '@angular/core';
import { PaymentSummary } from '../../domain/entities/payment-summary.entity';
import { PaymentsRepository } from '../../domain/repositories/payments.repository';

@Injectable()
export class GetPaymentByIdUseCase {
  private readonly repository = inject(PaymentsRepository);

  execute(id: string): Promise<PaymentSummary | null> {
    return this.repository.findById(id);
  }
}

import { Injectable, inject } from '@angular/core';
import { PaymentFormData } from '../../domain/payment.models';
import { PaymentSummary } from '../../domain/entities/payment-summary.entity';
import { PaymentsRepository } from '../../domain/repositories/payments.repository';

@Injectable()
export class UpdatePaymentUseCase {
  private readonly repository = inject(PaymentsRepository);

  execute(
    id: string,
    payload: PaymentFormData,
  ): Promise<PaymentSummary | null> {
    return this.repository.update(id, payload);
  }
}

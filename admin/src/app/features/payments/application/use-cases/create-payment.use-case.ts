import { Injectable, inject } from '@angular/core';
import { PaymentFormData } from '../../domain/payment.models';
import { PaymentSummary } from '../../domain/entities/payment-summary.entity';
import { PaymentsRepository } from '../../domain/repositories/payments.repository';

@Injectable()
export class CreatePaymentUseCase {
  private readonly repository = inject(PaymentsRepository);

  execute(payload: PaymentFormData): Promise<PaymentSummary> {
    return this.repository.create(payload);
  }
}

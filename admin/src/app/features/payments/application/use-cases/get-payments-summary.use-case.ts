import { Injectable, inject } from '@angular/core';
import { PaymentSummary } from '../../domain/entities/payment-summary.entity';
import { PaymentsRepository } from '../../domain/repositories/payments.repository';

@Injectable()
export class GetPaymentsSummaryUseCase {
  private readonly repository = inject(PaymentsRepository);

  execute(): Promise<ReadonlyArray<PaymentSummary>> {
    return this.repository.findSummaries();
  }
}

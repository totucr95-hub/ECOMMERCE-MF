import { Injectable, inject } from '@angular/core';
import { PaymentFormData } from '../../domain/payment.models';
import { PaymentSummary } from '../../domain/entities/payment-summary.entity';
import { CreatePaymentUseCase } from '../use-cases/create-payment.use-case';
import { DeletePaymentUseCase } from '../use-cases/delete-payment.use-case';
import { GetPaymentByIdUseCase } from '../use-cases/get-payment-by-id.use-case';
import { GetPaymentsSummaryUseCase } from '../use-cases/get-payments-summary.use-case';
import { UpdatePaymentUseCase } from '../use-cases/update-payment.use-case';

@Injectable()
export class AdminPaymentsFacade {
  private readonly getPaymentsSummaryUseCase = inject(GetPaymentsSummaryUseCase);
  private readonly getPaymentByIdUseCase = inject(GetPaymentByIdUseCase);
  private readonly createPaymentUseCase = inject(CreatePaymentUseCase);
  private readonly updatePaymentUseCase = inject(UpdatePaymentUseCase);
  private readonly deletePaymentUseCase = inject(DeletePaymentUseCase);

  loadSummaries(): Promise<ReadonlyArray<PaymentSummary>> {
    return this.getPaymentsSummaryUseCase.execute();
  }

  readPayment(id: string): Promise<PaymentSummary | null> {
    return this.getPaymentByIdUseCase.execute(id);
  }

  createPayment(payload: PaymentFormData): Promise<PaymentSummary> {
    return this.createPaymentUseCase.execute(payload);
  }

  updatePayment(
    id: string,
    payload: PaymentFormData,
  ): Promise<PaymentSummary | null> {
    return this.updatePaymentUseCase.execute(id, payload);
  }

  deletePayment(id: string): Promise<boolean> {
    return this.deletePaymentUseCase.execute(id);
  }
}

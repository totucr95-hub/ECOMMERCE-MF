import { Injectable, inject } from '@angular/core';
import { PaymentFormData } from '../../domain/payment.models';
import { PaymentSummary } from '../../domain/entities/payment-summary.entity';
import { PaymentsRepository } from '../../domain/repositories/payments.repository';
import { AdminPaymentsApiService } from '../services/admin-payments-api.service';

@Injectable()
export class PaymentsHttpRepository implements PaymentsRepository {
  private readonly api = inject(AdminPaymentsApiService);

  async findSummaries(): Promise<ReadonlyArray<PaymentSummary>> {
    return this.api.getPayments();
  }

  async findById(id: string): Promise<PaymentSummary | null> {
    return this.api.getPaymentById(id);
  }

  async create(payload: PaymentFormData): Promise<PaymentSummary> {
    return this.api.createPayment(payload);
  }

  async update(
    id: string,
    payload: PaymentFormData,
  ): Promise<PaymentSummary | null> {
    return this.api.updatePayment(id, payload);
  }

  async delete(id: string): Promise<boolean> {
    return this.api.deletePayment(id);
  }
}

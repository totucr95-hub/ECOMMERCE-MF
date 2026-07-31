import { PaymentFormData } from '../payment.models';
import { PaymentSummary } from '../entities/payment-summary.entity';

export abstract class PaymentsRepository {
  abstract findSummaries(): Promise<ReadonlyArray<PaymentSummary>>;
  abstract findById(id: string): Promise<PaymentSummary | null>;
  abstract create(payload: PaymentFormData): Promise<PaymentSummary>;
  abstract update(
    id: string,
    payload: PaymentFormData,
  ): Promise<PaymentSummary | null>;
  abstract delete(id: string): Promise<boolean>;
}

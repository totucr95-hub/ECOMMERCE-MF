import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AdminPaymentsFacade } from './application/facades/admin-payments.facade';
import { CreatePaymentUseCase } from './application/use-cases/create-payment.use-case';
import { DeletePaymentUseCase } from './application/use-cases/delete-payment.use-case';
import { GetPaymentByIdUseCase } from './application/use-cases/get-payment-by-id.use-case';
import { GetPaymentsSummaryUseCase } from './application/use-cases/get-payments-summary.use-case';
import { UpdatePaymentUseCase } from './application/use-cases/update-payment.use-case';
import { PaymentsRepository } from './domain/repositories/payments.repository';
import { PaymentsHttpRepository } from './infrastructure/repositories/payments-http.repository';

export const provideAdminPaymentsFeature = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    AdminPaymentsFacade,
    CreatePaymentUseCase,
    DeletePaymentUseCase,
    GetPaymentByIdUseCase,
    GetPaymentsSummaryUseCase,
    UpdatePaymentUseCase,
    {
      provide: PaymentsRepository,
      useClass: PaymentsHttpRepository,
    },
  ]);
};

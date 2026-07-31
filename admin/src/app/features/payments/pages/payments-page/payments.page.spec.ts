import { TestBed } from '@angular/core/testing';
import { PaymentsPage } from './payments.page';
import { AdminPaymentsFacade } from '../../application/facades/admin-payments.facade';

describe('PaymentsPage', () => {
  it('creates component', async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsPage],
      providers: [
        {
          provide: AdminPaymentsFacade,
          useValue: {
            loadSummaries: jest.fn().mockResolvedValue([]),
            readPayment: jest.fn().mockResolvedValue(null),
            createPayment: jest.fn().mockResolvedValue({}),
            updatePayment: jest.fn().mockResolvedValue(null),
            deletePayment: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(PaymentsPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { CustomersPage } from './customers.page';
import { AdminCustomersFacade } from '../../application/facades/admin-customers.facade';

describe('CustomersPage', () => {
  it('creates component', async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersPage],
      providers: [
        {
          provide: AdminCustomersFacade,
          useValue: {
            loadSummaries: jest.fn().mockResolvedValue([]),
            readCustomer: jest.fn().mockResolvedValue(null),
            createCustomer: jest.fn().mockResolvedValue({}),
            updateCustomer: jest.fn().mockResolvedValue(null),
            deleteCustomer: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CustomersPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

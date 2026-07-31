import { TestBed } from '@angular/core/testing';
import { OrdersPage } from './orders.page';
import { AdminOrdersFacade } from '../../application/facades/admin-orders.facade';

describe('OrdersPage', () => {
  it('creates component', async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersPage],
      providers: [
        {
          provide: AdminOrdersFacade,
          useValue: {
            loadSummaries: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(OrdersPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

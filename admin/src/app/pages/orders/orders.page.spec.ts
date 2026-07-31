import { TestBed } from '@angular/core/testing';
import { OrdersPage } from './orders.page';

describe('OrdersPage', () => {
  it('creates component', async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(OrdersPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { CartsPage } from './carts.page';
import { AdminCartsFacade } from '../../application/facades/admin-carts.facade';

describe('CartsPage', () => {
  it('creates component', async () => {
    await TestBed.configureTestingModule({
      imports: [CartsPage],
      providers: [
        {
          provide: AdminCartsFacade,
          useValue: {
            loadSummaries: jest.fn().mockResolvedValue([]),
            readCart: jest.fn().mockResolvedValue(null),
            createCart: jest.fn().mockResolvedValue({}),
            updateCart: jest.fn().mockResolvedValue(null),
            deleteCart: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CartsPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

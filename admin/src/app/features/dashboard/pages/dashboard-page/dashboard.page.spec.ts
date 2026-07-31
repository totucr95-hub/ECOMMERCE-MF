import { TestBed } from '@angular/core/testing';
import { DashboardPage } from './dashboard.page';
import { AdminDashboardFacade } from '../../application/facades/admin-dashboard.facade';

describe('DashboardPage', () => {
  it('creates component', async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        {
          provide: AdminDashboardFacade,
          useValue: {
            loadKpis: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(DashboardPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

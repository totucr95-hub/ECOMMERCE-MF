import { TestBed } from '@angular/core/testing';
import { ReportsPage } from './reports.page';
import { AdminReportsFacade } from '../../application/facades/admin-reports.facade';

describe('ReportsPage', () => {
  it('creates component', async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsPage],
      providers: [
        {
          provide: AdminReportsFacade,
          useValue: {
            generate: jest.fn().mockResolvedValue({
              generatedAt: new Date().toISOString(),
              title: 'Reporte de prueba',
              summary: 'Resumen de prueba',
              kpis: [],
              rows: [],
            }),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ReportsPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

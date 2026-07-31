import { TestBed } from '@angular/core/testing';
import { BrandsPage } from './brands.page';
import { AdminBrandsFacade } from '../../application/facades/admin-brands.facade';

describe('BrandsPage', () => {
  it('creates component', async () => {
    await TestBed.configureTestingModule({
      imports: [BrandsPage],
      providers: [
        {
          provide: AdminBrandsFacade,
          useValue: {
            loadSummaries: jest.fn().mockResolvedValue([]),
            readBrand: jest.fn().mockResolvedValue(null),
            createBrand: jest.fn().mockResolvedValue({}),
            updateBrand: jest.fn().mockResolvedValue(null),
            deleteBrand: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(BrandsPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

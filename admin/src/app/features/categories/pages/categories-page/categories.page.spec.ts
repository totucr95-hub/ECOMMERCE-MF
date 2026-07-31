import { TestBed } from '@angular/core/testing';
import { CategoriesPage } from './categories.page';
import { AdminCategoriesFacade } from '../../application/facades/admin-categories.facade';

describe('CategoriesPage', () => {
  it('creates component', async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesPage],
      providers: [
        {
          provide: AdminCategoriesFacade,
          useValue: {
            loadSummaries: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CategoriesPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

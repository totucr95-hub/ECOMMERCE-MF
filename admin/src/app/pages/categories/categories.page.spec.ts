import { TestBed } from '@angular/core/testing';
import { CategoriesPage } from './categories.page';

describe('CategoriesPage', () => {
  it('creates component', async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(CategoriesPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

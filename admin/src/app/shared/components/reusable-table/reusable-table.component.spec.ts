import { TestBed } from '@angular/core/testing';
import { ReusableTableComponent } from './reusable-table.component';

describe('ReusableTableComponent', () => {
  it('creates component', async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableTableComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ReusableTableComponent);
    fixture.componentRef.setInput('columns', [
      { key: 'name', header: 'Nombre' },
    ]);
    fixture.componentRef.setInput('rows', [{ name: 'Demo' }]);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});

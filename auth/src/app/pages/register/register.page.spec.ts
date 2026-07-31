import { TestBed } from '@angular/core/testing';
import { RegisterPage } from './register.page';

describe('RegisterPage', () => {
  it('creates component', async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(RegisterPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

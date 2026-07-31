import { TestBed } from '@angular/core/testing';
import { ForgotPasswordPage } from './forgot-password.page';

describe('ForgotPasswordPage', () => {
  it('creates component', async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(ForgotPasswordPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { AuthStore } from '@ecommerce-mf/shared-core';
import { ForgotPasswordPage } from './forgot-password.page';

describe('ForgotPasswordPage', () => {
  const recoverPasswordWithKeycloak = jest.fn();

  beforeEach(async () => {
    recoverPasswordWithKeycloak.mockReset();

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordPage],
      providers: [
        { provide: AuthStore, useValue: { recoverPasswordWithKeycloak } },
      ],
    }).compileComponents();
  });

  it('creates component', () => {
    const fixture = TestBed.createComponent(ForgotPasswordPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('starts Keycloak password recovery flow with email hint', async () => {
    const fixture = TestBed.createComponent(ForgotPasswordPage);
    const component = fixture.componentInstance;

    component.email = 'user@example.com';
    recoverPasswordWithKeycloak.mockResolvedValue(undefined);

    await component.submit();

    expect(recoverPasswordWithKeycloak).toHaveBeenCalledWith(
      'user@example.com',
      `${window.location.origin}/auth/login`,
    );
  });

  it('shows error when keycloak is unavailable', async () => {
    const fixture = TestBed.createComponent(ForgotPasswordPage);
    const component = fixture.componentInstance;

    recoverPasswordWithKeycloak.mockRejectedValue(new Error('offline'));
    await component.submit();

    expect(component.errorMessage).toContain('Keycloak');
  });
});

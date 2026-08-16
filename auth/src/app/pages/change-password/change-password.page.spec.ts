import { TestBed } from '@angular/core/testing';
import { AuthStore } from '@ecommerce-mf/shared-core';
import { ChangePasswordPage } from './change-password.page';

describe('ChangePasswordPage', () => {
  const changePasswordWithKeycloak = jest.fn();

  beforeEach(async () => {
    changePasswordWithKeycloak.mockReset();

    await TestBed.configureTestingModule({
      imports: [ChangePasswordPage],
      providers: [
        { provide: AuthStore, useValue: { changePasswordWithKeycloak } },
      ],
    }).compileComponents();
  });

  it('creates component', () => {
    const fixture = TestBed.createComponent(ChangePasswordPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('starts Keycloak change password flow', async () => {
    const fixture = TestBed.createComponent(ChangePasswordPage);
    const component = fixture.componentInstance;

    changePasswordWithKeycloak.mockResolvedValue(undefined);

    await component.submit();

    expect(changePasswordWithKeycloak).toHaveBeenCalledWith(
      `${window.location.origin}/auth/login`,
    );
  });

  it('shows error when keycloak is unavailable', async () => {
    const fixture = TestBed.createComponent(ChangePasswordPage);
    const component = fixture.componentInstance;

    changePasswordWithKeycloak.mockRejectedValue(new Error('offline'));
    await component.submit();

    expect(component.errorMessage).toContain('Keycloak');
  });
});

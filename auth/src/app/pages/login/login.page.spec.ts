import { TestBed } from '@angular/core/testing';
import { AuthStore } from '@ecommerce-mf/shared-core';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  const loginWithKeycloak = jest.fn();

  beforeEach(async () => {
    loginWithKeycloak.mockReset();

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [{ provide: AuthStore, useValue: { loginWithKeycloak } }],
    }).compileComponents();
  });

  it('creates component', () => {
    const fixture = TestBed.createComponent(LoginPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('starts Keycloak login flow', async () => {
    const fixture = TestBed.createComponent(LoginPage);
    const component = fixture.componentInstance;

    loginWithKeycloak.mockResolvedValue(undefined);

    await component.submit();

    expect(loginWithKeycloak).toHaveBeenCalled();
  });

  it('shows error when keycloak is unavailable', async () => {
    const fixture = TestBed.createComponent(LoginPage);
    const component = fixture.componentInstance;

    loginWithKeycloak.mockRejectedValue(new Error('offline'));
    await component.submit();

    expect(component.errorMessage).toContain('Keycloak');
  });
});

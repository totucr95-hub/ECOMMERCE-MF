import { TestBed } from '@angular/core/testing';
import { AuthStore } from '@ecommerce-mf/shared-core';
import { RegisterPage } from './register.page';

describe('RegisterPage', () => {
  const registerWithKeycloak = jest.fn();

  beforeEach(async () => {
    registerWithKeycloak.mockReset();

    await TestBed.configureTestingModule({
      imports: [RegisterPage],
      providers: [{ provide: AuthStore, useValue: { registerWithKeycloak } }],
    }).compileComponents();
  });

  it('creates component', () => {
    const fixture = TestBed.createComponent(RegisterPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('starts Keycloak registration flow', async () => {
    const fixture = TestBed.createComponent(RegisterPage);
    const component = fixture.componentInstance;

    registerWithKeycloak.mockResolvedValue(undefined);

    await component.submit();

    expect(registerWithKeycloak).toHaveBeenCalled();
  });

  it('shows error when keycloak is unavailable', async () => {
    const fixture = TestBed.createComponent(RegisterPage);
    const component = fixture.componentInstance;

    registerWithKeycloak.mockRejectedValue(new Error('offline'));
    await component.submit();

    expect(component.errorMessage).toContain('Keycloak');
  });
});

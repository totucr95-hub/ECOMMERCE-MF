import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { User } from '@ecommerce-mf/shared-models';
import { AuthStore } from '@ecommerce-mf/shared-core';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  const navigateByUrl = jest.fn();
  const login = jest.fn();

  beforeEach(async () => {
    navigateByUrl.mockReset();
    login.mockReset();

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        {
          provide: Router,
          useValue: {
            config: [{ path: 'landing' }],
            navigateByUrl,
          },
        },
        { provide: AuthStore, useValue: { login } },
      ],
    }).compileComponents();
  });

  it('creates component', () => {
    const fixture = TestBed.createComponent(LoginPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('navigates to admin for a valid user', async () => {
    const fixture = TestBed.createComponent(LoginPage);
    const component = fixture.componentInstance;

    login.mockReturnValue({ role: { name: 'admin' } } as User);
    navigateByUrl.mockResolvedValue(true);

    await component.submit();

    expect(navigateByUrl).toHaveBeenCalledWith('/admin');
  });

  it('shows error for invalid credentials', () => {
    const fixture = TestBed.createComponent(LoginPage);
    const component = fixture.componentInstance;

    login.mockReturnValue(null);
    void component.submit();

    expect(component.errorMessage).toContain('Credenciales invalidas');
  });
});

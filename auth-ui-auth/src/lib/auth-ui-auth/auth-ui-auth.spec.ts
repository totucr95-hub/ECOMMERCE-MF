import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthUiAuth } from './auth-ui-auth';

describe('AuthUiAuth', () => {
  let component: AuthUiAuth;
  let fixture: ComponentFixture<AuthUiAuth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthUiAuth],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthUiAuth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

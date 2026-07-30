import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthFeatureAuth } from './auth-feature-auth';

describe('AuthFeatureAuth', () => {
  let component: AuthFeatureAuth;
  let fixture: ComponentFixture<AuthFeatureAuth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthFeatureAuth],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthFeatureAuth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

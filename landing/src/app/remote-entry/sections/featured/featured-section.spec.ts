import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturedSectionComponent } from './featured-section';

describe('FeaturedSectionComponent', () => {
  let component: FeaturedSectionComponent;
  let fixture: ComponentFixture<FeaturedSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturedSectionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('featuredProducts', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
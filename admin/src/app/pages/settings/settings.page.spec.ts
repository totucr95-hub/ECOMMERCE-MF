import { TestBed } from '@angular/core/testing';
import { SettingsPage } from './settings.page';

describe('SettingsPage', () => {
  it('creates component', async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(SettingsPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

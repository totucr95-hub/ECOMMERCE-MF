import { TestBed } from '@angular/core/testing';
import { SettingsPage } from './settings.page';
import { AdminSettingsFacade } from '../../application/facades/admin-settings.facade';

describe('SettingsPage', () => {
  it('creates component', async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsPage],
      providers: [
        {
          provide: AdminSettingsFacade,
          useValue: {
            loadSummaries: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(SettingsPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

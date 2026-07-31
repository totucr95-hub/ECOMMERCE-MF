import { TestBed } from '@angular/core/testing';
import { UsersPage } from './users.page';
import { AdminUsersFacade } from '../../application/facades/admin-users.facade';

describe('UsersPage', () => {
  it('creates component', async () => {
    await TestBed.configureTestingModule({
      imports: [UsersPage],
      providers: [
        {
          provide: AdminUsersFacade,
          useValue: {
            loadSummaries: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(UsersPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

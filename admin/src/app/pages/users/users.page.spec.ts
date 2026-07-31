import { TestBed } from '@angular/core/testing';
import { UsersPage } from './users.page';

describe('UsersPage', () => {
  it('creates component', async () => {
    await TestBed.configureTestingModule({
      imports: [UsersPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(UsersPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

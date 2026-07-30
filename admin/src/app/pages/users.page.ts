import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'admin-users-page',
  standalone: true,
  template: `<section><h1>Usuarios</h1><p>CRUD de usuarios listo para integrar con API.</p></section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPage {}

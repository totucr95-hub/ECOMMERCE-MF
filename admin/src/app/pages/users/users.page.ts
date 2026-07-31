import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ReusableTableColumn,
  ReusableTableComponent,
} from '../../shared/components/reusable-table/reusable-table.component';

@Component({
  selector: 'admin-users-page',
  standalone: true,
  imports: [ReusableTableComponent],
  templateUrl: './users.page.html',
  styleUrl: './users.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPage {
  readonly columns: ReusableTableColumn[] = [
    { key: 'name', header: 'Usuario' },
    { key: 'email', header: 'Correo' },
    { key: 'role', header: 'Rol', align: 'center' },
    { key: 'status', header: 'Estado', align: 'center' },
  ];

  readonly rows: ReadonlyArray<Record<string, unknown>> = [
    {
      name: 'Ana Torres',
      email: 'ana@lifeos.co',
      role: 'Admin',
      status: 'Activo',
    },
    {
      name: 'Pablo Cruz',
      email: 'pablo@lifeos.co',
      role: 'Soporte',
      status: 'Activo',
    },
    {
      name: 'Laura Perez',
      email: 'laura@lifeos.co',
      role: 'Operador',
      status: 'Suspendido',
    },
    {
      name: 'Juan Soto',
      email: 'juan@lifeos.co',
      role: 'Analista',
      status: 'Activo',
    },
  ];
}

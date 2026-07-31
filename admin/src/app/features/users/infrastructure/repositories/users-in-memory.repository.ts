import { Injectable } from '@angular/core';
import { UserSummary } from '../../domain/entities/user-summary.entity';
import { UsersRepository } from '../../domain/repositories/users.repository';

@Injectable()
export class UsersInMemoryRepository implements UsersRepository {
  async findSummaries(): Promise<ReadonlyArray<UserSummary>> {
    return [
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
}

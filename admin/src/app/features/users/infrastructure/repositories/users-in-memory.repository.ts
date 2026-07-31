import { Injectable } from '@angular/core';
import { UserSummary } from '../../domain/entities/user-summary.entity';
import { UsersRepository } from '../../domain/repositories/users.repository';

@Injectable()
export class UsersInMemoryRepository implements UsersRepository {
  async findSummaries(): Promise<ReadonlyArray<UserSummary>> {
    const firstNames = [
      'Ana',
      'Pablo',
      'Laura',
      'Juan',
      'Sofia',
      'Diego',
      'Maria',
      'Camilo',
      'Valentina',
      'Andres',
    ];
    const lastNames = [
      'Torres',
      'Cruz',
      'Perez',
      'Soto',
      'Rojas',
      'Lopez',
      'Gomez',
      'Ruiz',
      'Mora',
      'Diaz',
    ];
    const roles = ['Admin', 'Soporte', 'Operador', 'Analista', 'Finanzas'];
    const statuses = ['Activo', 'Activo', 'Activo', 'Suspendido'];

    return Array.from({ length: 100 }, (_unused, index) => {
      const item = index + 1;
      const firstName = firstNames[index % firstNames.length];
      const lastName = lastNames[(index * 2) % lastNames.length];

      return {
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${item}@lifeos.co`,
        role: roles[index % roles.length],
        status: statuses[index % statuses.length],
      };
    });
  }
}

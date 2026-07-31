import { Injectable, inject } from '@angular/core';
import { BrandsRepository } from '../../domain/repositories/brands.repository';

@Injectable()
export class DeleteBrandUseCase {
  private readonly repository = inject(BrandsRepository);

  execute(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}

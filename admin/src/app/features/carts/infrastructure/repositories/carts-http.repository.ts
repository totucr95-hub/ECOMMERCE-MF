import { Injectable, inject } from '@angular/core';
import { CartFormData } from '../../domain/cart.models';
import { CartSummary } from '../../domain/entities/cart-summary.entity';
import { CartsRepository } from '../../domain/repositories/carts.repository';
import { AdminCartsApiService } from '../services/admin-carts-api.service';

@Injectable()
export class CartsHttpRepository implements CartsRepository {
  private readonly api = inject(AdminCartsApiService);

  async findSummaries(): Promise<ReadonlyArray<CartSummary>> {
    return this.api.getCarts();
  }

  async findById(id: string): Promise<CartSummary | null> {
    return this.api.getCartById(id);
  }

  async create(payload: CartFormData): Promise<CartSummary> {
    return this.api.createCart(payload);
  }

  async update(id: string, payload: CartFormData): Promise<CartSummary | null> {
    return this.api.updateCart(id, payload);
  }

  async delete(id: string): Promise<boolean> {
    return this.api.deleteCart(id);
  }
}

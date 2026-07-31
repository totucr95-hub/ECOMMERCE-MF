import { Injectable, inject } from '@angular/core';
import { CartFormData } from '../../domain/cart.models';
import { CartSummary } from '../../domain/entities/cart-summary.entity';
import { CreateCartUseCase } from '../use-cases/create-cart.use-case';
import { DeleteCartUseCase } from '../use-cases/delete-cart.use-case';
import { GetCartByIdUseCase } from '../use-cases/get-cart-by-id.use-case';
import { GetCartsSummaryUseCase } from '../use-cases/get-carts-summary.use-case';
import { UpdateCartUseCase } from '../use-cases/update-cart.use-case';

@Injectable()
export class AdminCartsFacade {
  private readonly getCartsSummaryUseCase = inject(GetCartsSummaryUseCase);
  private readonly getCartByIdUseCase = inject(GetCartByIdUseCase);
  private readonly createCartUseCase = inject(CreateCartUseCase);
  private readonly updateCartUseCase = inject(UpdateCartUseCase);
  private readonly deleteCartUseCase = inject(DeleteCartUseCase);

  loadSummaries(): Promise<ReadonlyArray<CartSummary>> {
    return this.getCartsSummaryUseCase.execute();
  }

  readCart(id: string): Promise<CartSummary | null> {
    return this.getCartByIdUseCase.execute(id);
  }

  createCart(payload: CartFormData): Promise<CartSummary> {
    return this.createCartUseCase.execute(payload);
  }

  updateCart(id: string, payload: CartFormData): Promise<CartSummary | null> {
    return this.updateCartUseCase.execute(id, payload);
  }

  deleteCart(id: string): Promise<boolean> {
    return this.deleteCartUseCase.execute(id);
  }
}

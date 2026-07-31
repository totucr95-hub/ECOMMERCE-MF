import { AdminProduct } from '../entities/admin-product.entity';
import { ProductFormData } from '../product.models';

export abstract class AdminProductRepository {
  abstract findAll(): Promise<ReadonlyArray<AdminProduct>>;
  abstract findById(id: string): Promise<AdminProduct | null>;
  abstract create(payload: ProductFormData): Promise<AdminProduct>;
  abstract update(
    id: string,
    payload: ProductFormData,
  ): Promise<AdminProduct | null>;
  abstract delete(id: string): Promise<boolean>;
}

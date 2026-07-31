import { AdminProduct } from '../entities/admin-product.entity';

export abstract class AdminProductRepository {
  abstract findAll(): Promise<ReadonlyArray<AdminProduct>>;
}

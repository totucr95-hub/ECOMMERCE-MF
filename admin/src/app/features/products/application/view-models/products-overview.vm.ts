import { AdminProduct } from '../../domain/entities/admin-product.entity';

export interface ProductsOverviewVm {
  products: ReadonlyArray<AdminProduct>;
  featuredProducts: ReadonlyArray<AdminProduct>;
}

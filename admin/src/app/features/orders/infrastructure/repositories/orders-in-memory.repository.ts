import { Injectable } from '@angular/core';
import { OrderSummary } from '../../domain/entities/order-summary.entity';
import { OrdersRepository } from '../../domain/repositories/orders.repository';

@Injectable()
export class OrdersInMemoryRepository implements OrdersRepository {
  async findSummaries(): Promise<ReadonlyArray<OrderSummary>> {
    return [
      {
        orderId: 'ORD-1042',
        customer: 'Maria Gomez',
        total: '$480.000',
        status: 'Pagado',
      },
      {
        orderId: 'ORD-1043',
        customer: 'Diego Ruiz',
        total: '$220.000',
        status: 'Pendiente',
      },
      {
        orderId: 'ORD-1044',
        customer: 'Juliana Mora',
        total: '$94.000',
        status: 'Despachado',
      },
      {
        orderId: 'ORD-1045',
        customer: 'Camilo Rojas',
        total: '$1.280.000',
        status: 'Pagado',
      },
    ];
  }
}

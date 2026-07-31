import { Injectable } from '@angular/core';
import { CustomerFormData } from '../../domain/customer.models';
import { CustomerSummary } from '../../domain/entities/customer-summary.entity';
import { CustomersRepository } from '../../domain/repositories/customers.repository';

@Injectable()
export class CustomersInMemoryRepository implements CustomersRepository {
  private customersCache: CustomerSummary[] = [
    {
      id: 'cus-1001',
      fullName: 'Ana Torres',
      email: 'ana.torres@correo.com',
      phone: '+57 301 445 2299',
      city: 'Bogota',
      totalOrders: 18,
      totalSpent: 4820000,
      status: 'Activo',
      segment: 'VIP',
      notes: 'Prefiere entregas en la tarde.',
      lastOrderAt: '2026-07-30',
    },
    {
      id: 'cus-1002',
      fullName: 'Pablo Cruz',
      email: 'pablo.cruz@correo.com',
      phone: '+57 315 901 1170',
      city: 'Medellin',
      totalOrders: 7,
      totalSpent: 1210000,
      status: 'Activo',
      segment: 'Frecuente',
      notes: 'Compra accesorios deportivos.',
      lastOrderAt: '2026-07-29',
    },
    {
      id: 'cus-1003',
      fullName: 'Laura Perez',
      email: 'laura.perez@correo.com',
      phone: '+57 320 541 0991',
      city: 'Cali',
      totalOrders: 2,
      totalSpent: 260000,
      status: 'Inactivo',
      segment: 'Nuevo',
      notes: 'Solicita seguimiento por WhatsApp.',
      lastOrderAt: '2026-07-20',
    },
    {
      id: 'cus-1004',
      fullName: 'Camilo Rojas',
      email: 'camilo.rojas@correo.com',
      phone: '+57 311 802 2234',
      city: 'Barranquilla',
      totalOrders: 11,
      totalSpent: 2310000,
      status: 'Activo',
      segment: 'Frecuente',
      notes: 'Facturacion a nombre de empresa.',
      lastOrderAt: '2026-07-31',
    },
  ];

  async findSummaries(): Promise<ReadonlyArray<CustomerSummary>> {
    await this.simulateEndpointLatency();
    return [...this.customersCache];
  }

  async findById(id: string): Promise<CustomerSummary | null> {
    await this.simulateEndpointLatency();
    const customer = this.customersCache.find((item) => item.id === id);
    return customer ? { ...customer } : null;
  }

  async create(payload: CustomerFormData): Promise<CustomerSummary> {
    await this.simulateEndpointLatency();

    const customer: CustomerSummary = {
      id: payload.id ?? this.createCustomerId(),
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      city: payload.city,
      totalOrders: payload.totalOrders,
      totalSpent: payload.totalSpent,
      status: payload.status,
      segment: payload.segment,
      notes: payload.notes,
      lastOrderAt: payload.lastOrderAt,
    };

    this.customersCache = [customer, ...this.customersCache];
    return { ...customer };
  }

  async update(
    id: string,
    payload: CustomerFormData,
  ): Promise<CustomerSummary | null> {
    await this.simulateEndpointLatency();

    const index = this.customersCache.findIndex((item) => item.id === id);
    if (index < 0) {
      return null;
    }

    const updated: CustomerSummary = {
      id,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      city: payload.city,
      totalOrders: payload.totalOrders,
      totalSpent: payload.totalSpent,
      status: payload.status,
      segment: payload.segment,
      notes: payload.notes,
      lastOrderAt: payload.lastOrderAt,
    };

    this.customersCache = [
      ...this.customersCache.slice(0, index),
      updated,
      ...this.customersCache.slice(index + 1),
    ];

    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    await this.simulateEndpointLatency();

    const before = this.customersCache.length;
    this.customersCache = this.customersCache.filter((item) => item.id !== id);
    return this.customersCache.length < before;
  }

  private createCustomerId(): string {
    return `cus-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  private async simulateEndpointLatency(): Promise<void> {
    const delayMs = 250 + Math.floor(Math.random() * 400);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}

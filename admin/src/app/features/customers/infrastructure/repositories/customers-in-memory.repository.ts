import { Injectable } from '@angular/core';
import { CustomerFormData } from '../../domain/customer.models';
import { CustomerSummary } from '../../domain/entities/customer-summary.entity';
import { CustomersRepository } from '../../domain/repositories/customers.repository';

@Injectable()
export class CustomersInMemoryRepository implements CustomersRepository {
  private customersCache: CustomerSummary[] = this.buildInitialCustomers();

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

  private buildInitialCustomers(): CustomerSummary[] {
    const firstNames = [
      'Ana',
      'Pablo',
      'Laura',
      'Camilo',
      'Sofia',
      'Diego',
      'Maria',
      'Julian',
      'Valentina',
      'Nicolas',
    ];
    const lastNames = [
      'Torres',
      'Cruz',
      'Perez',
      'Rojas',
      'Mora',
      'Ruiz',
      'Gomez',
      'Diaz',
      'Lopez',
      'Ramirez',
    ];
    const cities = ['Bogota', 'Medellin', 'Cali', 'Barranquilla', 'Pereira'];
    const statuses = ['Activo', 'Activo', 'Activo', 'Inactivo'];
    const segments = ['Nuevo', 'Frecuente', 'VIP'];

    return Array.from({ length: 100 }, (_unused, index) => {
      const item = index + 1;
      const firstName = firstNames[index % firstNames.length];
      const lastName = lastNames[(index * 3) % lastNames.length];
      const fullName = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${item}@correo.com`;

      return {
        id: `cus-${1000 + item}`,
        fullName,
        email,
        phone: `+57 3${(10 + (item % 90)).toString().padStart(2, '0')} ${(
          100 + ((item * 7) % 900)
        )} ${(1000 + ((item * 31) % 9000)).toString().padStart(4, '0')}`,
        city: cities[index % cities.length],
        totalOrders: item % 26,
        totalSpent: 120000 + item * 53000,
        status: statuses[index % statuses.length],
        segment: segments[index % segments.length],
        notes: `Cliente cargado para simulacion #${item}.`,
        lastOrderAt: this.formatDate(index % 45),
      };
    });
  }

  private formatDate(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().slice(0, 10);
  }
}

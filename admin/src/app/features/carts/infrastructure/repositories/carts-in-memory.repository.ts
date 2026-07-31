import { Injectable } from '@angular/core';
import { CartFormData } from '../../domain/cart.models';
import { CartSummary } from '../../domain/entities/cart-summary.entity';
import { CartsRepository } from '../../domain/repositories/carts.repository';

@Injectable()
export class CartsInMemoryRepository implements CartsRepository {
  private cartsCache: CartSummary[] = this.buildInitialCarts();

  async findSummaries(): Promise<ReadonlyArray<CartSummary>> {
    await this.simulateEndpointLatency();
    return [...this.cartsCache];
  }

  async findById(id: string): Promise<CartSummary | null> {
    await this.simulateEndpointLatency();
    const cart = this.cartsCache.find((item) => item.id === id);
    return cart ? { ...cart } : null;
  }

  async create(payload: CartFormData): Promise<CartSummary> {
    await this.simulateEndpointLatency();

    const created: CartSummary = {
      id: payload.id ?? this.createCartId(),
      cartCode: payload.cartCode,
      customer: payload.customer,
      itemsCount: payload.itemsCount,
      subtotal: payload.subtotal,
      taxes: payload.taxes,
      total: payload.total,
      status: payload.status,
      updatedAt: payload.updatedAt,
      notes: payload.notes,
    };

    this.cartsCache = [created, ...this.cartsCache];
    return { ...created };
  }

  async update(id: string, payload: CartFormData): Promise<CartSummary | null> {
    await this.simulateEndpointLatency();

    const index = this.cartsCache.findIndex((item) => item.id === id);
    if (index < 0) {
      return null;
    }

    const updated: CartSummary = {
      id,
      cartCode: payload.cartCode,
      customer: payload.customer,
      itemsCount: payload.itemsCount,
      subtotal: payload.subtotal,
      taxes: payload.taxes,
      total: payload.total,
      status: payload.status,
      updatedAt: payload.updatedAt,
      notes: payload.notes,
    };

    this.cartsCache = [
      ...this.cartsCache.slice(0, index),
      updated,
      ...this.cartsCache.slice(index + 1),
    ];

    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    await this.simulateEndpointLatency();

    const before = this.cartsCache.length;
    this.cartsCache = this.cartsCache.filter((item) => item.id !== id);
    return this.cartsCache.length < before;
  }

  private createCartId(): string {
    return `cart-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  private async simulateEndpointLatency(): Promise<void> {
    const delayMs = 250 + Math.floor(Math.random() * 420);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  private buildInitialCarts(): CartSummary[] {
    const customers = [
      'Camilo Rojas',
      'Laura Perez',
      'Pablo Cruz',
      'Ana Torres',
      'Diego Ruiz',
      'Maria Gomez',
      'Juliana Mora',
      'Sofia Lemos',
    ];
    const statuses = ['Activo', 'Abandonado', 'Convertido', 'Expirado'];

    return Array.from({ length: 100 }, (_unused, index) => {
      const item = index + 1;
      const subtotal = 80000 + item * 17500;
      const taxes = Math.round(subtotal * 0.19);

      return {
        id: `cart-${3000 + item}`,
        cartCode: `CRT-${1000 + item}`,
        customer: customers[index % customers.length],
        itemsCount: 1 + (item % 8),
        subtotal,
        taxes,
        total: subtotal + taxes,
        status: statuses[index % statuses.length],
        updatedAt: this.formatDate(index % 30),
        notes: `Sesion de carrito #${item} con seguimiento automatico.`,
      };
    });
  }

  private formatDate(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().slice(0, 10);
  }
}

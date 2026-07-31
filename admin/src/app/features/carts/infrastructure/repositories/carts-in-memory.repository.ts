import { Injectable } from '@angular/core';
import { CartFormData } from '../../domain/cart.models';
import { CartSummary } from '../../domain/entities/cart-summary.entity';
import { CartsRepository } from '../../domain/repositories/carts.repository';

@Injectable()
export class CartsInMemoryRepository implements CartsRepository {
  private cartsCache: CartSummary[] = [
    {
      id: 'cart-3001',
      cartCode: 'CRT-1001',
      customer: 'Camilo Rojas',
      itemsCount: 3,
      subtotal: 1240000,
      taxes: 235600,
      total: 1475600,
      status: 'Activo',
      updatedAt: '2026-07-31',
      notes: 'Carrito recuperado por campana de abandono.',
    },
    {
      id: 'cart-3002',
      cartCode: 'CRT-1002',
      customer: 'Laura Perez',
      itemsCount: 1,
      subtotal: 189000,
      taxes: 35910,
      total: 224910,
      status: 'Convertido',
      updatedAt: '2026-07-30',
      notes: 'Convertido a pedido ORD-1051.',
    },
    {
      id: 'cart-3003',
      cartCode: 'CRT-1003',
      customer: 'Pablo Cruz',
      itemsCount: 5,
      subtotal: 540000,
      taxes: 102600,
      total: 642600,
      status: 'Abandonado',
      updatedAt: '2026-07-29',
      notes: 'Sin actividad en las ultimas 72h.',
    },
  ];

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
}

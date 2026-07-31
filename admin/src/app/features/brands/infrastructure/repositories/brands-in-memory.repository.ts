import { Injectable } from '@angular/core';
import { BrandFormData } from '../../domain/brand.models';
import { BrandSummary } from '../../domain/entities/brand-summary.entity';
import { BrandsRepository } from '../../domain/repositories/brands.repository';

@Injectable()
export class BrandsInMemoryRepository implements BrandsRepository {
  private brandsCache: BrandSummary[] = [
    {
      id: 'br-1001',
      code: 'BRD-NV',
      name: 'NovaTech',
      categoryFocus: 'Electronica',
      country: 'Colombia',
      activeProducts: 42,
      status: 'Activa',
      manager: 'Laura Perez',
      updatedAt: '2026-07-31',
      notes: 'Marca de alto crecimiento en gadgets.',
    },
    {
      id: 'br-1002',
      code: 'BRD-EC',
      name: 'EcoHome',
      categoryFocus: 'Hogar',
      country: 'Mexico',
      activeProducts: 18,
      status: 'Activa',
      manager: 'David Ruiz',
      updatedAt: '2026-07-30',
      notes: 'Portafolio premium sostenible.',
    },
    {
      id: 'br-1003',
      code: 'BRD-RT',
      name: 'RunTrail',
      categoryFocus: 'Deportes',
      country: 'Chile',
      activeProducts: 25,
      status: 'En revision',
      manager: 'Camilo Rojas',
      updatedAt: '2026-07-29',
      notes: 'Esperando renovacion de contrato anual.',
    },
  ];

  async findSummaries(): Promise<ReadonlyArray<BrandSummary>> {
    await this.simulateEndpointLatency();
    return [...this.brandsCache];
  }

  async findById(id: string): Promise<BrandSummary | null> {
    await this.simulateEndpointLatency();
    const brand = this.brandsCache.find((item) => item.id === id);
    return brand ? { ...brand } : null;
  }

  async create(payload: BrandFormData): Promise<BrandSummary> {
    await this.simulateEndpointLatency();

    const created: BrandSummary = {
      id: payload.id ?? this.createBrandId(),
      code: payload.code,
      name: payload.name,
      categoryFocus: payload.categoryFocus,
      country: payload.country,
      activeProducts: payload.activeProducts,
      status: payload.status,
      manager: payload.manager,
      updatedAt: payload.updatedAt,
      notes: payload.notes,
    };

    this.brandsCache = [created, ...this.brandsCache];
    return { ...created };
  }

  async update(
    id: string,
    payload: BrandFormData,
  ): Promise<BrandSummary | null> {
    await this.simulateEndpointLatency();

    const index = this.brandsCache.findIndex((item) => item.id === id);
    if (index < 0) {
      return null;
    }

    const updated: BrandSummary = {
      id,
      code: payload.code,
      name: payload.name,
      categoryFocus: payload.categoryFocus,
      country: payload.country,
      activeProducts: payload.activeProducts,
      status: payload.status,
      manager: payload.manager,
      updatedAt: payload.updatedAt,
      notes: payload.notes,
    };

    this.brandsCache = [
      ...this.brandsCache.slice(0, index),
      updated,
      ...this.brandsCache.slice(index + 1),
    ];

    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    await this.simulateEndpointLatency();

    const before = this.brandsCache.length;
    this.brandsCache = this.brandsCache.filter((item) => item.id !== id);
    return this.brandsCache.length < before;
  }

  private createBrandId(): string {
    return `br-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  private async simulateEndpointLatency(): Promise<void> {
    const delayMs = 220 + Math.floor(Math.random() * 380);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}

import { Injectable } from '@angular/core';
import { BrandFormData } from '../../domain/brand.models';
import { BrandSummary } from '../../domain/entities/brand-summary.entity';
import { BrandsRepository } from '../../domain/repositories/brands.repository';

@Injectable()
export class BrandsInMemoryRepository implements BrandsRepository {
  private brandsCache: BrandSummary[] = this.buildInitialBrands();

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

  private buildInitialBrands(): BrandSummary[] {
    const catalogNames = [
      'NovaTech',
      'EcoHome',
      'RunTrail',
      'CasaLuz',
      'UrbanPeak',
      'GreenWave',
      'HyperSound',
      'PureSkin',
      'AquaFit',
      'PixelGear',
    ];
    const categories = [
      'Decks y pisos',
      'Mobiliario exterior',
      'Fachadas y cerramientos',
      'Perfiles estructurales',
    ];
    const countries = ['Colombia'];
    const managers = [
      'Laura Perez',
      'David Ruiz',
      'Camilo Rojas',
      'Ana Torres',
      'Pablo Cruz',
    ];
    const statuses = ['Activa', 'Activa', 'Activa', 'En revision', 'Pausada'];

    return Array.from({ length: 100 }, (_unused, index) => {
      const item = index + 1;
      return {
        id: `br-${1000 + item}`,
        code: `BRD-${String(item).padStart(3, '0')}`,
        name: `${catalogNames[index % catalogNames.length]} ${Math.ceil(item / catalogNames.length)}`,
        categoryFocus: categories[index % categories.length],
        country: countries[index % countries.length],
        activeProducts: 6 + ((item * 5) % 90),
        status: statuses[index % statuses.length],
        manager: managers[index % managers.length],
        updatedAt: this.formatDate(index % 28),
        notes: `Seguimiento comercial trimestral #${item}.`,
      };
    });
  }

  private formatDate(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().slice(0, 10);
  }
}

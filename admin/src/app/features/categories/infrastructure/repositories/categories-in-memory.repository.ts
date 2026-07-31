import { Injectable } from '@angular/core';
import { CategoryFormData } from '../../domain/category.models';
import { CategorySummary } from '../../domain/entities/category-summary.entity';
import { CategoriesRepository } from '../../domain/repositories/categories.repository';

@Injectable()
export class CategoriesInMemoryRepository implements CategoriesRepository {
  private categoriesCache: CategorySummary[] = this.buildInitialCategories();

  async findSummaries(): Promise<ReadonlyArray<CategorySummary>> {
    await this.simulateEndpointLatency();
    return [...this.categoriesCache];
  }

  async findById(id: string): Promise<CategorySummary | null> {
    await this.simulateEndpointLatency();
    const category = this.categoriesCache.find((item) => item.id === id);
    return category ? { ...category } : null;
  }

  async create(payload: CategoryFormData): Promise<CategorySummary> {
    await this.simulateEndpointLatency();

    const category: CategorySummary = {
      id: payload.id ?? this.createCategoryId(payload.name),
      name: payload.name,
      slug: payload.slug,
      description: payload.description,
      products: payload.products,
      featured: payload.featured,
    };

    this.categoriesCache = [category, ...this.categoriesCache];
    return { ...category };
  }

  async update(
    id: string,
    payload: CategoryFormData,
  ): Promise<CategorySummary | null> {
    await this.simulateEndpointLatency();

    const index = this.categoriesCache.findIndex((item) => item.id === id);
    if (index < 0) {
      return null;
    }

    const updated: CategorySummary = {
      id,
      name: payload.name,
      slug: payload.slug,
      description: payload.description,
      products: payload.products,
      featured: payload.featured,
    };

    this.categoriesCache = [
      ...this.categoriesCache.slice(0, index),
      updated,
      ...this.categoriesCache.slice(index + 1),
    ];

    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    await this.simulateEndpointLatency();

    const before = this.categoriesCache.length;
    this.categoriesCache = this.categoriesCache.filter(
      (item) => item.id !== id,
    );
    return this.categoriesCache.length < before;
  }

  private createCategoryId(name: string): string {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return slug ? `cat-${slug}` : `cat-${Date.now()}`;
  }

  private async simulateEndpointLatency(): Promise<void> {
    const delayMs = 240 + Math.floor(Math.random() * 360);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  private buildInitialCategories(): CategorySummary[] {
    const categoryNames = [
      'Electronica',
      'Hogar',
      'Deportes',
      'Moda',
      'Belleza',
      'Gaming',
      'Mascotas',
      'Infantil',
      'Oficina',
      'Salud',
    ];

    return Array.from({ length: 100 }, (_unused, index) => {
      const item = index + 1;
      const baseName = categoryNames[index % categoryNames.length];
      const slug = `${baseName.toLowerCase()}-${item}`;

      return {
        id: `cat-${slug}`,
        name: `${baseName} ${Math.ceil(item / categoryNames.length)}`,
        slug,
        description: `Coleccion ${baseName} para temporada ${2025 + (item % 2)}.`,
        products: 8 + ((item * 3) % 120),
        featured: item % 4 === 0,
      };
    });
  }
}

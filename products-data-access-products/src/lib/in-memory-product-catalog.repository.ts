import { Injectable } from '@angular/core';
import {
  ProductCatalog,
  ProductCatalogRepository,
} from '@ecommerce-mf/products-domain-products';

const catalog: ProductCatalog = {
  categories: [
    {
      id: 'cat-1',
      name: 'Computadores',
      slug: 'computadores',
      description: 'Equipos para trabajo, estudio y entretenimiento.',
    },
    {
      id: 'cat-2',
      name: 'Movilidad',
      slug: 'movilidad',
      description: 'Telefonos, tablets y dispositivos personales.',
    },
    {
      id: 'cat-3',
      name: 'Audio',
      slug: 'audio',
      description: 'Audio personal y para el hogar.',
    },
  ],
  products: [
    {
      id: 'prod-1',
      name: 'Laptop Pro 14',
      slug: 'laptop-pro-14',
      description: 'Ultrabook de alto rendimiento',
      image: 'https://picsum.photos/seed/prod1/640/480',
      price: 1499,
      stock: 18,
      featured: true,
      categoryId: 'cat-1',
      rating: 4.8,
    },
    {
      id: 'prod-2',
      name: 'Laptop Air 13',
      slug: 'laptop-air-13',
      description: 'Ligera y silenciosa',
      image: 'https://picsum.photos/seed/prod2/640/480',
      price: 1099,
      stock: 23,
      featured: true,
      categoryId: 'cat-1',
      rating: 4.6,
    },
    {
      id: 'prod-3',
      name: 'Laptop Gamer X',
      slug: 'laptop-gamer-x',
      description: 'GPU dedicada para juegos',
      image: 'https://picsum.photos/seed/prod3/640/480',
      price: 1899,
      stock: 9,
      featured: false,
      categoryId: 'cat-1',
      rating: 4.7,
    },
    {
      id: 'prod-6',
      name: 'Phone Nova 12',
      slug: 'phone-nova-12',
      description: 'Pantalla OLED 120Hz',
      image: 'https://picsum.photos/seed/prod6/640/480',
      price: 899,
      stock: 40,
      featured: true,
      categoryId: 'cat-2',
      rating: 4.7,
    },
    {
      id: 'prod-7',
      name: 'Phone Nova 12 Pro',
      slug: 'phone-nova-12-pro',
      description: 'Triple camara profesional',
      image: 'https://picsum.photos/seed/prod7/640/480',
      price: 1099,
      stock: 29,
      featured: true,
      categoryId: 'cat-2',
      rating: 4.8,
    },
    {
      id: 'prod-11',
      name: 'Headphones ANC Pro',
      slug: 'headphones-anc-pro',
      description: 'Cancelacion activa de ruido',
      image: 'https://picsum.photos/seed/prod11/640/480',
      price: 299,
      stock: 45,
      featured: true,
      categoryId: 'cat-3',
      rating: 4.7,
    },
  ],
};

@Injectable()
export class InMemoryProductCatalogRepository
  implements ProductCatalogRepository
{
  async loadCatalog(): Promise<ProductCatalog> {
    await new Promise((resolve) => setTimeout(resolve, 250));

    return {
      categories: catalog.categories.map((category) => ({ ...category })),
      products: catalog.products.map((product) => ({ ...product })),
    };
  }
}

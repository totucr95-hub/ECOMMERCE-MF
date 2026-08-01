import { Injectable } from '@angular/core';
import {
  ProductCatalog,
  ProductCatalogRepository,
} from '@ecommerce-mf/products-domain-products';

const catalog: ProductCatalog = {
  categories: [
    {
      id: 'cat-1',
      name: 'Decks y pisos',
      slug: 'decks-y-pisos',
      description:
        'Tablas resistentes para terrazas, senderos y zonas humedas.',
    },
    {
      id: 'cat-2',
      name: 'Mobiliario exterior',
      slug: 'mobiliario-exterior',
      description:
        'Muebles durables para parques, jardines y espacios urbanos.',
    },
    {
      id: 'cat-3',
      name: 'Fachadas y cerramientos',
      slug: 'fachadas-y-cerramientos',
      description: 'Soluciones de revestimiento y privacidad para exteriores.',
    },
    {
      id: 'cat-4',
      name: 'Perfiles estructurales',
      slug: 'perfiles-estructurales',
      description:
        'Postes y vigas de madera plastica para proyectos constructivos.',
    },
  ],
  products: [
    {
      id: 'prod-1',
      name: 'Tabla Deck Premium 2,90 m',
      slug: 'tabla-deck-premium-290',
      description:
        'Tabla texturizada y antideslizante para terrazas de alto trafico.',
      image:
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
      price: 189900,
      discountPercentage: 8,
      stock: 64,
      featured: true,
      categoryId: 'cat-1',
      rating: 4.8,
    },
    {
      id: 'prod-2',
      name: 'Deck Macizo Antideslizante',
      slug: 'deck-macizo-antideslizante',
      description: 'Perfil macizo resistente al agua para piscinas y senderos.',
      image:
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80',
      price: 219900,
      stock: 42,
      featured: true,
      categoryId: 'cat-1',
      rating: 4.6,
    },
    {
      id: 'prod-3',
      name: 'Banca Urbana Eco',
      slug: 'banca-urbana-eco',
      description:
        'Banca de tres puestos para parques, conjuntos y zonas comunes.',
      image:
        'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80',
      price: 899000,
      stock: 12,
      featured: true,
      categoryId: 'cat-2',
      rating: 4.7,
    },
    {
      id: 'prod-4',
      name: 'Mesa Picnic Familiar',
      slug: 'mesa-picnic-familiar',
      description: 'Mesa exterior de seis puestos con estructura reforzada.',
      image:
        'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=900&q=80',
      price: 1450000,
      stock: 8,
      featured: true,
      categoryId: 'cat-2',
      rating: 4.9,
    },
    {
      id: 'prod-5',
      name: 'Jardinera Modular',
      slug: 'jardinera-modular',
      description: 'Jardinera decorativa resistente a humedad, sol y plagas.',
      image:
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80',
      price: 329000,
      stock: 25,
      featured: false,
      categoryId: 'cat-2',
      rating: 4.5,
    },
    {
      id: 'prod-6',
      name: 'Panel de Cerramiento Exterior',
      slug: 'panel-cerramiento-exterior',
      description: 'Panel modular para divisiones, cerramientos y privacidad.',
      image:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
      price: 279000,
      discountPercentage: 10,
      stock: 36,
      featured: true,
      categoryId: 'cat-3',
      rating: 4.7,
    },
    {
      id: 'prod-7',
      name: 'Revestimiento de Fachada',
      slug: 'revestimiento-fachada',
      description:
        'Liston decorativo de bajo mantenimiento para muros exteriores.',
      image:
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80',
      price: 174900,
      stock: 58,
      featured: true,
      categoryId: 'cat-3',
      rating: 4.8,
    },
    {
      id: 'prod-8',
      name: 'Poste Estructural 10 x 10',
      slug: 'poste-estructural-10x10',
      description:
        'Poste solido para cercas, pergolas y estructuras exteriores.',
      image:
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80',
      price: 119900,
      stock: 80,
      featured: false,
      categoryId: 'cat-4',
      rating: 4.5,
    },
    {
      id: 'prod-9',
      name: 'Perfil Viga Reforzada',
      slug: 'perfil-viga-reforzada',
      description:
        'Viga de madera plastica para cubiertas y soportes de exterior.',
      image:
        'https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=900&q=80',
      price: 154900,
      stock: 47,
      featured: false,
      categoryId: 'cat-4',
      rating: 4.6,
    },
    {
      id: 'prod-10',
      name: 'Silla Exterior Adirondack',
      slug: 'silla-exterior-adirondack',
      description:
        'Silla ergonomica para terrazas y jardines, libre de mantenimiento.',
      image:
        'https://images.unsplash.com/photo-1598300053650-4e6b56d21432?auto=format&fit=crop&w=900&q=80',
      price: 649000,
      stock: 16,
      featured: false,
      categoryId: 'cat-2',
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

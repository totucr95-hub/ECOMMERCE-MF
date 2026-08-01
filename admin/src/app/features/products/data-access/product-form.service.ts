import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  CurrencyCode,
  ProductCatalogOption,
  ProductFormData,
  ProductStatus,
  ProductVisibility,
} from '../domain/product.models';

@Injectable({ providedIn: 'root' })
export class ProductFormService {
  private readonly responseDelay = 650;

  readonly brands = ['Ingecoplast'];

  readonly categories: ProductCatalogOption[] = [
    { id: 'cat-1', label: 'Decks y pisos' },
    { id: 'cat-2', label: 'Mobiliario exterior' },
    { id: 'cat-3', label: 'Fachadas y cerramientos' },
    { id: 'cat-4', label: 'Perfiles estructurales' },
  ];

  readonly collections = [
    'Temporada 2026',
    'Back to School',
    'Premium',
    'Ofertas',
  ];
  readonly warehouses = ['Bogota Centro', 'Medellin Norte', 'Cali Zona Franca'];

  readonly productsCatalog: ProductCatalogOption[] = [
    { id: 'prod-1', label: 'Tabla Deck Premium 2,90 m' },
    { id: 'prod-3', label: 'Banca Urbana Eco' },
    { id: 'prod-6', label: 'Panel de Cerramiento Exterior' },
    { id: 'prod-8', label: 'Poste Estructural 10 x 10' },
  ];

  loadProductDraft(): Observable<ProductFormData> {
    return of({
      id: 'prod-1',
      name: 'Tabla Deck Premium 2,90 m',
      shortName: 'Deck Premium',
      sku: 'ING-DECK-290',
      slug: 'tabla-deck-premium-290',
      brand: 'Ingecoplast',
      categoryId: 'cat-1',
      secondaryCategoryIds: [],
      collection: 'Temporada 2026',
      tags: ['deck', 'exteriores', 'reciclado'],
      status: ProductStatus.Draft,
      visibility: ProductVisibility.Public,
      shortDescription: 'Tabla texturizada y antideslizante para terrazas.',
      fullDescription:
        'Tabla de madera plastica resistente a humedad, plagas y exposicion solar.',
      specs: 'Largo: 2,90 m, acabado texturizado, uso exterior',
      price: 189900,
      offerPrice: 174900,
      previousPrice: 205000,
      cost: 119000,
      tax: 19,
      currency: CurrencyCode.COP,
      trackInventory: true,
      stock: 64,
      minStock: 10,
      sellWithoutStock: false,
      barcode: '7709990012901',
      warehouse: 'Bogota Centro',
      hasVariants: true,
      variants: [
        {
          color: 'Madera natural',
          size: '2,90 m',
          material: 'Madera plastica',
          capacity: 'N/A',
          sku: 'ING-DECK-290-NAT',
          price: 189900,
          stock: 32,
          image: '',
        },
      ],
      images: [],
      shippingWeight: 8.5,
      shippingHeight: 3,
      shippingWidth: 14,
      shippingLength: 290,
      freeShipping: false,
      seoTitle: 'Tabla Deck Premium | Ingecoplast Colombia',
      seoDescription:
        'Compra tabla deck de madera plastica para terrazas y exteriores.',
      seoKeywords: ['madera plastica', 'deck', 'terrazas'],
      relatedProducts: ['prod-2'],
      crossSellProducts: ['prod-8'],
      upSellProducts: ['prod-6'],
      featured: true,
      isNew: true,
      showOnHome: true,
      allowReviews: true,
      allowReturns: true,
      audit: {
        createdAt: '2026-07-01T10:20:00Z',
        updatedAt: '2026-07-30T14:10:00Z',
        createdBy: 'ana.torres@ingecoplast.co',
        updatedBy: 'pablo.cruz@ingecoplast.co',
      },
    }).pipe(delay(this.responseDelay));
  }

  saveProduct(data: ProductFormData): Observable<ProductFormData> {
    const payload: ProductFormData = {
      ...data,
    };

    return of(payload).pipe(delay(this.responseDelay));
  }
}

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

  readonly brands = [
    'LifeOS',
    'NovaTech',
    'UrbanMove',
    'Andes Home',
    'Fit Pulse',
  ];

  readonly categories: ProductCatalogOption[] = [
    { id: 'cat-electronics', label: 'Electronica' },
    { id: 'cat-home', label: 'Hogar' },
    { id: 'cat-fashion', label: 'Moda' },
    { id: 'cat-sports', label: 'Deportes' },
  ];

  readonly collections = [
    'Temporada 2026',
    'Back to School',
    'Premium',
    'Ofertas',
  ];
  readonly warehouses = ['Bogota Centro', 'Medellin Norte', 'Cali Zona Franca'];

  readonly productsCatalog: ProductCatalogOption[] = [
    { id: 'prd-100', label: 'Auriculares Pro X' },
    { id: 'prd-101', label: 'Smartwatch Fit 5' },
    { id: 'prd-102', label: 'Silla Ergonomica Neo' },
    { id: 'prd-103', label: 'Zapatillas Runner Air' },
    { id: 'prd-104', label: 'Parlante Home Mini' },
  ];

  loadProductDraft(): Observable<ProductFormData> {
    return of({
      id: 'prd-100',
      name: 'Auriculares Pro X',
      shortName: 'Pro X',
      sku: 'AUR-PROX-001',
      slug: 'auriculares-pro-x',
      brand: 'LifeOS',
      categoryId: 'cat-electronics',
      secondaryCategoryIds: ['cat-fashion'],
      collection: 'Temporada 2026',
      tags: ['bluetooth', 'premium'],
      status: ProductStatus.Draft,
      visibility: ProductVisibility.Public,
      shortDescription: 'Audio inmersivo con cancelacion de ruido.',
      fullDescription:
        'Auriculares over-ear con bateria de larga duracion y ecualizacion inteligente.',
      specs: 'Bluetooth 5.4, USB-C, 40h bateria',
      price: 480000,
      offerPrice: 430000,
      previousPrice: 520000,
      cost: 280000,
      tax: 19,
      currency: CurrencyCode.COP,
      trackInventory: true,
      stock: 120,
      minStock: 15,
      sellWithoutStock: false,
      barcode: '7709990012345',
      warehouse: 'Bogota Centro',
      hasVariants: true,
      variants: [
        {
          color: 'Negro',
          size: 'Unico',
          material: 'ABS',
          capacity: 'N/A',
          sku: 'AUR-PROX-BLK',
          price: 480000,
          stock: 75,
          image: '',
        },
      ],
      images: [],
      shippingWeight: 0.42,
      shippingHeight: 20,
      shippingWidth: 18,
      shippingLength: 9,
      freeShipping: true,
      seoTitle: 'Auriculares Pro X | Audio Premium LifeOS',
      seoDescription:
        'Compra Auriculares Pro X con cancelacion de ruido y envio rapido.',
      seoKeywords: ['auriculares', 'cancelacion de ruido', 'audio premium'],
      relatedProducts: ['prd-104'],
      crossSellProducts: ['prd-101'],
      upSellProducts: ['prd-102'],
      featured: true,
      isNew: true,
      showOnHome: true,
      allowReviews: true,
      allowReturns: true,
      audit: {
        createdAt: '2026-07-01T10:20:00Z',
        updatedAt: '2026-07-30T14:10:00Z',
        createdBy: 'ana.torres@lifeos.co',
        updatedBy: 'pablo.cruz@lifeos.co',
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

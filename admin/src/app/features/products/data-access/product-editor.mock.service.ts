import { Injectable } from '@angular/core';
import {
  ProductEditorValue,
  ProductSaveResult,
  ProductStatus,
  ProductVisibility,
} from '../domain/product.models';

@Injectable({ providedIn: 'root' })
export class ProductEditorMockService {
  async loadProduct(): Promise<ProductEditorValue> {
    await this.delay(450);

    return {
      general: {
        name: 'Tabla Deck Premium 2,90 m',
        shortName: 'Deck Premium',
        sku: 'ING-DECK-290',
        slug: 'tabla-deck-premium-290',
        brand: 'Ingecoplast',
        primaryCategory: 'decks-y-pisos',
        secondaryCategories: ['featured'],
        collection: 'Lanzamientos 2026',
        tags: ['deck', 'exteriores', 'reciclado'],
        status: ProductStatus.Active,
        visibility: ProductVisibility.Public,
      },
      description: {
        shortDescription: 'Tabla texturizada y antideslizante para terrazas.',
        fullDescription:
          '<p>Madera plastica resistente a humedad, plagas y exposicion solar.</p>',
        technicalSpecs: 'Largo: 2,90 m\nAcabado: texturizado\nUso: exterior',
      },
      pricing: {
        salePrice: 189900,
        offerPrice: 174900,
        previousPrice: 205000,
        cost: 119000,
        vat: 19,
        currency: 'COP',
      },
      inventory: {
        trackInventory: true,
        stock: 64,
        minStock: 10,
        allowBackorder: false,
        barcode: '7709990012901',
        warehouse: 'Principal',
      },
      variants: {
        hasVariants: true,
        items: [
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
          {
            color: 'Gris grafito',
            size: '2,90 m',
            material: 'Madera plastica',
            capacity: 'N/A',
            sku: 'ING-DECK-290-GRI',
            price: 189900,
            stock: 32,
            image: '',
          },
        ],
      },
      images: {
        primaryImage: '',
        gallery: [],
      },
      shipping: {
        weight: 8.5,
        height: 3,
        width: 14,
        length: 290,
        freeShipping: false,
      },
      seo: {
        metaTitle: 'Tabla Deck Premium | Ingecoplast Colombia',
        metaDescription:
          'Compra tabla deck de madera plastica para terrazas y exteriores.',
        keywords: ['madera plastica', 'deck', 'terrazas'],
      },
      related: {
        relatedProducts: ['Deck Macizo Antideslizante'],
        crossSell: ['Poste Estructural 10 x 10'],
        upSell: ['Panel de Cerramiento Exterior'],
      },
      configuration: {
        featured: true,
        isNew: true,
        showInHome: true,
        allowReviews: true,
        allowReturns: true,
      },
      audit: {
        createdAt: '2026-07-20 09:25',
        updatedAt: '2026-07-31 11:05',
        createdBy: 'admin@ingecoplast.co',
        updatedBy: 'manager@ingecoplast.co',
      },
    };
  }

  async saveProduct(payload: ProductEditorValue): Promise<ProductSaveResult> {
    await this.delay(800);

    const isValidPayload = Boolean(payload.general.name && payload.general.sku);
    if (!isValidPayload) {
      return {
        ok: false,
        id: '',
        message: 'El payload recibido es invalido.',
      };
    }

    return {
      ok: true,
      id: payload.general.sku,
      message: 'Producto guardado correctamente.',
    };
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}

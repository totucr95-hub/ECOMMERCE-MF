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
        name: 'Smart TV 55 OLED',
        shortName: 'TV OLED 55',
        sku: 'TV-OLED-55-2026',
        slug: 'smart-tv-55-oled',
        brand: 'LG',
        primaryCategory: 'electronics',
        secondaryCategories: ['home', 'featured'],
        collection: 'Lanzamientos 2026',
        tags: ['4k', 'oled', 'smarttv'],
        status: ProductStatus.Active,
        visibility: ProductVisibility.Public,
      },
      description: {
        shortDescription: 'Televisor OLED 55 pulgadas con IA integrada.',
        fullDescription:
          '<p>Disfruta una experiencia visual premium con negros profundos y sonido inmersivo.</p>',
        technicalSpecs: 'Resolucion: 4K\nHDMI: 4 puertos\nSistema: webOS',
      },
      pricing: {
        salePrice: 4599000,
        offerPrice: 4299000,
        previousPrice: 4999000,
        cost: 3200000,
        vat: 19,
        currency: 'COP',
      },
      inventory: {
        trackInventory: true,
        stock: 42,
        minStock: 8,
        allowBackorder: false,
        barcode: '7701234567891',
        warehouse: 'Principal',
      },
      variants: {
        hasVariants: true,
        items: [
          {
            color: 'Negro',
            size: '55',
            material: 'OLED',
            capacity: '128GB',
            sku: 'TV-OLED-55-BLK',
            price: 4599000,
            stock: 22,
            image: '',
          },
          {
            color: 'Gris',
            size: '55',
            material: 'OLED',
            capacity: '128GB',
            sku: 'TV-OLED-55-GRY',
            price: 4599000,
            stock: 20,
            image: '',
          },
        ],
      },
      images: {
        primaryImage: '',
        gallery: [],
      },
      shipping: {
        weight: 14,
        height: 78,
        width: 124,
        length: 18,
        freeShipping: true,
      },
      seo: {
        metaTitle: 'Smart TV 55 OLED | LifeOS Store',
        metaDescription:
          'Compra Smart TV OLED 55 con envio rapido y garantia oficial.',
        keywords: ['smart tv', 'oled', '4k', 'televisor'],
      },
      related: {
        relatedProducts: ['Barra de sonido 7.1', 'Soporte premium TV'],
        crossSell: ['Cable HDMI 8K'],
        upSell: ['Smart TV OLED 65'],
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
        createdBy: 'admin@lifeos.co',
        updatedBy: 'manager@lifeos.co',
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

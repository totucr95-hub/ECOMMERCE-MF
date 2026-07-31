export enum ProductStatus {
  Draft = 'draft',
  Active = 'active',
  Inactive = 'inactive',
}

export enum ProductVisibility {
  Public = 'public',
  Private = 'private',
  Hidden = 'hidden',
}

export enum CurrencyCode {
  COP = 'COP',
  USD = 'USD',
  EUR = 'EUR',
}

export interface ProductVariant {
  color: string;
  size: string;
  material: string;
  capacity: string;
  sku: string;
  price: number;
  stock: number;
  image: string;
}

export interface ProductImage {
  id: string;
  name: string;
  url: string;
  isPrimary: boolean;
}

export interface ProductAudit {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface ProductCatalogOption {
  id: string;
  label: string;
}

export interface ProductFormData {
  id?: string;
  name: string;
  shortName: string;
  sku: string;
  slug: string;
  brand: string;
  categoryId: string;
  secondaryCategoryIds: string[];
  collection: string;
  tags: string[];
  status: ProductStatus;
  visibility: ProductVisibility;
  shortDescription: string;
  fullDescription: string;
  specs: string;
  price: number;
  offerPrice: number | null;
  previousPrice: number | null;
  cost: number;
  tax: number;
  currency: CurrencyCode;
  trackInventory: boolean;
  stock: number;
  minStock: number;
  sellWithoutStock: boolean;
  barcode: string;
  warehouse: string;
  hasVariants: boolean;
  variants: ProductVariant[];
  images: ProductImage[];
  shippingWeight: number;
  shippingHeight: number;
  shippingWidth: number;
  shippingLength: number;
  freeShipping: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  relatedProducts: string[];
  crossSellProducts: string[];
  upSellProducts: string[];
  featured: boolean;
  isNew: boolean;
  showOnHome: boolean;
  allowReviews: boolean;
  allowReturns: boolean;
  audit: ProductAudit;
}

export interface ProductEditorValue {
  general: {
    name: string;
    shortName: string;
    sku: string;
    slug: string;
    brand: string;
    primaryCategory: string;
    secondaryCategories: string[];
    collection: string;
    tags: string[];
    status: ProductStatus;
    visibility: ProductVisibility;
  };
  description: {
    shortDescription: string;
    fullDescription: string;
    technicalSpecs: string;
  };
  pricing: {
    salePrice: number;
    offerPrice: number;
    previousPrice: number;
    cost: number;
    vat: number;
    currency: string;
  };
  inventory: {
    trackInventory: boolean;
    stock: number;
    minStock: number;
    allowBackorder: boolean;
    barcode: string;
    warehouse: string;
  };
  variants: {
    hasVariants: boolean;
    items: ProductVariant[];
  };
  images: {
    primaryImage: string;
    gallery: string[];
  };
  shipping: {
    weight: number;
    height: number;
    width: number;
    length: number;
    freeShipping: boolean;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  related: {
    relatedProducts: string[];
    crossSell: string[];
    upSell: string[];
  };
  configuration: {
    featured: boolean;
    isNew: boolean;
    showInHome: boolean;
    allowReviews: boolean;
    allowReturns: boolean;
  };
  audit: ProductAudit;
}

export interface ProductSaveResult {
  ok: boolean;
  id: string;
  message: string;
}

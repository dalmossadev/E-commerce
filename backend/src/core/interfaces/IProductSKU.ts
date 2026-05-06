// src/core/interfaces/IProductSKU.ts

import { ProductBadge } from "@core/domain/Product";


export type ProductData = {
  id?: number;
  name: string;
  brand: string;
  categoryId: number;
  basePrice: number;
  attributes: {
    colors: string[];
    sizes: string[];
  };
  description?: string;
  originalPrice?: number | null;
  badge?: ProductBadge | null;
  specs?: Record<string, any>;
  featured?: boolean;
  initialStock?: number;
};

export type ProductVariant = {
  sku: string;
  productId: number;
  color: string;
  size: string;
  price: number;
  stock: number;
};

export type SkuInput = {
  name: string;
  brand: string;
  categoryId: number;
  color: string;
  size: string;
  uniqueId?: string; // opcional (para garantir unicidade)
};

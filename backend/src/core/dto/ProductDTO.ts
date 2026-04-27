import { ProductBadge, ProductCategory } from '@core/domain/Product';

export interface CreateProductDTO {
  name: string;
  brand: string;
  category: ProductCategory;
  basePrice: number;
  attributes: {
    colors: string[];
    sizes: string[];
  };
  description?: string;
  originalPrice?: number | null;
  badge?: ProductBadge | null;
  specs?: Record<string, unknown>;
  featured?: boolean;
  initialStock?: number;
}

export interface ProductResponseDTO {
  id: number;
  name: string;
  brand: string;
  category: ProductCategory;
  basePrice: number;
  description?: string;
  originalPrice?: number | null;
  badge?: ProductBadge | null;
  specs?: Record<string, unknown>;
  featured: boolean;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariantDTO {
  id: number;
  sku: string;
  productId: number;
  color: string;
  size: string;
  price: number;
  stock: number;
}

export interface ListProductsQueryDTO {
  page?: number;
  limit?: number;
  category?: ProductCategory;
  featured?: boolean;
  search?: string;
}
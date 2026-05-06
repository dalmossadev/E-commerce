import { ProductBadge } from '@core/domain/Product';
import { CategoryResponseDTO } from './CategoryDTO';

export interface CreateProductDTO {
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
  specs?: Record<string, unknown>;
  featured?: boolean;
  initialStock?: number;
}

export interface ProductResponseDTO {
  id: number;
  sku?: string;
  name: string;
  brand?: string | null;
  categoryId: number;
  category?: CategoryResponseDTO;
  basePrice?: number | null;
  description?: string;
  originalPrice?: number | null;
  badge?: ProductBadge | null;
  specs?: Record<string, unknown>;
  featured: boolean;
  inStock: boolean;
  imageName: string;            // Apenas o filename: "produto-6.webp"
  createdAt: Date;
  updatedAt: Date;
  variants?: ProductVariantDTO[];
}

export interface ProductVariantDTO {
  id: number;
  sku: string;
  productId: number;
  color: string;
  size: string;
  price: number;
  stock: number;
  fulfillmentType?: string;
}

export interface ListProductsQueryDTO {
  page?: number;
  limit?: number;
  categoryId?: number;
  featured?: boolean;
  search?: string;
}
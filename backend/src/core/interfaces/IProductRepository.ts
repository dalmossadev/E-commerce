import { Product } from '../domain/Product';
import { ProductCategory } from '../domain/Product';
import { ProductVariant } from '../domain/ProductVariant';

export interface ProductQueryOptions {
  page?: number;
  limit?: number;
  category?: ProductCategory;
  featured?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'basePrice' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IProductRepository {
  save(product: Product): Promise<Product>;
  findBySku(sku: string): Promise<Product | null>;
  findAll(options?: ProductQueryOptions): Promise<PaginatedResult<Product>>;
  findById(id: number): Promise<Product | undefined>;
  update(product: Product): Promise<Product>;
  delete(id: number): Promise<void>;
  search(query: string): Promise<Product[]>;
  findByCategory(category: ProductCategory): Promise<Product[]>;
  count(category?: ProductCategory): Promise<number>;
  findVariantById(variantId: number): Promise<ProductVariant | undefined>;
  updateVariant(variant: ProductVariant): Promise<ProductVariant>;
  updateImage(sku: string, imageUrl: string): Promise<void>;
}
/**
 * @file src/components/features/ProductsData.tsx
 * @description Server Component que busca produtos da API do backend.
 */
import { API_BASE_URL } from '@/constants/site-config';

export interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  originalPrice?: number;
  imageName: string;
  altText: string;
  category: string;
  badge?: string;
  inStock: boolean;
  featured: boolean;
  specs?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchProducts(options?: {
  category?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
  page?: number;
}): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  if (options?.category) params.set('category', options.category);
  if (options?.featured !== undefined) params.set('featured', String(options.featured));
  if (options?.search) params.set('search', options.search);
  if (options?.limit) params.set('limit', String(options.limit));
  if (options?.page) params.set('page', String(options.page));

  const queryString = params.toString();
  const url = `${API_BASE_URL}/api/v1/products${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }
    return await response.json();
  } catch {
    return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  }
}

export async function fetchProductById(id: number): Promise<Product | null> {
  const url = `${API_BASE_URL}/api/v1/products/${id}`;

  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
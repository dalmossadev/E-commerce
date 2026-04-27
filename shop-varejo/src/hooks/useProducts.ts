'use client';

import { useState, useEffect, useCallback } from 'react';

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

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UseProductsOptions {
  category?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
  page?: number;
}

export function useProducts(options?: UseProductsOptions) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options?.category) params.set('category', options.category);
      if (options?.featured !== undefined) params.set('featured', String(options.featured));
      if (options?.search) params.set('search', options.search);
      if (options?.limit) params.set('limit', String(options.limit));
      if (options?.page) params.set('page', String(options.page));

      const queryString = params.toString();
      const url = `/api/products${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');

      const data: ProductsResponse = await response.json();
      setProducts(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [options?.category, options?.featured, options?.search, options?.limit, options?.page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
}

export function useProduct(sku: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!sku) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/products/${sku}`);
      if (!response.ok) throw new Error('Failed to fetch product');

      const data = await response.json();
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [sku]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
}
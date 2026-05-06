import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/interfaces';
import { productService } from '@/lib/api/services/productService';

export function useProducts(initialOptions: { page?: number; limit?: number; category?: string; search?: string } = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState(initialOptions);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await productService.list(options);
      setProducts(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (data: any) => {
    const result = await productService.create(data);
    await fetchProducts();
    return result;
  };

  const updateProduct = async (sku: string, data: any) => {
    const result = await productService.update(sku, data);
    await fetchProducts();
    return result;
  };

  const deleteProduct = async (sku: string) => {
    await productService.delete(sku);
    await fetchProducts();
  };

  const uploadImage = async (sku: string, file: File) => {
    const imageUrl = await productService.uploadImage(sku, file);
    await fetchProducts();
    return imageUrl;
  };

  return {
    products,
    total,
    totalPages,
    loading,
    error,
    options,
    setOptions,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage
  };
}
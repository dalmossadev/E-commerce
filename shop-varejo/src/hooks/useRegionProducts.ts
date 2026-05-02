/**
 * @file src/hooks/useRegionProducts.ts
 * @description Hook para buscar produtos com disponibilidade regional.
 * Implementa Task 04 (Pronta Entrega) - Fullstack logic.
 *
 * Regiões suportadas: salvador, simoes_filho
 * Backend: GET /api/v1/region/:region
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '@/constants/site-config';

interface RegionProduct {
  product: any;
  availableInStock: boolean;
  region: string;
  estimatedDeliveryHours: number;
}

interface UseRegionProductsReturn {
  products: RegionProduct[];
  isLoading: boolean;
  error: string | null;
  checkProntaEntrega: (sku: string, region?: string) => Promise<boolean>;
}

export function useRegionProducts(region: string = 'salvador') {
  const [products, setProducts] = useState<RegionProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!region) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const normalizedRegion = region.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const response = await fetch(`${API_BASE_URL}/api/v1/region/${normalizedRegion}`, {
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error('Falha ao buscar produtos por região');
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [region]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const checkProntaEntrega = useCallback(async (sku: string, regionParam?: string): Promise<boolean> => {
    const targetRegion = regionParam || region;
    const normalizedRegion = targetRegion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/region/${normalizedRegion}/pronta-entrega/${sku}`,
        { cache: 'no-store' }
      );
      
      if (!response.ok) return false;
      
      const data = await response.json();
      return data.isProntaEntrega || false;
    } catch {
      return false;
    }
  }, [region]);

  return {
    products,
    isLoading,
    error,
    checkProntaEntrega,
  };
}

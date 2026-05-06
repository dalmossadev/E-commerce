'use client';

import { useState, useEffect, useCallback } from 'react';
import { Address } from './useAddresses';

export interface Supplier {
  id: number;
  companyName: string;
  tradeName?: string;
  cnpj: string;
  contactEmail: string;
  phone?: string;
  website?: string;
  categoryId: number;
  category?: { id: number; name: string; slug: string };
  status: 'ACTIVE' | 'INACTIVE';
  addresses?: Address[];
  createdAt: string;
  updatedAt: string;
}

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/suppliers');
      if (!response.ok) throw new Error('Falha ao buscar fornecedores');

      const data = await response.json();
      setSuppliers(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  const createSupplier = async (data: Partial<Supplier>) => {
    const response = await fetch('/api/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao criar fornecedor');
    }
    await fetchSuppliers();
    return await response.json();
  };

  const updateSupplier = async (id: number, data: Partial<Supplier>) => {
    const response = await fetch(`/api/suppliers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao atualizar fornecedor');
    }
    await fetchSuppliers();
    return await response.json();
  };

  const deleteSupplier = async (id: number) => {
    const response = await fetch(`/api/suppliers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Falha ao excluir fornecedor');
    await fetchSuppliers();
  };

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  return {
    suppliers,
    loading,
    error,
    refetch: fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  };
}

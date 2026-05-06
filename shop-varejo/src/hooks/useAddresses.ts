'use client';

import { useState, useCallback } from 'react';

export interface Address {
  id: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  isMain: boolean;
  tag?: string;
  customerId?: number;
  supplierId?: number;
}

export function useAddresses() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomerAddresses = async (customerId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/addresses/customer/${customerId}`);
      if (!response.ok) throw new Error('Falha ao buscar endereços do cliente');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchSupplierAddresses = async (supplierId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/addresses/supplier/${supplierId}`);
      if (!response.ok) throw new Error('Falha ao buscar endereços do fornecedor');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createAddress = async (data: Partial<Address>) => {
    setLoading(true);
    try {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Falha ao criar endereço');
      return await response.json();
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (id: number, data: Partial<Address>) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Falha ao atualizar endereço');
      return await response.json();
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Falha ao excluir endereço');
    } finally {
      setLoading(false);
    }
  };

  const setMainAddress = async (id: number, ownerId: number, ownerType: 'CUSTOMER' | 'SUPPLIER') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerId, ownerType }),
      });
      if (!response.ok) throw new Error('Falha ao definir endereço principal');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchCustomerAddresses,
    fetchSupplierAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setMainAddress,
  };
}

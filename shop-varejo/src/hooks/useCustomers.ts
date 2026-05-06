'use client';

import { useState, useCallback, useEffect } from 'react';
import { Customer } from '@/types/interfaces';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/customers');
      if (!response.ok) throw new Error('Falha ao buscar clientes');
      const data = await response.json();
      setCustomers(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar clientes');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCustomer = async (data: Partial<Customer>) => {
    setLoading(true);
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Falha ao criar cliente');
      const result = await response.json();
      await fetchCustomers();
      return result;
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer = async (id: number, data: Partial<Customer>) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Falha ao atualizar cliente');
      const result = await response.json();
      await fetchCustomers();
      return result;
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Falha ao excluir cliente');
      await fetchCustomers();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers,
    loading,
    error,
    refetch: fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
}

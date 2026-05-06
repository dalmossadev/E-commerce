import { useState, useEffect, useCallback } from 'react';
import { orderService } from '@/lib/api/services/orderService';

export function useOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await orderService.list();
      setOrders(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (id: number, status: string) => {
    await orderService.updateStatus(id, status);
    await fetchOrders();
  };

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    updateOrderStatus
  };
}

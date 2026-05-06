import { useState, useEffect, useCallback } from 'react';
import { inventoryService, InventoryItem } from '@/lib/api/services/inventoryService';

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await inventoryService.list();
      setItems(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estoque');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const updateStock = async (variantId: number, quantity: number) => {
    await inventoryService.updateStock(variantId, quantity);
    await fetchInventory();
  };

  return {
    items,
    loading,
    error,
    refetch: fetchInventory,
    updateStock
  };
}

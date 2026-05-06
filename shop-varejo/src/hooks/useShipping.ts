import { useState, useEffect, useCallback } from 'react';
import { shippingService, ShippingRule } from '@/lib/api/services/shippingService';

export function useShipping() {
  const [rules, setRules] = useState<ShippingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await shippingService.listRules();
      setRules(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar regras de frete');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const saveRule = async (rule: Partial<ShippingRule>) => {
    await shippingService.saveRule(rule);
    await fetchRules();
  };

  return {
    rules,
    loading,
    error,
    refetch: fetchRules,
    saveRule
  };
}

import { API_BASE_URL } from '@/constants/site-config';

export interface ShippingRule {
  id?: number;
  name: string;
  zipStart: string;
  zipEnd: string;
  price: number;
  minAmountForFreeShipping?: number;
  estimatedDays: number;
  active: boolean;
}

export interface ShippingResult {
  price: number;
  estimatedDays: number;
  ruleName: string;
  freeShippingThreshold?: number;
}

export const shippingService = {
  async calculate(zipCode: string, amount: number): Promise<ShippingResult> {
    const response = await fetch(`${API_BASE_URL}/api/v1/shipping/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zipCode, amount }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao calcular frete');
    }
    return response.json();
  },

  async listRules(): Promise<ShippingRule[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/shipping/rules`);
    if (!response.ok) throw new Error('Falha ao buscar regras de frete');
    return response.json();
  },

  async saveRule(rule: Partial<ShippingRule>): Promise<ShippingRule> {
    const response = await fetch(`${API_BASE_URL}/api/v1/shipping/rules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rule),
    });
    if (!response.ok) throw new Error('Erro ao salvar regra de frete');
    return response.json();
  }
};

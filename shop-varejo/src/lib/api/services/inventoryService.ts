import { API_BASE_URL } from '@/constants/site-config';

export interface InventoryItem {
  id: number;
  sku: string;
  productId: number;
  color: string;
  size: string;
  stock: number;
  inStock: boolean;
  fulfillmentType: 'IN_STOCK' | 'ON_DEMAND';
  product?: {
    name: string;
    brand: string;
    imageName: string;
  };
}

export const inventoryService = {
  async list(): Promise<InventoryItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/inventory`, {
      headers: { 'Cache-Control': 'no-cache' }
    });
    if (!response.ok) throw new Error('Falha ao buscar estoque');
    return response.json();
  },

  async updateStock(variantId: number, quantity: number): Promise<InventoryItem> {
    const response = await fetch(`${API_BASE_URL}/api/v1/inventory/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variantId, quantity }),
    });
    if (!response.ok) throw new Error('Erro ao atualizar estoque');
    return response.json();
  }
};

import { API_BASE_URL } from '@/constants/site-config';

export const orderService = {
  async list(): Promise<any[]> {
    const response = await fetch(`/api/orders`);
    if (!response.ok) throw new Error('Falha ao buscar pedidos');
    return response.json();
  },

  async updateStatus(id: number, status: string): Promise<void> {
    const response = await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Erro ao atualizar status do pedido');
  }
};

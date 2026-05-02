'use server';

import { OrderManager } from '@/modules/order-controller';

export async function cancelOrderAction(orderId: number) {
  try {
    const manager = new OrderManager();
    const order = await manager.cancel(orderId);

    return { success: true, data: order };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao cancelar pedido',
    };
  }
}

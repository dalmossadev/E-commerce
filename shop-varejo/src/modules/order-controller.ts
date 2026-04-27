// src/modules/order-controller.ts
import { OrderStatus, PaymentMethod } from '../types/interfaces';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const ENDPOINT = `${API_BASE_URL}/api/v1/orders`;

export interface CreateOrderItemDTO {
  variantId: number;
  sku: string;
  productName: string;
  color?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
  fulfillmentType: string;
}

export interface CreateOrderDTO {
  customerId?: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress?: string;
  items: CreateOrderItemDTO[];
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
}

export interface ApplyDiscountDTO {
  discountAmount: number;
}

export interface OrderQueryDTO {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  customerId?: number;
}

export interface OrderResponseDTO {
  id: number;
  customerId?: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress?: string;
  items: Array<{
    id: number;
    variantId: number;
    sku: string;
    productName: string;
    color?: string;
    size?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    fulfillmentType: string;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export class OrderManager {
  async getAll(query?: OrderQueryDTO): Promise<OrderResponseDTO[]> {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const url = params.toString() ? `${ENDPOINT}?${params}` : ENDPOINT;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao buscar pedidos');
    return response.json();
  }

  async getById(id: number): Promise<OrderResponseDTO | null> {
    const response = await fetch(`${ENDPOINT}/${id}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Erro ao buscar pedido');
    return response.json();
  }

  async create(data: CreateOrderDTO): Promise<OrderResponseDTO> {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao criar pedido');
    return response.json();
  }

  async updateStatus(id: number, data: UpdateOrderStatusDTO): Promise<OrderResponseDTO> {
    const response = await fetch(`${ENDPOINT}/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao atualizar status do pedido');
    return response.json();
  }

  async cancel(id: number): Promise<OrderResponseDTO> {
    const response = await fetch(`${ENDPOINT}/${id}/cancel`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Erro ao cancelar pedido');
    return response.json();
  }

  async applyDiscount(id: number, data: ApplyDiscountDTO): Promise<OrderResponseDTO> {
    const response = await fetch(`${ENDPOINT}/${id}/discount`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao aplicar desconto');
    return response.json();
  }
}

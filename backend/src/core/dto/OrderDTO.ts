import { OrderStatus, PaymentMethod } from '@core/domain/Order';

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
  createdAt: Date;
  updatedAt: Date;
}
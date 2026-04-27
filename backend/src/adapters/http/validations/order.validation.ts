import { z } from 'zod';
import { OrderStatus, PaymentMethod } from '@core/domain/Order';

export const createOrderItemSchema = z.object({
  variantId: z.number().min(1, 'Variant ID is required'),
  sku: z.string().min(1, 'SKU is required'),
  productName: z.string().min(1, 'Product name is required'),
  color: z.string().optional(),
  size: z.string().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price cannot be negative'),
  fulfillmentType: z.string()
});

export const createOrderSchema = z.object({
  customerId: z.number().optional(),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Invalid email').or(z.string().min(1, 'Customer email is required')),
  customerPhone: z.string().min(1, 'Customer phone is required'),
  shippingAddress: z.string().optional(),
  items: z.array(createOrderItemSchema).min(1, 'Order must have at least one item'),
  paymentMethod: z.enum([PaymentMethod.CREDIT_CARD, PaymentMethod.DEBIT_CARD, PaymentMethod.PIX, PaymentMethod.BOLETO]).optional(),
  notes: z.string().optional()
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([OrderStatus.PENDING, OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED])
});

export const applyDiscountSchema = z.object({
  discountAmount: z.number().min(0, 'Discount cannot be negative')
});
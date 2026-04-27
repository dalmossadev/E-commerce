import { z } from 'zod';
import { PurchaseStatus } from '@core/domain/Purchase';

export const createPurchaseItemSchema = z.object({
  variantId: z.number().int().positive('Variant ID is required'),
  sku: z.string().min(1, 'SKU is required'),
  productName: z.string().min(1, 'Product name is required'),
  color: z.string().optional(),
  size: z.string().optional(),
  quantity: z.number().int().positive('Quantity must be positive'),
  unitCost: z.number().int().positive('Unit cost must be positive (in cents)')
});

export const createPurchaseSchema = z.object({
  supplierId: z.number().int().positive('Supplier ID is required'),
  supplierName: z.string().min(1, 'Supplier name is required'),
  items: z.array(createPurchaseItemSchema).min(1, 'At least one item is required'),
  notes: z.string().optional(),
  expectedDeliveryDate: z.string().datetime().optional()
});

export const updatePurchaseSchema = z.object({
  status: z.enum([
    PurchaseStatus.PENDING, 
    PurchaseStatus.ORDERED, 
    PurchaseStatus.SHIPPED, 
    PurchaseStatus.RECEIVED, 
    PurchaseStatus.CANCELLED
  ]).optional(),
  trackingNumber: z.string().optional(),
  notes: z.string().optional()
});

export const receiveInventorySchema = z.object({
  items: z.array(z.object({
    variantId: z.number().int().positive('Variant ID is required'),
    quantity: z.number().int().positive('Quantity must be positive')
  })).min(1, 'At least one item is required')
});
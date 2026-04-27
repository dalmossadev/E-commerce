import { z } from 'zod';
import { LeadStatus } from '@core/domain/Lead';

export const createLeadSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  customerPhone: z.string().min(1, 'Customer phone is required'),
  customerEmail: z.string().email().optional().or(z.literal('')),
  productId: z.number().optional(),
  variantId: z.number().optional(),
  notes: z.string().optional()
});

export const updateLeadSchema = z.object({
  status: z.enum([LeadStatus.PENDING, LeadStatus.CONFIRMED, LeadStatus.REJECTED]).optional(),
  notes: z.string().optional()
});
import { z } from 'zod';
import { LeadStatus } from '@core/domain/Lead';

export const createLeadSchema = z.object({
  sku: z.string().optional().or(z.literal('')).transform(val => val || ''),
  customerName: z.string().min(1, 'Nome do cliente é obrigatório'),
  customerPhone: z.string().min(1, 'Telefone do cliente é obrigatório'),
  customerEmail: z.string().email().optional().or(z.literal('')),
  productId: z.number().optional(),
  variantId: z.number().optional(),
  notes: z.string().optional()
});

export const updateLeadSchema = z.object({
  status: z.enum([LeadStatus.PENDING, LeadStatus.CONFIRMED, LeadStatus.REJECTED]).optional(),
  notes: z.string().optional()
});
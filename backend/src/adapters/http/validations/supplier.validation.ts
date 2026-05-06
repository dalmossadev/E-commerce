import { z } from 'zod';

export const createSupplierSchema = z.object({
  companyName: z.string().min(2, "Nome da empresa é obrigatório"),
  tradeName: z.string().optional(),
  cnpj: z.string().length(14, "CNPJ deve ter 14 números").or(z.string().length(18, "CNPJ inválido")),
  contactEmail: z.string().email("Email inválido"),
  categoryId: z.number().int().positive("Categoria é obrigatória"),
  phone: z.string().optional(),
  website: z.string().url("Website inválido").optional().or(z.literal('')),
  address: z.record(z.string(), z.any()).optional(),
});

export const updateSupplierSchema = z.object({
  companyName: z.string().min(2).optional(),
  tradeName: z.string().optional(),
  contactEmail: z.string().email().optional(),
  categoryId: z.number().int().positive().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  address: z.record(z.string(), z.any()).optional(),
});
import { z } from 'zod';

export const createSupplierSchema = z.object({
  body: z.object({
    companyName: z.string().min(2, "Nome da empresa é obrigatório"),
    cnpj: z.string().length(18, "CNPJ inválido"),
    contactEmail: z.string().email("Email inválido"),
    category: z.string().min(1, "Categoria é obrigatória"),
    phone: z.string().optional(),
    address: z.string().optional()
  })
});

export const updateSupplierSchema = z.object({
  body: z.object({
    companyName: z.string().min(2).optional(),
    contactEmail: z.string().email().optional(),
    category: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional()
  })
});
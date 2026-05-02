import { z } from 'zod';

export const createCustomerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(255),
  cpf: z.string().min(11, 'CPF is required').max(14),
  phone: z.string().min(1, 'Phone is required').max(20),
  address: z.record(z.string(), z.any()).optional(),
});

export const updateCustomerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(255).optional(),
  cpf: z.string().min(11, 'CPF is required').max(14).optional(),
  phone: z.string().min(1, 'Phone is required').max(20).optional(),
  address: z.record(z.string(), z.any()).optional(),
});

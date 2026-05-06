import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  slug: z.string().min(2, "Slug é obrigatório").regex(/^[a-z0-9-]+$/, "Slug inválido"),
  description: z.string().optional(),
  type: z.enum(['PRODUCT', 'SUPPLIER']),
  parentId: z.number().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
  parentId: z.number().optional(),
});

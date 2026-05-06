import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  brand: z.string().min(2, "A marca é obrigatória"),
  categoryId: z.number().int().positive("A categoria é obrigatória"),
  basePrice: z.number().positive("O preço deve ser maior que zero"),
  attributes: z.object({
    colors: z.array(z.string()).nonempty("Forneça ao menos uma cor"),
    sizes: z.array(z.string()).nonempty("Forneça ao menos um tamanho")
  }),
  description: z.string().optional(),
  originalPrice: z.number().positive().nullable().optional(),
  badge: z.string().nullable().optional(),
  specs: z.record(z.string(), z.any()).optional(),
  featured: z.boolean().optional(),
  initialStock: z.number().int().min(0).optional()
});

export const updateProductSchema = z.object({
  name: z.string().min(3).optional(),
  brand: z.string().min(2).optional(),
  categoryId: z.number().int().positive().optional(),
  basePrice: z.number().positive().optional(),
  originalPrice: z.number().positive().nullable().optional(),
  badge: z.string().nullable().optional(),
  description: z.string().optional(),
  featured: z.boolean().optional(),
  variants: z.array(z.object({
    sku: z.string(),
    price: z.number().positive().optional(),
    stock: z.number().int().min(0).optional()
  })).optional()
});
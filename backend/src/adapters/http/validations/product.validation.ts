import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
    brand: z.string().min(2, "A marca é obrigatória"),
    category: z.string(),
    basePrice: z.number().positive("O preço deve ser maior que zero"),
    attributes: z.object({
      colors: z.array(z.string()).nonempty("Forneça ao menos uma cor"),
      sizes: z.array(z.string()).nonempty("Forneça ao menos um tamanho")
    })
  })
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    brand: z.string().min(2).optional(),
    category: z.string().optional(),
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
  })
});
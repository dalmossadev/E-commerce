import { z } from 'zod';

export const createCampaignSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(50),
  messageTemplate: z.string().min(1, 'Message template is required'),
  isActive: z.boolean().optional(),
  startDate: z.string().datetime().optional().or(z.date().optional()),
  endDate: z.string().datetime().optional().or(z.date().optional()),
  targetUrl: z.string().url().optional().or(z.literal('')),
});

export const updateCampaignSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(50).optional(),
  messageTemplate: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
  startDate: z.string().datetime().optional().or(z.date().optional()),
  endDate: z.string().datetime().optional().or(z.date().optional()),
  targetUrl: z.string().url().optional().or(z.literal('')),
});

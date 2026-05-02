import { z } from 'zod';

export const createSettingsSchema = z.object({
  key: z.string().min(1, 'Key is required').max(50),
  value: z.string().min(1, 'Value is required'),
});

export const updateSettingsSchema = z.object({
  key: z.string().min(1).max(50).optional(),
  value: z.string().min(1).optional(),
});

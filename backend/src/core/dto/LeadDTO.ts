import { LeadStatus } from '@core/domain/Lead';

export interface CreateLeadDTO {
  sku: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  productId?: number;
  variantId?: number;
  notes?: string;
  userId?: number;
}

export interface UpdateLeadDTO {
  status?: LeadStatus;
  notes?: string;
}

export interface LeadQueryDTO {
  page?: number;
  limit?: number;
  status?: LeadStatus;
  sku?: string;
  search?: string;
}

export interface LeadResponseDTO {
  id: number;
  sku: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  status: LeadStatus;
  notes?: string;
  productId?: number;
  variantId?: number;
  createdAt: Date;
  updatedAt: Date;
}
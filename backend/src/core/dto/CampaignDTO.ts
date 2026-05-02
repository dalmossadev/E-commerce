import { Campaign } from '@core/domain/Campaign';

export interface CreateCampaignDTO {
  name: string;
  slug: string;
  messageTemplate: string;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
  targetUrl?: string;
}

export interface UpdateCampaignDTO {
  name?: string;
  slug?: string;
  messageTemplate?: string;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
  targetUrl?: string;
}

export interface CampaignQueryDTO {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}

export interface CampaignResponseDTO {
  id: number;
  name: string;
  slug: string;
  messageTemplate: string;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  targetUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

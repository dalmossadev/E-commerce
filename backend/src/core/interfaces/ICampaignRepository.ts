import { Campaign } from '@core/domain/Campaign';
import { CampaignQueryDTO } from '@core/dto/CampaignDTO';

export interface ICampaignRepository {
  save(campaign: Campaign): Promise<Campaign>;
  findById(id: number): Promise<Campaign | null>;
  findAll(query?: CampaignQueryDTO): Promise<{ data: Campaign[]; total: number; page: number; limit: number; totalPages: number }>;
  update(campaign: Campaign): Promise<Campaign>;
  delete(id: number): Promise<void>;
  findBySlug(slug: string): Promise<Campaign | null>;
}

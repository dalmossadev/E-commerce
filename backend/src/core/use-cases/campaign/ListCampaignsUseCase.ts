import { Campaign } from '../../domain/Campaign';
import { ICampaignRepository } from '../../interfaces/ICampaignRepository';
import { CampaignQueryDTO } from '../../dto/CampaignDTO';

export class ListCampaignsUseCase {
  constructor(private campaignRepository: ICampaignRepository) {}

  async execute(query?: CampaignQueryDTO): Promise<{ data: Campaign[]; total: number; page: number; limit: number; totalPages: number }> {
    return await this.campaignRepository.findAll(query);
  }
}

import { Campaign } from '../../domain/Campaign';
import { ICampaignRepository } from '../../interfaces/ICampaignRepository';
import { NotFoundError } from '../../errors/CustomErrors';

export class GetCampaignBySlugUseCase {
  constructor(private campaignRepository: ICampaignRepository) {}

  async execute(slug: string): Promise<Campaign> {
    const campaign = await this.campaignRepository.findBySlug(slug);
    if (!campaign) {
      throw new NotFoundError('Campaign', slug);
    }
    return campaign;
  }
}

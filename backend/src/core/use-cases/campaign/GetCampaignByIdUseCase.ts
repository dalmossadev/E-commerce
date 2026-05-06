import { Campaign } from '../../domain/Campaign';
import { ICampaignRepository } from '../../interfaces/ICampaignRepository';
import { NotFoundError } from '../../errors/CustomErrors';

export class GetCampaignByIdUseCase {
  constructor(private campaignRepository: ICampaignRepository) {}

  async execute(id: number): Promise<Campaign> {
    const campaign = await this.campaignRepository.findById(id);
    if (!campaign) {
      throw new NotFoundError('Campaign', id);
    }
    return campaign;
  }
}

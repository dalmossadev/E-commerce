import { ICampaignRepository } from '../../interfaces/ICampaignRepository';
import { NotFoundError } from '../../errors/CustomErrors';

export class DeleteCampaignUseCase {
  constructor(private campaignRepository: ICampaignRepository) {}

  async execute(id: number): Promise<void> {
    const campaign = await this.campaignRepository.findById(id);
    if (!campaign) {
      throw new NotFoundError('Campaign', id);
    }
    await this.campaignRepository.delete(id);
  }
}

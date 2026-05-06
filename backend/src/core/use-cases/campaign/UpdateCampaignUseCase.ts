import { Campaign } from '../../domain/Campaign';
import { ICampaignRepository } from '../../interfaces/ICampaignRepository';
import { UpdateCampaignDTO } from '../../dto/CampaignDTO';
import { BadRequestError, NotFoundError } from '../../errors/CustomErrors';

export class UpdateCampaignUseCase {
  constructor(private campaignRepository: ICampaignRepository) {}

  async execute(id: number, data: UpdateCampaignDTO): Promise<Campaign> {
    const campaign = await this.campaignRepository.findById(id);
    if (!campaign) {
      throw new NotFoundError('Campaign', id);
    }

    if (data.slug && data.slug !== campaign.slug) {
      const existingBySlug = await this.campaignRepository.findBySlug(data.slug);
      if (existingBySlug) {
        throw new BadRequestError('Slug already exists');
      }
    }

    if (data.name !== undefined) campaign.name = data.name.trim();
    if (data.slug !== undefined) campaign.slug = data.slug.trim();
    if (data.messageTemplate !== undefined) campaign.messageTemplate = data.messageTemplate.trim();
    if (data.isActive !== undefined) campaign.isActive = data.isActive;
    if (data.startDate !== undefined) campaign.startDate = data.startDate;
    if (data.endDate !== undefined) campaign.endDate = data.endDate;
    if (data.targetUrl !== undefined) campaign.targetUrl = data.targetUrl;

    return await this.campaignRepository.update(campaign);
  }
}

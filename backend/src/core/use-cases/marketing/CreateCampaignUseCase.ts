import { ICampaignRepository } from '@core/interfaces/ICampaignRepository';
import { Campaign } from '@core/domain/Campaign';
import { BadRequestError } from '@core/errors/CustomErrors';

export class CreateCampaignUseCase {
  constructor(private campaignRepository: ICampaignRepository) {}

  async execute(data: { name: string; slug: string; messageTemplate: string; isActive: boolean; targetUrl?: string; startDate?: Date; endDate?: Date }): Promise<Campaign> {
    if (!data.name?.trim()) {
      throw new BadRequestError('Name is required');
    }
    if (!data.slug?.trim()) {
      throw new BadRequestError('Slug is required');
    }
    if (!data.messageTemplate?.trim()) {
      throw new BadRequestError('Message template is required');
    }

    const existingBySlug = await this.campaignRepository.findBySlug(data.slug);
    if (existingBySlug) {
      throw new BadRequestError('Slug already exists');
    }

    const campaign = new Campaign({
      name: data.name.trim(),
      slug: data.slug.trim(),
      messageTemplate: data.messageTemplate.trim(),
      isActive: data.isActive ?? true,
      targetUrl: data.targetUrl,
      startDate: data.startDate,
      endDate: data.endDate
    });

    return await this.campaignRepository.save(campaign);
  }
}

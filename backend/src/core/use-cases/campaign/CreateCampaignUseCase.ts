import { Campaign } from '../../domain/Campaign';
import { ICampaignRepository } from '../../interfaces/ICampaignRepository';
import { CreateCampaignDTO } from '../../dto/CampaignDTO';
import { BadRequestError } from '../../errors/CustomErrors';

export class CreateCampaignUseCase {
  constructor(private campaignRepository: ICampaignRepository) {}

  async execute(data: CreateCampaignDTO): Promise<Campaign> {
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
      startDate: data.startDate,
      endDate: data.endDate,
      targetUrl: data.targetUrl
    });

    return await this.campaignRepository.save(campaign);
  }
}

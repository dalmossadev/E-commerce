import { Campaign } from '@core/domain/Campaign';
import { ICampaignRepository } from '@core/interfaces/ICampaignRepository';
import { CreateCampaignDTO, UpdateCampaignDTO, CampaignQueryDTO } from '@core/dto/CampaignDTO';
import { BadRequestError, NotFoundError } from '@core/errors/CustomErrors';

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

export class ListCampaignsUseCase {
  constructor(private campaignRepository: ICampaignRepository) {}

  async execute(query?: CampaignQueryDTO): Promise<{ data: Campaign[]; total: number; page: number; limit: number; totalPages: number }> {
    return await this.campaignRepository.findAll(query);
  }
}

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

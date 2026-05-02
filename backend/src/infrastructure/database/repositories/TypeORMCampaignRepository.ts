import { AppDataSource } from '@infrastructure/database/data-source';
import { Campaign } from '@core/domain/Campaign';
import { ICampaignRepository } from '@core/interfaces/ICampaignRepository';
import { CampaignQueryDTO } from '@core/dto/CampaignDTO';

export class TypeORMCampaignRepository implements ICampaignRepository {
  private repository = AppDataSource.getRepository(Campaign);

  async save(campaign: Campaign): Promise<Campaign> {
    return await this.repository.save(campaign);
  }

  async findById(id: number): Promise<Campaign | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findAll(query?: CampaignQueryDTO): Promise<{ data: Campaign[]; total: number; page: number; limit: number; totalPages: number }> {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;

    const qb = this.repository.createQueryBuilder('campaign');

    if (query?.isActive !== undefined) {
      qb.where('campaign.isActive = :isActive', { isActive: query.isActive });
    }

    if (query?.search) {
      qb.andWhere('campaign.name ILIKE :search OR campaign.slug ILIKE :search', { search: `%${query.search}%` });
    }

    const sortBy = query?.sortBy || 'createdAt';
    const sortOrder = query?.sortOrder || 'DESC';
    qb.orderBy(`campaign.${sortBy}`, sortOrder);

    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return { data, total, page, limit, totalPages };
  }

  async update(campaign: Campaign): Promise<Campaign> {
    return await this.repository.save(campaign);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findBySlug(slug: string): Promise<Campaign | null> {
    return await this.repository.findOne({ where: { slug } });
  }
}

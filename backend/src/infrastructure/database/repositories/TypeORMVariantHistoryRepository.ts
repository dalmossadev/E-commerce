import { AppDataSource } from '@infrastructure/database/data-source';
import { VariantHistory } from '@core/domain/VariantHistory';

export class TypeORMVariantHistoryRepository {
  private repository = AppDataSource.getRepository(VariantHistory);

  async findBySku(sku: string, page: number = 1, limit: number = 10): Promise<{ data: VariantHistory[]; total: number; page: number; limit: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.repository.findAndCount({
      where: { sku },
      order: { createdAt: 'DESC' },
      skip,
      take: limit
    });

    const totalPages = Math.ceil(total / limit);
    return { data, total, page, limit, totalPages };
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: VariantHistory[]; total: number; page: number; limit: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.repository.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: limit
    });

    const totalPages = Math.ceil(total / limit);
    return { data, total, page, limit, totalPages };
  }
}

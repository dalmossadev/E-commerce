import { VariantHistory } from '@core/domain/VariantHistory';
import { TypeORMVariantHistoryRepository } from '@infrastructure/database/repositories/TypeORMVariantHistoryRepository';

export class GetVariantHistoryBySkuUseCase {
  private repository: TypeORMVariantHistoryRepository;

  constructor() {
    this.repository = new TypeORMVariantHistoryRepository();
  }

  async execute(sku: string, page: number = 1, limit: number = 10): Promise<{ data: VariantHistory[]; total: number; page: number; limit: number; totalPages: number }> {
    return await this.repository.findBySku(sku, page, limit);
  }
}

export class GetAllVariantHistoryUseCase {
  private repository: TypeORMVariantHistoryRepository;

  constructor() {
    this.repository = new TypeORMVariantHistoryRepository();
  }

  async execute(page: number = 1, limit: number = 10): Promise<{ data: VariantHistory[]; total: number; page: number; limit: number; totalPages: number }> {
    return await this.repository.findAll(page, limit);
  }
}

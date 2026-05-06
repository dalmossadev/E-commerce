import { VariantHistory } from '../../domain/VariantHistory';
import { IVariantHistoryRepository } from '../../interfaces/IVariantHistoryRepository';

export class GetVariantHistoryBySkuUseCase {
  constructor(private variantHistoryRepository: IVariantHistoryRepository) {}

  async execute(sku: string, page: number = 1, limit: number = 10): Promise<{ data: VariantHistory[]; total: number; page: number; limit: number; totalPages: number }> {
    return await this.variantHistoryRepository.findBySku(sku, page, limit);
  }
}

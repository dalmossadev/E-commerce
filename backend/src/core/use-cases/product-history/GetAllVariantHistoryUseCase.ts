import { VariantHistory } from '../../domain/VariantHistory';
import { IVariantHistoryRepository } from '../../interfaces/IVariantHistoryRepository';

export class GetAllVariantHistoryUseCase {
  constructor(private variantHistoryRepository: IVariantHistoryRepository) {}

  async execute(page: number = 1, limit: number = 10): Promise<{ data: VariantHistory[]; total: number; page: number; limit: number; totalPages: number }> {
    return await this.variantHistoryRepository.findAll(page, limit);
  }
}

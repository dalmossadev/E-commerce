import { VariantHistory } from '@core/domain/VariantHistory';

export interface IVariantHistoryRepository {
  findBySku(sku: string, page?: number, limit?: number): Promise<{ data: VariantHistory[]; total: number; page: number; limit: number; totalPages: number }>;
  findAll(page?: number, limit?: number): Promise<{ data: VariantHistory[]; total: number; page: number; limit: number; totalPages: number }>;
}

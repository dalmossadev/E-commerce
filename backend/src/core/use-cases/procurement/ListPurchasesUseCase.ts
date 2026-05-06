import { Purchase, PurchaseStatus } from '../../domain/Purchase';
import { IPurchaseRepository } from '../../interfaces/IPurchaseRepository';

export class ListPurchasesUseCase {
  constructor(private purchaseRepository: IPurchaseRepository) {}

  async execute(status?: PurchaseStatus, supplierId?: number): Promise<Purchase[]> {
    if (supplierId) {
      return await this.purchaseRepository.findBySupplier(supplierId);
    }
    return await this.purchaseRepository.findAll(status);
  }
}
import { Purchase } from '../../domain/Purchase';
import { IPurchaseRepository } from '../../interfaces/IPurchaseRepository';
import { NotFoundError } from '../../errors/CustomErrors';

export class GetPurchaseByIdUseCase {
  constructor(private purchaseRepository: IPurchaseRepository) {}

  async execute(id: number): Promise<Purchase> {
    const purchase = await this.purchaseRepository.findById(id);
    if (!purchase) {
      throw new NotFoundError('Purchase', id);
    }
    return purchase;
  }
}

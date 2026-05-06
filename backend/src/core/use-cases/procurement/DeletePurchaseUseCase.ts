import { IPurchaseRepository } from '../../interfaces/IPurchaseRepository';
import { NotFoundError } from '../../errors/CustomErrors';

export class DeletePurchaseUseCase {
  constructor(private purchaseRepository: IPurchaseRepository) {}

  async execute(id: number): Promise<void> {
    const purchase = await this.purchaseRepository.findById(id);
    if (!purchase) {
      throw new NotFoundError('Purchase', id);
    }
    await this.purchaseRepository.delete(id);
  }
}

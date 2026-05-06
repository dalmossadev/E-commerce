import { Purchase, PurchaseStatus } from '../../domain/Purchase';
import { IPurchaseRepository } from '../../interfaces/IPurchaseRepository';
import { UpdatePurchaseDTO } from '../../dto/PurchaseDTO';
import { NotFoundError } from '../../errors/CustomErrors';

export class UpdatePurchaseStatusUseCase {
  constructor(private purchaseRepository: IPurchaseRepository) {}

  async execute(id: number, data: UpdatePurchaseDTO): Promise<Purchase> {
    const purchase = await this.purchaseRepository.findById(id);
    if (!purchase) {
      throw new NotFoundError('Purchase', id);
    }

    if (data.status) {
      if (data.status === PurchaseStatus.CANCELLED) {
        purchase.cancel();
      } else if (data.status === PurchaseStatus.ORDERED) {
        purchase.markAsOrdered();
      } else if (data.status === PurchaseStatus.SHIPPED) {
        purchase.markAsShipped(data.trackingNumber);
      } else if (data.status === PurchaseStatus.RECEIVED) {
        purchase.receiveInventory();
      }
    }

    if (data.notes !== undefined) {
      purchase.notes = data.notes;
    }

    if (data.trackingNumber) {
      purchase.trackingNumber = data.trackingNumber;
    }

    return await this.purchaseRepository.update(purchase);
  }
}

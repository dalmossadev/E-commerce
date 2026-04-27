import { Purchase } from '@core/domain/Purchase';
import { IPurchaseRepository } from '@core/interfaces/IPurchaseRepository';
import { PurchaseStatus } from '@core/domain/Purchase';
import { NotFoundError } from '@core/errors/CustomErrors';

export class ListPurchasesUseCase {
  constructor(private purchaseRepository: IPurchaseRepository) {}

  async execute(status?: PurchaseStatus, supplierId?: number): Promise<Purchase[]> {
    if (supplierId) {
      return await this.purchaseRepository.findBySupplier(supplierId);
    }
    return await this.purchaseRepository.findAll(status);
  }
}

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

export class UpdatePurchaseStatusUseCase {
  constructor(private purchaseRepository: IPurchaseRepository) {}

  async execute(id: number, data: { status?: PurchaseStatus; trackingNumber?: string; notes?: string }): Promise<Purchase> {
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
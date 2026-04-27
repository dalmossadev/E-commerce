import { Purchase, PurchaseStatus } from '@core/domain/Purchase';
import { IPurchaseRepository } from '@core/interfaces/IPurchaseRepository';
import { IProductRepository } from '@core/interfaces/IProductRepository';
import { ReceiveInventoryDTO } from '@core/dto/PurchaseDTO';
import { NotFoundError, BadRequestError } from '@core/errors/CustomErrors';

interface IInventoryReceiver {
  receive(purchase: Purchase, items: ReceiveInventoryDTO['items']): Promise<void>;
}

class InventoryReceiver implements IInventoryReceiver {
  constructor(private productRepository: IProductRepository) {}

  async receive(purchase: Purchase, receiveItems: ReceiveInventoryDTO['items']): Promise<void> {
    for (const receiveItem of receiveItems) {
      const variant = await this.productRepository.findVariantById(receiveItem.variantId);
      if (!variant) {
        throw new NotFoundError('Variant', receiveItem.variantId);
      }
      variant.increaseStock(receiveItem.quantity);
      await this.productRepository.updateVariant(variant);
    }
  }
}

export class ReceiveInventoryUseCase {
  private receiver: IInventoryReceiver;

  constructor(
    private purchaseRepository: IPurchaseRepository,
    productRepository: IProductRepository
  ) {
    this.receiver = new InventoryReceiver(productRepository);
  }

  async execute(purchaseId: number, data: ReceiveInventoryDTO): Promise<Purchase> {
    const purchase = await this.purchaseRepository.findById(purchaseId);
    if (!purchase) {
      throw new NotFoundError('Purchase', purchaseId);
    }

    if (purchase.status === PurchaseStatus.RECEIVED) {
      throw new BadRequestError('Purchase has already been received');
    }

    if (purchase.status !== PurchaseStatus.SHIPPED) {
      throw new BadRequestError('Purchase must be in SHIPPED status to receive inventory');
    }

    this.validateReceiveItems(purchase, data.items);

    await this.receiver.receive(purchase, data.items);

    purchase.receiveInventory();

    return await this.purchaseRepository.update(purchase);
  }

  private validateReceiveItems(
    purchase: Purchase,
    receiveItems: ReceiveInventoryDTO['items']
  ): void {
    if (!receiveItems || receiveItems.length === 0) {
      throw new BadRequestError('At least one item is required');
    }

    const purchaseVariantIds = new Set(purchase.items.map(item => item.variantId));
    for (const item of receiveItems) {
      if (!purchaseVariantIds.has(item.variantId)) {
        throw new BadRequestError(`Variant ${item.variantId} is not in this purchase`);
      }
      if (item.quantity <= 0) {
        throw new BadRequestError('Quantity must be positive');
      }
    }
  }
}
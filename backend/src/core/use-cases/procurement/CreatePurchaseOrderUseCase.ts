import { Purchase, PurchaseItem, PurchaseStatus } from '../../domain/Purchase';
import { IPurchaseRepository } from '../../interfaces/IPurchaseRepository';
import { CreatePurchaseDTO, CreatePurchaseItemDTO } from '../../dto/PurchaseDTO';
import { BadRequestError } from '../../errors/CustomErrors';

export interface IPurchaseValidator {
  validate(data: CreatePurchaseDTO): void;
}

export interface IPurchaseFactory {
  create(data: CreatePurchaseDTO): Purchase;
}

export class PurchaseValidator implements IPurchaseValidator {
  validate(data: CreatePurchaseDTO): void {
    if (!data.supplierId) {
      throw new BadRequestError('Supplier is required');
    }
    if (!data.supplierName) {
      throw new BadRequestError('Supplier name is required');
    }
    if (!data.items || data.items.length === 0) {
      throw new BadRequestError('At least one item is required');
    }
    for (const item of data.items) {
      if (!item.variantId) {
        throw new BadRequestError('Variant ID is required for each item');
      }
      if (!item.sku) {
        throw new BadRequestError('SKU is required for each item');
      }
      if (!item.quantity || item.quantity <= 0) {
        throw new BadRequestError('Quantity must be positive');
      }
      if (!item.unitCost || item.unitCost <= 0) {
        throw new BadRequestError('Unit cost must be positive');
      }
    }
  }
}

export class PurchaseFactory implements IPurchaseFactory {
  create(data: CreatePurchaseDTO): Purchase {
    const purchase = new Purchase();
    purchase.supplierId = data.supplierId;
    purchase.supplierName = data.supplierName.trim();
    purchase.notes = data.notes?.trim();
    purchase.expectedDeliveryDate = data.expectedDeliveryDate;
    purchase.status = PurchaseStatus.PENDING;
    purchase.items = data.items.map(item => this.createItem(item));
    return purchase;
  }

  private createItem(data: CreatePurchaseItemDTO): PurchaseItem {
    const item = new PurchaseItem();
    item.variantId = data.variantId;
    item.sku = data.sku.trim();
    item.productName = data.productName.trim();
    item.color = data.color;
    item.size = data.size;
    item.quantity = data.quantity;
    item.unitCost = data.unitCost;
    item.totalCost = item.quantity * item.unitCost;
    return item;
  }
}

export class CreatePurchaseOrderUseCase {
  constructor(
    private purchaseRepository: IPurchaseRepository,
    private validator: IPurchaseValidator,
    private factory: IPurchaseFactory
  ) {}

  async execute(data: CreatePurchaseDTO): Promise<Purchase> {
    this.validator.validate(data);
    
    const purchase = this.factory.create(data);
    return await this.purchaseRepository.save(purchase);
  }
}
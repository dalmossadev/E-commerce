import { Purchase, PurchaseItem, PurchaseStatus } from '@core/domain/Purchase';
import { IPurchaseRepository } from '@core/interfaces/IPurchaseRepository';
import { IProductRepository } from '@core/interfaces/IProductRepository';
import { CreatePurchaseDTO, UpdatePurchaseDTO, CreatePurchaseItemDTO } from '@core/dto/PurchaseDTO';
import { BadRequestError, NotFoundError } from '@core/errors/CustomErrors';

class PurchaseValidator {
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

class PurchaseFactory {
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
  private validator: PurchaseValidator;
  private factory: PurchaseFactory;

  constructor(
    private purchaseRepository: IPurchaseRepository,
    private productRepository?: IProductRepository
  ) {
    this.validator = new PurchaseValidator();
    this.factory = new PurchaseFactory();
  }

  async execute(data: CreatePurchaseDTO): Promise<Purchase> {
    this.validator.validate(data);
    
    const purchase = this.factory.create(data);
    return await this.purchaseRepository.save(purchase);
  }
}

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
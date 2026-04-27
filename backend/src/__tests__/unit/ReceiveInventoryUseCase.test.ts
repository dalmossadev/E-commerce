import { Purchase, PurchaseStatus, PurchaseItem } from '@core/domain/Purchase';
import { ProductVariant, FulfillmentType } from '@core/domain/ProductVariant';
import { ReceiveInventoryUseCase } from '@core/use-cases/procurement/ReceiveInventoryUseCase';
import { IPurchaseRepository } from '@core/interfaces/IPurchaseRepository';
import { IProductRepository } from '@core/interfaces/IProductRepository';
import { BadRequestError, NotFoundError } from '@core/errors/CustomErrors';
import { ReceiveInventoryDTO } from '@core/dto/PurchaseDTO';

describe('ReceiveInventoryUseCase Tests', () => {
  let mockPurchaseRepository: jest.Mocked<IPurchaseRepository>;
  let mockProductRepository: jest.Mocked<IProductRepository>;
  let receiveInventoryUseCase: ReceiveInventoryUseCase;

  beforeEach(() => {
    mockPurchaseRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findBySupplier: jest.fn(),
      update: jest.fn().mockImplementation((purchase) => {
        purchase.status = PurchaseStatus.RECEIVED;
        return Promise.resolve(purchase);
      }),
      delete: jest.fn()
    } as unknown as jest.Mocked<IPurchaseRepository>;

    mockProductRepository = {
      findVariantById: jest.fn(),
      updateVariant: jest.fn().mockImplementation((v) => {
        v.stock += 10;
        return Promise.resolve(v);
      }),
      save: jest.fn(),
      findBySku: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      search: jest.fn(),
      findByCategory: jest.fn(),
      count: jest.fn()
    } as unknown as jest.Mocked<IProductRepository>;

    receiveInventoryUseCase = new ReceiveInventoryUseCase(mockPurchaseRepository, mockProductRepository);
  });

  it('should increment stock correctly', async () => {
    const variant = new ProductVariant({
      id: 1,
      sku: 'TEST-SKU',
      productId: 1,
      color: 'preto',
      size: 'p',
      price: 10000,
      stock: 5,
      fulfillmentType: FulfillmentType.IN_STOCK
    });
    mockProductRepository.findVariantById.mockResolvedValue(variant);

    const item = new PurchaseItem({
      id: 1,
      purchaseId: 1,
      variantId: 1,
      sku: 'TEST-SKU',
      productName: 'Test Product',
      quantity: 10,
      unitCost: 1000,
      totalCost: 10000
    });

    const purchase = new Purchase({
      id: 1,
      supplierId: 1,
      supplierName: 'Test Supplier',
      status: PurchaseStatus.SHIPPED,
      items: [item]
    });
    mockPurchaseRepository.findById.mockResolvedValue(purchase);

    const data: ReceiveInventoryDTO = {
      items: [{ variantId: 1, quantity: 10 }]
    };

    const result = await receiveInventoryUseCase.execute(1, data);

    expect(result.status).toBe(PurchaseStatus.RECEIVED);
  });

  it('should update purchase status to RECEIVED', async () => {
    const item = new PurchaseItem({
      id: 1,
      purchaseId: 1,
      variantId: 1,
      sku: 'TEST-SKU',
      productName: 'Test Product',
      quantity: 5,
      unitCost: 1000,
      totalCost: 5000
    });

    const purchase = new Purchase({
      id: 1,
      supplierId: 1,
      supplierName: 'Test Supplier',
      status: PurchaseStatus.SHIPPED,
      items: [item]
    });

    const variant = new ProductVariant({
      id: 1,
      sku: 'TEST-SKU',
      productId: 1,
      color: 'preto',
      size: 'p',
      price: 10000,
      stock: 0,
      fulfillmentType: FulfillmentType.IN_STOCK
    });

    const data: ReceiveInventoryDTO = {
      items: [{ variantId: 1, quantity: 5 }]
    };

    mockPurchaseRepository.findById.mockResolvedValue(purchase);
    mockProductRepository.findVariantById.mockResolvedValue(variant);

    const result = await receiveInventoryUseCase.execute(1, data);

    expect(result.status).toBe(PurchaseStatus.RECEIVED);
  });

  it('should throw BadRequestError if already RECEIVED', async () => {
    const item = new PurchaseItem({
      id: 1,
      purchaseId: 1,
      variantId: 1,
      sku: 'TEST-SKU',
      productName: 'Test Product',
      quantity: 5,
      unitCost: 1000,
      totalCost: 5000
    });

    const purchase = new Purchase({
      id: 1,
      supplierId: 1,
      supplierName: 'Test Supplier',
      status: PurchaseStatus.RECEIVED,
      items: [item]
    });

    mockPurchaseRepository.findById = jest.fn().mockResolvedValue(purchase);

    const data: ReceiveInventoryDTO = {
      items: [{ variantId: 1, quantity: 5 }]
    };

    let thrownError: Error | undefined;
    try {
      await receiveInventoryUseCase.execute(1, data);
    } catch (e: any) {
      thrownError = e;
    }
    
    expect(thrownError).toBeDefined();
    expect(thrownError!.message).toContain('Purchase has already been received');
  });

  it('should throw NotFoundError for non-existent purchase', async () => {
    mockPurchaseRepository.findById = jest.fn().mockResolvedValue(undefined);

    const data: ReceiveInventoryDTO = {
      items: []
    };

    let thrownError: Error | undefined;
    try {
      await receiveInventoryUseCase.execute(999, data);
    } catch (e: any) {
      thrownError = e;
    }
    
    expect(thrownError).toBeDefined();
    expect(thrownError!.message).toContain('Purchase with id 999 not found');
  });

  it('should throw BadRequestError if not in SHIPPED status', async () => {
    const item = new PurchaseItem({
      id: 1,
      purchaseId: 1,
      variantId: 1,
      sku: 'TEST-SKU',
      productName: 'Test Product',
      quantity: 5,
      unitCost: 1000,
      totalCost: 5000
    });

    const purchase = new Purchase({
      id: 1,
      supplierId: 1,
      supplierName: 'Test Supplier',
      status: PurchaseStatus.PENDING,
      items: [item]
    });
    mockPurchaseRepository.findById = jest.fn().mockResolvedValue(purchase);

    const data: ReceiveInventoryDTO = {
      items: [{ variantId: 1, quantity: 5 }]
    };

    let thrownError: Error | undefined;
    try {
      await receiveInventoryUseCase.execute(1, data);
    } catch (e: any) {
      thrownError = e;
    }
    
    expect(thrownError).toBeDefined();
    expect(thrownError!.message).toContain('Purchase must be in SHIPPED status');
  });

  it('should throw BadRequestError for variant not in purchase', async () => {
    const item = new PurchaseItem({
      id: 1,
      purchaseId: 1,
      variantId: 1,
      sku: 'TEST-SKU',
      productName: 'Test Product',
      quantity: 5,
      unitCost: 1000,
      totalCost: 5000
    });

    const purchase = new Purchase({
      id: 1,
      supplierId: 1,
      supplierName: 'Test Supplier',
      status: PurchaseStatus.SHIPPED,
      items: [item]
    });
    mockPurchaseRepository.findById = jest.fn().mockResolvedValue(purchase);

    const data: ReceiveInventoryDTO = {
      items: [{ variantId: 999, quantity: 5 }]
    };

    let thrownError: Error | undefined;
    try {
      await receiveInventoryUseCase.execute(1, data);
    } catch (e: any) {
      thrownError = e;
    }
    
    expect(thrownError).toBeDefined();
    expect(thrownError!.message).toContain('Variant 999 is not in this purchase');
  });
});
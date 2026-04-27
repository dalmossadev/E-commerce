import { Order, OrderStatus, PaymentMethod } from '@core/domain/Order';
import { FulfillmentType, ProductVariant } from '@core/domain/ProductVariant';
import { CreateOrderUseCase } from '@core/use-cases/orders/OrderUseCases';
import { IOrderRepository } from '@core/interfaces/IOrderRepository';
import { IProductRepository } from '@core/interfaces/IProductRepository';
import { BadRequestError, NotFoundError } from '@core/errors/CustomErrors';
import { CreateOrderDTO } from '@core/dto/OrderDTO';

describe('CreateOrderUseCase Tests', () => {
  let mockOrderRepository: jest.Mocked<IOrderRepository>;
  let mockProductRepository: jest.Mocked<IProductRepository>;
  let createOrderUseCase: CreateOrderUseCase;

  beforeEach(() => {
    mockOrderRepository = {
      save: jest.fn().mockImplementation((order) => {
        order.id = 1;
        return Promise.resolve(order);
      }),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCustomerId: jest.fn()
    } as unknown as jest.Mocked<IOrderRepository>;

    mockProductRepository = {
      findVariantById: jest.fn(),
      updateVariant: jest.fn().mockImplementation((v) => Promise.resolve(v)),
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

    createOrderUseCase = new CreateOrderUseCase(mockOrderRepository, mockProductRepository);
  });

  it('should create order with IN_STOCK variant and sufficient stock', async () => {
    const variant = new ProductVariant({
      id: 1,
      sku: 'TEST-SKU',
      productId: 1,
      color: 'preto',
      size: 'p',
      price: 10000,
      stock: 10,
      fulfillmentType: FulfillmentType.IN_STOCK
    });
    const data: CreateOrderDTO = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+5511999999999',
      items: [{
        variantId: 1,
        sku: 'TEST-SKU',
        productName: 'Test Product',
        color: 'preto',
        size: 'p',
        quantity: 5,
        unitPrice: 10000,
        fulfillmentType: FulfillmentType.IN_STOCK
      }]
    };
    mockProductRepository.findVariantById.mockResolvedValue(variant);

    const order = await createOrderUseCase.execute(data);

    expect(order.id).toBeDefined();
    expect(order.items).toHaveLength(1);
    expect(order.items[0].quantity).toBe(5);
    expect(order.status).toBe(OrderStatus.PENDING);
  });

  it('should create order with ON_DEMAND variant without stock check', async () => {
    const variant = new ProductVariant({
      id: 1,
      sku: 'TEST-SKU',
      productId: 1,
      color: 'preto',
      size: 'p',
      price: 10000,
      stock: 0,
      fulfillmentType: FulfillmentType.ON_DEMAND
    });
    const data: CreateOrderDTO = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+5511999999999',
      items: [{
        variantId: 1,
        sku: 'TEST-SKU',
        productName: 'Test Product',
        color: 'preto',
        size: 'p',
        quantity: 100,
        unitPrice: 10000,
        fulfillmentType: FulfillmentType.ON_DEMAND
      }]
    };
    mockProductRepository.findVariantById.mockResolvedValue(variant);

    const order = await createOrderUseCase.execute(data);

    expect(order.id).toBeDefined();
    expect(order.items[0].quantity).toBe(100);
  });

  it('should throw InsufficientStockError for IN_STOCK without stock', async () => {
    const variant = new ProductVariant({
      id: 1,
      sku: 'TEST-SKU',
      productId: 1,
      color: 'preto',
      size: 'p',
      price: 10000,
      stock: 3,
      fulfillmentType: FulfillmentType.IN_STOCK
    });
    mockProductRepository.findVariantById = jest.fn().mockResolvedValue(variant);

    const data: CreateOrderDTO = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+5511999999999',
      items: [{
        variantId: 1,
        sku: 'TEST-SKU',
        productName: 'Test Product',
        color: 'preto',
        size: 'p',
        quantity: 10,
        unitPrice: 10000,
        fulfillmentType: FulfillmentType.IN_STOCK
      }]
    };

    let thrownError: Error | undefined;
    try {
      await createOrderUseCase.execute(data);
    } catch (e: any) {
      thrownError = e;
    }
    
    expect(thrownError).toBeDefined();
    expect(thrownError!.message).toContain('Insufficient stock');
  });

  it('should throw NotFoundError for non-existent variant', async () => {
    mockProductRepository.findVariantById = jest.fn().mockResolvedValue(undefined);

    const data: CreateOrderDTO = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+5511999999999',
      items: [{
        variantId: 999,
        sku: 'NON-EXISTENT',
        productName: 'Test Product',
        color: 'preto',
        size: 'p',
        quantity: 1,
        unitPrice: 10000,
        fulfillmentType: FulfillmentType.IN_STOCK
      }]
    };

    let thrownError: Error | undefined;
    try {
      await createOrderUseCase.execute(data);
    } catch (e: any) {
      thrownError = e;
    }
    
    expect(thrownError).toBeDefined();
    expect(thrownError!.message).toContain('ProductVariant with id 999 not found');
  });

  it('should calculate totalValue correctly in centavos', async () => {
    const variant = new ProductVariant({
      id: 1,
      sku: 'TEST-SKU',
      productId: 1,
      color: 'preto',
      size: 'p',
      price: 2999,
      stock: 100,
      fulfillmentType: FulfillmentType.IN_STOCK
    });
    const data: CreateOrderDTO = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+5511999999999',
      items: [{
        variantId: 1,
        sku: 'TEST-SKU',
        productName: 'Test Product',
        color: 'preto',
        size: 'p',
        quantity: 2,
        unitPrice: 2999,
        fulfillmentType: FulfillmentType.IN_STOCK
      }]
    };
    mockProductRepository.findVariantById = jest.fn().mockResolvedValue(variant);

    const order = await createOrderUseCase.execute(data);

    expect(order.subtotal).toBe(5998);
    expect(order.total).toBe(5998);
  });

  it('should validate required fields', async () => {
    const data: CreateOrderDTO = {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      items: []
    };

    let thrownError: Error | undefined;
    try {
      await createOrderUseCase.execute(data);
    } catch (e: any) {
      thrownError = e;
    }
    
    expect(thrownError).toBeDefined();
    expect(thrownError!.message).toContain('Order must have at least one item');
  });
});
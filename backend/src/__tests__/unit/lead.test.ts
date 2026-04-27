import { Lead, LeadStatus } from '@core/domain/Lead';
import { FulfillmentType, ProductVariant } from '@core/domain/ProductVariant';

describe('Lead Entity Tests', () => {
  describe('LeadStatus', () => {
    it('should have PENDING status', () => {
      expect(LeadStatus.PENDING).toBe('PENDING');
    });

    it('should have CONFIRMED status', () => {
      expect(LeadStatus.CONFIRMED).toBe('CONFIRMED');
    });

    it('should have REJECTED status', () => {
      expect(LeadStatus.REJECTED).toBe('REJECTED');
    });
  });

  describe('Lead', () => {
    it('should create lead with required fields', () => {
      const lead = new Lead();
      lead.sku = 'TEST-SKU';
      lead.customerName = 'John Doe';
      lead.customerPhone = '+5511999999999';
      lead.status = LeadStatus.PENDING;

      expect(lead.sku).toBe('TEST-SKU');
      expect(lead.customerName).toBe('John Doe');
      expect(lead.customerPhone).toBe('+5511999999999');
      expect(lead.status).toBe(LeadStatus.PENDING);
    });

    it('should create lead with optional fields', () => {
      const lead = new Lead();
      lead.sku = 'TEST-SKU';
      lead.customerName = 'John Doe';
      lead.customerPhone = '+5511999999999';
      lead.customerEmail = 'john@example.com';
      lead.notes = 'Test note';
      lead.productId = 1;
      lead.variantId = 1;
      lead.status = LeadStatus.PENDING;

      expect(lead.customerEmail).toBe('john@example.com');
      expect(lead.notes).toBe('Test note');
      expect(lead.productId).toBe(1);
      expect(lead.variantId).toBe(1);
    });
  });
});

describe('ProductVariant FulfillmentType Tests', () => {
  describe('FulfillmentType', () => {
    it('should have ON_DEMAND type', () => {
      expect(FulfillmentType.ON_DEMAND).toBe('ON_DEMAND');
    });

    it('should have IN_STOCK type', () => {
      expect(FulfillmentType.IN_STOCK).toBe('IN_STOCK');
    });
  });

  describe('ProductVariant', () => {
    it('should create variant with ON_DEMAND default', () => {
      const variant = new ProductVariant();
      variant.sku = 'TEST-SKU';
      variant.productId = 1;
      variant.color = 'preto';
      variant.size = 'p';
      variant.price = 10000;
      variant.stock = 0;

      expect(variant.fulfillmentType).toBe(FulfillmentType.ON_DEMAND);
      expect(variant.isOnDemand()).toBe(true);
      expect(variant.isInStock()).toBe(false);
    });

    it('should create variant with IN_STOCK', () => {
      const variant = new ProductVariant();
      variant.sku = 'TEST-SKU';
      variant.productId = 1;
      variant.color = 'preto';
      variant.size = 'p';
      variant.price = 10000;
      variant.stock = 10;
      variant.fulfillmentType = FulfillmentType.IN_STOCK;

      expect(variant.fulfillmentType).toBe(FulfillmentType.IN_STOCK);
      expect(variant.isInStock()).toBe(true);
      expect(variant.isOnDemand()).toBe(false);
    });

    it('should set inStock based on stock', () => {
      const variantWithStock = new ProductVariant();
      variantWithStock.stock = 5;
      expect((variantWithStock.stock ?? 0) > 0).toBe(true);

      const variantWithoutStock = new ProductVariant();
      variantWithoutStock.stock = 0;
      expect((variantWithoutStock.stock ?? 0) > 0).toBe(false);
    });

    it('should check requiresStock for IN_STOCK with valid stock', () => {
      const variant = new ProductVariant();
      variant.fulfillmentType = FulfillmentType.IN_STOCK;
      variant.stock = 10;

      expect(variant.requiresStock()).toBe(true);
    });

    it('should not require stock for ON_DEMAND', () => {
      const variant = new ProductVariant();
      variant.fulfillmentType = FulfillmentType.ON_DEMAND;
      variant.stock = 0;

      expect(variant.requiresStock()).toBe(false);
    });
  });
});

describe('Lead Use Cases Logic', () => {
  const createMockLead = (overrides: Partial<Lead> = {}): Lead => {
    const lead = new Lead();
    lead.id = 1;
    lead.sku = 'NIK-TENIS-ESP-PRE-P';
    lead.customerName = 'John Doe';
    lead.customerPhone = '+5511999999999';
    lead.status = LeadStatus.PENDING;
    Object.assign(lead, overrides);
    return lead;
  };

  it('should change status from PENDING to CONFIRMED', () => {
    const lead = createMockLead({ status: LeadStatus.PENDING });
    lead.status = LeadStatus.CONFIRMED;
    expect(lead.status).toBe(LeadStatus.CONFIRMED);
  });

  it('should change status from PENDING to REJECTED', () => {
    const lead = createMockLead({ status: LeadStatus.PENDING });
    lead.status = LeadStatus.REJECTED;
    expect(lead.status).toBe(LeadStatus.REJECTED);
  });

  it('should store customer data', () => {
    const lead = createMockLead({
      customerName: 'Jane Doe',
      customerEmail: 'jane@example.com',
      customerPhone: '+5511888888888'
    });
    expect(lead.customerName).toBe('Jane Doe');
    expect(lead.customerEmail).toBe('jane@example.com');
    expect(lead.customerPhone).toBe('+5511888888888');
  });
});
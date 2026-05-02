import { Lead } from '@core/domain/Lead';
import { LeadStatus } from '@core/domain/Lead';
import { ILeadRepository } from '@core/interfaces/ILeadRepository';
import { IProductRepository } from '@core/interfaces/IProductRepository';
import { IUserRepository } from '@core/interfaces/IUserRepository';
import { CreateLeadUseCase } from '@core/use-cases/LeadUseCases';
import { CreateLeadDTO } from '@core/dto/LeadDTO';

describe('CreateLeadUseCase', () => {
  let createLeadUseCase: CreateLeadUseCase;
  let mockLeadRepository: jest.Mocked<ILeadRepository>;
  let mockProductRepository: jest.Mocked<IProductRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockAddToWishlist: any;

  beforeEach(() => {
    mockLeadRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findBySku: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    } as unknown as jest.Mocked<ILeadRepository>;

    mockProductRepository = {
      save: jest.fn(),
      findById: jest.fn().mockResolvedValue({ id: 99 }),
      findBySku: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    } as unknown as jest.Mocked<IProductRepository>;

    mockUserRepository = {
      save: jest.fn().mockResolvedValue({ id: 123 }),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as unknown as jest.Mocked<IUserRepository>;

    mockAddToWishlist = {
      execute: jest.fn().mockResolvedValue({})
    };

    createLeadUseCase = new CreateLeadUseCase(
      mockLeadRepository,
      mockProductRepository,
      mockUserRepository,
      mockAddToWishlist
    );
  });

  it('creates a lead with valid data', async () => {
    const data: CreateLeadDTO = {
      sku: 'SKU-123',
      customerName: 'John Doe',
      customerPhone: '+5511999999999'
    };

    const savedLead = new Lead();
    savedLead.id = 1;
    savedLead.sku = data.sku;
    savedLead.customerName = data.customerName;
    savedLead.customerPhone = data.customerPhone;
    savedLead.status = LeadStatus.PENDING;

    mockLeadRepository.save.mockResolvedValue(savedLead);

    const result = await createLeadUseCase.execute(data);

    expect(result.sku).toBe('SKU-123');
    expect(result.customerName).toBe('John Doe');
    expect(result.status).toBe(LeadStatus.PENDING);
    expect(result.customerPhone).toBe('+5511999999999');
  });

  it('creates lead with productId and calls wishlist when userId is present', async () => {
    const data: CreateLeadDTO = {
      sku: 'SKU-123',
      customerName: 'John Doe',
      customerPhone: '+5511999999999',
      productId: 99,
      userId: 1
    };

    const savedLead = new Lead();
    savedLead.id = 1;
    savedLead.sku = data.sku!;
    savedLead.customerName = data.customerName;
    savedLead.customerPhone = data.customerPhone;
    savedLead.status = LeadStatus.PENDING;
    savedLead.productId = 99;

    mockLeadRepository.save.mockResolvedValue(savedLead);
    mockProductRepository.findById.mockResolvedValue({ id: 99 } as any);

    const result = await createLeadUseCase.execute(data);

    expect(result).toBeDefined();
    expect(mockAddToWishlist.execute).toHaveBeenCalledWith(1, 99);
  });

  it('calls wishlist when productId is provided (with userId)', async () => {
    const data: CreateLeadDTO = {
      sku: 'SKU-123',
      customerName: 'John Doe',
      customerPhone: '+551199999999',
      productId: 99,
      userId: 123
    };

    const savedLead = new Lead();
    savedLead.id = 1;
    savedLead.customerName = data.customerName;
    savedLead.status = LeadStatus.PENDING;

    mockLeadRepository.save.mockResolvedValue(savedLead);

    await createLeadUseCase.execute(data);

    expect(mockAddToWishlist.execute).toHaveBeenCalledWith(123, 99);
  });

  it('does NOT call wishlist when productId is missing', async () => {
    const data: CreateLeadDTO = {
      sku: 'SKU-123',
      customerName: 'John Doe',
      customerPhone: '+5511999999999',
      userId: 1
    };

    const savedLead = new Lead();
    savedLead.id = 1;
    savedLead.status = LeadStatus.PENDING;

    mockLeadRepository.save.mockResolvedValue(savedLead);

    await createLeadUseCase.execute(data);

    expect(mockAddToWishlist.execute).not.toHaveBeenCalled();
  });

  it('creates lead without optional fields', async () => {
    const data: CreateLeadDTO = {
      sku: 'SKU-123',
      customerName: 'John Doe',
      customerPhone: '+5511999999999'
    };

    const savedLead = new Lead();
    savedLead.id = 1;
    savedLead.sku = data.sku;
    savedLead.status = LeadStatus.PENDING;

    mockLeadRepository.save.mockResolvedValue(savedLead);

    const result = await createLeadUseCase.execute(data);

    expect(result.customerEmail).toBeUndefined();
  });

  it('saves with all optional fields', async () => {
    const data: CreateLeadDTO = {
      sku: 'SKU-123',
      customerName: 'John',
      customerPhone: '123',
      customerEmail: 'john@test.com',
      notes: 'note'
    };

    const savedLead = new Lead();
    savedLead.id = 1;
    savedLead.customerEmail = data.customerEmail;
    savedLead.notes = data.notes;
    savedLead.status = LeadStatus.PENDING;

    mockLeadRepository.save.mockResolvedValue(savedLead);

    const result = await createLeadUseCase.execute(data);

    expect(result.customerEmail).toBe('john@test.com');
    expect(result.notes).toBe('note');
  });

  it('calls repository with correct lead data', async () => {
    const data: CreateLeadDTO = {
      sku: 'SKU-123',
      customerName: 'John Doe',
      customerPhone: '+5511999999999'
    };

    const savedLead = new Lead();
    savedLead.id = 1;
    mockLeadRepository.save.mockResolvedValue(savedLead);

    await createLeadUseCase.execute(data);

    expect(mockLeadRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        sku: 'SKU-123',
        customerName: 'John Doe',
        customerPhone: '+5511999999999',
        status: LeadStatus.PENDING
      })
    );
  });

  it('trims whitespace from fields', async () => {
    const data: CreateLeadDTO = {
      sku: '  SKU-123  ',
      customerName: '  John Doe  ',
      customerPhone: '  +5511999999999  '
    };

    const savedLead = new Lead();
    savedLead.id = 1;
    mockLeadRepository.save.mockResolvedValue(savedLead);

    await createLeadUseCase.execute(data);

    expect(mockLeadRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        sku: 'SKU-123',
        customerName: 'John Doe',
        customerPhone: '+5511999999999'
      })
    );
  });

  it('sets status to PENDING', async () => {
    const data: CreateLeadDTO = {
      sku: 'SKU-123',
      customerName: 'John',
      customerPhone: '123'
    };

    const savedLead = new Lead();
    savedLead.id = 1;
    savedLead.status = LeadStatus.PENDING;
    mockLeadRepository.save.mockResolvedValue(savedLead);

    const result = await createLeadUseCase.execute(data);

    expect(result.status).toBe(LeadStatus.PENDING);
    expect(mockLeadRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ status: LeadStatus.PENDING })
    );
  });

  it('validates required fields exist', async () => {
    const data: CreateLeadDTO = {
      sku: 'SKU-123',
      customerName: 'John Doe',
      customerPhone: '+5511999999999'
    };

    const savedLead = new Lead();
    savedLead.id = 1;
    mockLeadRepository.save.mockResolvedValue(savedLead);

    await createLeadUseCase.execute(data);
    
    const callArg = mockLeadRepository.save.mock.calls[0][0];
    expect(callArg.sku).toBeDefined();
    expect(callArg.customerName).toBeDefined();
    expect(callArg.customerPhone).toBeDefined();
  });
});

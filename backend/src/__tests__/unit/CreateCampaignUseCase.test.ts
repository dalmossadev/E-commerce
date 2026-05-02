import { CreateCampaignUseCase } from '@core/use-cases/marketing/CreateCampaignUseCase';
import { ICampaignRepository } from '@core/interfaces/ICampaignRepository';
import { Campaign } from '@core/domain/Campaign';
import { BadRequestError } from '@core/errors/CustomErrors';

jest.mock('@core/interfaces/ICampaignRepository');

describe('CreateCampaignUseCase', () => {
  let useCase: CreateCampaignUseCase;
  let mockRepo: jest.Mocked<ICampaignRepository>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findBySlug: jest.fn()
    } as jest.Mocked<ICampaignRepository>;

    useCase = new CreateCampaignUseCase(mockRepo);
  });

  it('should create a campaign successfully', async () => {
    const campaignData = {
      name: 'Dia das Mães 2026',
      slug: 'dia-das-maes-2026',
      messageTemplate: 'Olá! Vi o produto {{productName}} e gostaria de saber mais...',
      isActive: true,
      targetUrl: 'https://example.com/landing'
    };

    const mockCampaign = { id: 1, ...campaignData, startDate: undefined, endDate: undefined };
    mockRepo.save.mockResolvedValue(mockCampaign);

    const result = await useCase.execute(campaignData);

    expect(result).toEqual(mockCampaign);
    expect(mockRepo.save).toHaveBeenCalledWith(expect.objectContaining(campaignData));
  });

  it('should create a campaign without optional fields', async () => {
    const campaignData = {
      name: 'Black Friday',
      slug: 'black-friday',
      messageTemplate: 'Oferta especial!',
      isActive: false
    };

    const mockCampaign = { id: 2, ...campaignData, targetUrl: undefined, startDate: undefined, endDate: undefined };
    mockRepo.save.mockResolvedValue(mockCampaign);

    const result = await useCase.execute(campaignData);

    expect(result.id).toBe(2);
    expect(result.name).toBe('Black Friday');
  });

  it('should throw error if name is missing', async () => {
    const campaignData = {
      slug: 'test',
      messageTemplate: 'Test',
      isActive: true
    } as any;

    try {
      await useCase.execute(campaignData);
      fail('Should have thrown');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should throw error if slug is missing', async () => {
    const campaignData = {
      name: 'Test',
      messageTemplate: 'Test',
      isActive: true
    } as any;

    try {
      await useCase.execute(campaignData);
      fail('Should have thrown');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should throw error if messageTemplate is missing', async () => {
    const campaignData = {
      name: 'Test',
      slug: 'test',
      isActive: true
    } as any;

    try {
      await useCase.execute(campaignData);
      fail('Should have thrown');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should throw error if slug already exists', async () => {
    const campaignData = {
      name: 'Test',
      slug: 'existing-slug',
      messageTemplate: 'Test',
      isActive: true
    };

    mockRepo.findBySlug.mockResolvedValue({ id: 1, ...campaignData });

    try {
      await useCase.execute(campaignData);
      fail('Should have thrown');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

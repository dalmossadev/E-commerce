import { GetSettingsUseCase } from '@core/use-cases/settings/SettingsUseCases';
import { ISettingsRepository } from '@core/interfaces/ISettingsRepository';
import { Settings } from '@core/domain/Settings';
import { BadRequestError } from '@core/errors/CustomErrors';

jest.mock('@core/interfaces/ISettingsRepository');

describe('GetSettingsUseCase', () => {
  let useCase: GetSettingsUseCase;
  let mockRepo: jest.Mocked<ISettingsRepository>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByKey: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn()
    } as jest.Mocked<ISettingsRepository>;

    useCase = new GetSettingsUseCase(mockRepo);
  });

  it('should get settings by key', async () => {
    const settings = { id: 1, key: 'store_whatsapp', value: '5571999999999' };
    mockRepo.findByKey.mockResolvedValue(settings);

    const result = await useCase.execute('store_whatsapp');

    expect(result).toEqual(settings);
    expect(mockRepo.findByKey).toHaveBeenCalledWith('store_whatsapp');
  });

  it('should return null if key not found', async () => {
    mockRepo.findByKey.mockResolvedValue(null);

    const result = await useCase.execute('non_existent_key');

    expect(result).toBeNull();
  });

  it('should throw error if key is missing', async () => {
    try {
      await useCase.execute('');
      fail('Should have thrown');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should throw error if key is only whitespace', async () => {
    try {
      await useCase.execute('   ');
      fail('Should have thrown');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

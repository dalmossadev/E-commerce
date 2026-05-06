import { ISettingsRepository } from '../../interfaces/ISettingsRepository';
import { Settings } from '../../domain/Settings';
import { BadRequestError, NotFoundError } from '../../errors/CustomErrors';

export class UpdateSettingsUseCase {
  constructor(private settingsRepository: ISettingsRepository) {}

  async execute(key: string, data: { value: string }): Promise<Settings> {
    if (!key?.trim()) {
      throw new BadRequestError('Key is required');
    }
    if (data.value === undefined || data.value === null) {
      throw new BadRequestError('Value is required');
    }

    const existing = await this.settingsRepository.findByKey(key.trim());
    if (!existing) {
      throw new NotFoundError('Settings', key);
    }

    existing.value = data.value.trim();
    return await this.settingsRepository.update(existing);
  }
}

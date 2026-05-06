import { ISettingsRepository } from '../../interfaces/ISettingsRepository';
import { Settings } from '../../domain/Settings';
import { BadRequestError } from '../../errors/CustomErrors';

export class CreateSettingsUseCase {
  constructor(private settingsRepository: ISettingsRepository) {}

  async execute(data: { key: string; value: string }): Promise<Settings> {
    if (!data.key?.trim()) {
      throw new BadRequestError('Key is required');
    }
    if (data.value === undefined || data.value === null) {
      throw new BadRequestError('Value is required');
    }

    const existing = await this.settingsRepository.findByKey(data.key.trim());
    if (existing) {
      throw new BadRequestError('Key already exists');
    }

    const settings = new Settings({
      key: data.key.trim(),
      value: data.value.trim()
    });

    return await this.settingsRepository.save(settings);
  }
}

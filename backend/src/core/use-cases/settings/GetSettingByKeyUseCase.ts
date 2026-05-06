import { ISettingsRepository } from '../../interfaces/ISettingsRepository';
import { Settings } from '../../domain/Settings';
import { BadRequestError } from '../../errors/CustomErrors';

export class GetSettingByKeyUseCase {
  constructor(private settingsRepository: ISettingsRepository) {}

  async execute(key: string): Promise<Settings | null> {
    if (!key?.trim()) {
      throw new BadRequestError('Key is required');
    }

    return await this.settingsRepository.findByKey(key.trim());
  }
}

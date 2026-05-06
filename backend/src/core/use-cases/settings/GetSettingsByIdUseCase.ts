import { ISettingsRepository } from '../../interfaces/ISettingsRepository';
import { Settings } from '../../domain/Settings';
import { NotFoundError } from '../../errors/CustomErrors';

export class GetSettingsByIdUseCase {
  constructor(private settingsRepository: ISettingsRepository) {}

  async execute(id: number): Promise<Settings> {
    const settings = await this.settingsRepository.findById(id);
    if (!settings) {
      throw new NotFoundError('Settings', id);
    }
    return settings;
  }
}

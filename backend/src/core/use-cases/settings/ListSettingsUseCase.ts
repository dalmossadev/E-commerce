import { ISettingsRepository } from '../../interfaces/ISettingsRepository';
import { Settings } from '../../domain/Settings';

export class ListSettingsUseCase {
  constructor(private settingsRepository: ISettingsRepository) {}

  async execute(): Promise<Settings[]> {
    return await this.settingsRepository.findAll();
  }
}

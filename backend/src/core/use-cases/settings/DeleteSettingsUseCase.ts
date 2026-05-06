import { ISettingsRepository } from '../../interfaces/ISettingsRepository';
import { BadRequestError, NotFoundError } from '../../errors/CustomErrors';

export class DeleteSettingsUseCase {
  constructor(private settingsRepository: ISettingsRepository) {}

  async execute(key: string): Promise<void> {
    if (!key?.trim()) {
      throw new BadRequestError('Key is required');
    }

    const existing = await this.settingsRepository.findByKey(key.trim());
    if (!existing) {
      throw new NotFoundError('Settings', key);
    }
    await this.settingsRepository.delete(existing.id);
  }
}

import { ISettingsRepository } from '@core/interfaces/ISettingsRepository';
import { Settings } from '@core/domain/Settings';
import { BadRequestError, NotFoundError } from '@core/errors/CustomErrors';

export class GetSettingByKeyUseCase {
  constructor(private settingsRepository: ISettingsRepository) {}

  async execute(key: string): Promise<Settings | null> {
    if (!key?.trim()) {
      throw new BadRequestError('Key is required');
    }

    return await this.settingsRepository.findByKey(key.trim());
  }
}

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

export class ListSettingsUseCase {
  constructor(private settingsRepository: ISettingsRepository) {}

  async execute(): Promise<Settings[]> {
    return await this.settingsRepository.findAll();
  }
}

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

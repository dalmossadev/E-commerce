import { AppDataSource } from '@infrastructure/database/data-source';
import { Settings } from '@core/domain/Settings';
import { ISettingsRepository } from '@core/interfaces/ISettingsRepository';

export class TypeORMSettingsRepository implements ISettingsRepository {
  private repository = AppDataSource.getRepository(Settings);

  async save(settings: Settings): Promise<Settings> {
    return await this.repository.save(settings);
  }

  async findById(id: number): Promise<Settings | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByKey(key: string): Promise<Settings | null> {
    return await this.repository.findOne({ where: { key } });
  }

  async update(settings: Settings): Promise<Settings> {
    return await this.repository.save(settings);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findAll(): Promise<Settings[]> {
    return await this.repository.find();
  }

  async updateByKey(key: string, value: string): Promise<Settings> {
    let setting = await this.findByKey(key);
    if (!setting) {
      setting = new Settings({ key, value });
    } else {
      setting.value = value;
    }
    return await this.repository.save(setting);
  }
}

import { Settings } from '@core/domain/Settings';

export interface ISettingsRepository {
  save(settings: Settings): Promise<Settings>;
  findById(id: number): Promise<Settings | null>;
  findByKey(key: string): Promise<Settings | null>;
  update(settings: Settings): Promise<Settings>;
  delete(id: number): Promise<void>;
  findAll(): Promise<Settings[]>;
  updateByKey(key: string, value: string): Promise<Settings>;
}

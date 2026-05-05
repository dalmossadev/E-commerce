// src/core/interfaces/ISiteConfigRepository.ts
import { SiteConfig } from "../domain/SiteConfig";

export interface ISiteConfigRepository {
  getConfig(): Promise<SiteConfig | null>;
  saveConfig(config: SiteConfig): Promise<SiteConfig>;
}

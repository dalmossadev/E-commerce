// src/infrastructure/database/repositories/TypeORMSiteConfigRepository.ts
import { Repository } from "typeorm";
import { SiteConfig } from "../../../core/domain/SiteConfig";
import { ISiteConfigRepository } from "../../../core/interfaces/ISiteConfigRepository";
import { AppDataSource } from "../data-source";
import { SiteConfigSchema } from "../mappers/SiteConfigSchema";

export class TypeORMSiteConfigRepository implements ISiteConfigRepository {
  private repository: Repository<SiteConfig>;

  constructor() {
    this.repository = AppDataSource.getRepository(SiteConfigSchema);
  }

  async getConfig(): Promise<SiteConfig | null> {
    const config = await this.repository.findOne({ where: {} });
    return config || null;
  }

  async saveConfig(config: SiteConfig): Promise<SiteConfig> {
    return await this.repository.save(config);
  }
}

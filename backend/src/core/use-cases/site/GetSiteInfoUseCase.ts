// src/core/use-cases/site/GetSiteInfoUseCase.ts
import { SiteConfig } from "../../domain/SiteConfig";
import { ISiteConfigRepository } from "../../interfaces/ISiteConfigRepository";

export class GetSiteInfoUseCase {
  constructor(private siteConfigRepository: ISiteConfigRepository) {}

  async execute(): Promise<SiteConfig | null> {
    return await this.siteConfigRepository.getConfig();
  }
}

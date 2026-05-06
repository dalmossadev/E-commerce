import { IBannerRepository } from "@core/interfaces/IBannerRepository";
import { Banner, BannerProps } from "@core/domain/Banner";

export class UpdateBannerUseCase {
  constructor(private bannerRepository: IBannerRepository) {}

  async execute(id: string, data: Partial<BannerProps>): Promise<Banner> {
    const existing = await this.bannerRepository.findById(id);
    if (!existing) throw new Error("Banner não encontrado");

    await this.bannerRepository.update(id, data);
    const updated = await this.bannerRepository.findById(id);
    return updated!;
  }
}

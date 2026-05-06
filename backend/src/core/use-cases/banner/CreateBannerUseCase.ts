import { IBannerRepository } from "@core/interfaces/IBannerRepository";
import { Banner, BannerProps } from "@core/domain/Banner";

export class CreateBannerUseCase {
  constructor(private bannerRepository: IBannerRepository) {}

  async execute(data: BannerProps): Promise<Banner> {
    const banner = new Banner(data);
    return await this.bannerRepository.create(banner);
  }
}

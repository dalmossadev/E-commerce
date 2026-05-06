import { IBannerRepository } from "@core/interfaces/IBannerRepository";

export class DeleteBannerUseCase {
  constructor(private bannerRepository: IBannerRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.bannerRepository.findById(id);
    if (!existing) throw new Error("Banner não encontrado");

    await this.bannerRepository.delete(id);
  }
}

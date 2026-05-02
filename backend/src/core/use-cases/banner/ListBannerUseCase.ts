import { IBannerRepository } from "../../../interfaces/IBannerRepository";

export class ListBannersUseCase {
  constructor(private bannerRepository: IBannerRepository) {}

  async execute() {
    // Aqui poderíamos adicionar lógica de ordenação por prioridade
    return await this.bannerRepository.findAll();
  }
}
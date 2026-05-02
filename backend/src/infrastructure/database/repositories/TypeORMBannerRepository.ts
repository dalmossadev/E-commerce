import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { IBannerRepository } from "../../../interfaces/IBannerRepository";
import { Banner, BannerProps } from "../../../domain/Banner";
import { BannerSchema } from "../../database/mappers/BannerSchema";
import { logger } from "../../logger/logger";

export class TypeORMBannerRepository implements IBannerRepository {
  private repository: Repository<BannerProps>;

  constructor() {
    this.repository = AppDataSource.getRepository<BannerProps>(BannerSchema as any);
  }

  async findAll(): Promise<Banner[]> {
    try {
      // Retorna ordenado pela prioridade (LCP primeiro)
      const results = await this.repository.find({
        order: { priority: "DESC" }
      });
      return results.map(props => new Banner(props));
    } catch (error: any) {
      logger.error(`Erro ao buscar banners no banco: ${error.message}`);
      throw new Error("Erro ao acessar dados de banners");
    }
  }

  async findById(id: string): Promise<Banner | null> {
    const result = await this.repository.findOneBy({ id } as any);
    return result ? new Banner(result) : null;
  }

  async create(banner: Banner): Promise<Banner> {
    const newBanner = this.repository.create(banner.toJSON());
    const saved = await this.repository.save(newBanner);
    return new Banner(saved);
  }

  async update(id: string, data: Partial<Banner>): Promise<void> {
    const updateData = data instanceof Banner ? data.toJSON() : data;
    await this.repository.update(id, updateData as any);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
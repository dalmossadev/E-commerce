import { Banner } from "../domain/Banner";

export interface IBannerRepository {
  findAll(): Promise<Banner[]>;
  findById(id: string): Promise<Banner | null>;
  create(banner: Banner): Promise<Banner>;
  update(id: string, banner: Partial<Banner>): Promise<void>;
  delete(id: string): Promise<void>;
}

import { Category, CategoryType } from "../domain/Category";

export interface ICategoryRepository {
  save(category: Category): Promise<Category>;
  findById(id: number): Promise<Category | undefined>;
  findBySlug(slug: string): Promise<Category | undefined>;
  findAll(type?: CategoryType, parentId?: number): Promise<Category[]>;
  update(category: Category): Promise<Category>;
  delete(id: number): Promise<void>;
}

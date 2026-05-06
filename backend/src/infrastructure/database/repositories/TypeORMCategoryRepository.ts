import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Category, CategoryType } from "@core/domain/Category";
import { CategorySchema } from "../mappers/CategorySchema";
import { ICategoryRepository } from "@core/interfaces/ICategoryRepository";

export class TypeORMCategoryRepository implements ICategoryRepository {
  private repository: Repository<Category>;

  constructor() {
    this.repository = AppDataSource.getRepository(CategorySchema);
  }

  async save(category: Category): Promise<Category> {
    return await this.repository.save(category);
  }

  async findById(id: number): Promise<Category | undefined> {
    const category = await this.repository.findOne({ 
      where: { id },
      relations: ['parent', 'children']
    });
    return category || undefined;
  }

  async findBySlug(slug: string): Promise<Category | undefined> {
    const category = await this.repository.findOne({ 
      where: { slug },
      relations: ['parent', 'children']
    });
    return category || undefined;
  }

  async findAll(type?: CategoryType, parentId?: number): Promise<Category[]> {
    const where: any = {};
    if (type) where.type = type;
    if (parentId !== undefined) where.parentId = parentId;

    return await this.repository.find({ 
      where,
      relations: ['parent'],
      order: { name: 'ASC' }
    });
  }

  async update(category: Category): Promise<Category> {
    return await this.repository.save(category);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}

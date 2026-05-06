import { Category } from "../../domain/Category";
import { ICategoryRepository } from "../../interfaces/ICategoryRepository";
import { CreateCategoryDTO } from "../../dto/CategoryDTO";

export class CreateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(data: CreateCategoryDTO): Promise<Category> {
    const existing = await this.categoryRepository.findBySlug(data.slug);
    if (existing) {
      throw new Error('Category with this slug already exists');
    }

    const category = new Category({
      name: data.name,
      slug: data.slug,
      description: data.description,
      type: data.type,
      parentId: data.parentId
    });

    return await this.categoryRepository.save(category);
  }
}

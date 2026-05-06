import { Category } from "../../domain/Category";
import { ICategoryRepository } from "../../interfaces/ICategoryRepository";
import { UpdateCategoryDTO } from "../../dto/CategoryDTO";

export class UpdateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(id: number, data: UpdateCategoryDTO): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }

    if (data.name) category.name = data.name;
    if (data.slug) {
      const existing = await this.categoryRepository.findBySlug(data.slug);
      if (existing && existing.id !== id) {
        throw new Error('Category with this slug already exists');
      }
      category.slug = data.slug;
    }
    if (data.description !== undefined) category.description = data.description;
    if (data.parentId !== undefined) category.parentId = data.parentId;

    return await this.categoryRepository.update(category);
  }
}

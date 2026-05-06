import { Category, CategoryType } from "../../domain/Category";
import { ICategoryRepository } from "../../interfaces/ICategoryRepository";

export class ListCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(type?: CategoryType, parentId?: number): Promise<Category[]> {
    return await this.categoryRepository.findAll(type, parentId);
  }
}

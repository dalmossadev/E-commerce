import { ICategoryRepository } from "../../interfaces/ICategoryRepository";

export class DeleteCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(id: number): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    
    // Check for children
    if (category.children && category.children.length > 0) {
      throw new Error('Cannot delete category with subcategories');
    }

    await this.categoryRepository.delete(id);
  }
}

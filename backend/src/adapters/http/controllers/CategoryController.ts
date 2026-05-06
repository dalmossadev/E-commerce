import { Request, Response, NextFunction } from 'express';
import { CreateCategoryUseCase } from '@core/use-cases/category/CreateCategoryUseCase';
import { ListCategoriesUseCase } from '@core/use-cases/category/ListCategoriesUseCase';
import { UpdateCategoryUseCase } from '@core/use-cases/category/UpdateCategoryUseCase';
import { DeleteCategoryUseCase } from '@core/use-cases/category/DeleteCategoryUseCase';
import { CategoryType } from '@core/domain/Category';

export class CategoryController {
  constructor(
    private createCategoryUseCase: CreateCategoryUseCase,
    private listCategoriesUseCase: ListCategoriesUseCase,
    private updateCategoryUseCase: UpdateCategoryUseCase,
    private deleteCategoryUseCase: DeleteCategoryUseCase
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await this.createCategoryUseCase.execute(req.body);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, parentId } = req.query;
      const categories = await this.listCategoriesUseCase.execute(
        type as CategoryType, 
        parentId ? Number(parentId) : undefined
      );
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const category = await this.updateCategoryUseCase.execute(id, req.body);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await this.deleteCategoryUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

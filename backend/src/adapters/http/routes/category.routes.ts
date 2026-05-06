import { Router } from 'express';
import { container } from '@core/container/Container';
import { validate } from '../middlewares/ValidationMiddleware';
import { createCategorySchema, updateCategorySchema } from '../validations/category.validation';

const categoryRouter = Router();
const controller = container.getCategoryController();

categoryRouter.post('/', validate(createCategorySchema), (req, res, next) => controller.create(req, res, next));
categoryRouter.get('/', (req, res, next) => controller.list(req, res, next));
categoryRouter.put('/:id', validate(updateCategorySchema), (req, res, next) => controller.update(req, res, next));
categoryRouter.delete('/:id', (req, res, next) => controller.delete(req, res, next));

export { categoryRouter };

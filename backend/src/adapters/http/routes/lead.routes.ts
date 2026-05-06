import { Router } from 'express';
import { validate } from '../middlewares/ValidationMiddleware';
import { createLeadSchema, updateLeadSchema } from '../validations/lead.validation';
import { container } from '@core/container/Container';

const leadRouter = Router();
const leadController = container.getLeadController();

leadRouter.post('/', validate(createLeadSchema), (req, res, next) => leadController.create(req, res, next));
leadRouter.get('/', (req, res, next) => leadController.list(req, res, next));
leadRouter.get('/:id', (req, res, next) => leadController.getById(req, res, next));
leadRouter.patch('/:id', validate(updateLeadSchema), (req, res, next) => leadController.update(req, res, next));
leadRouter.delete('/:id', (req, res, next) => leadController.delete(req, res, next));

export { leadRouter };
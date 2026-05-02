import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerController';
import { validate } from '../middlewares/ValidationMiddleware';
import { createCustomerSchema, updateCustomerSchema } from '../validations/customer.validation';

export { CustomerController };

const customerRouter = Router();

const customerController = new CustomerController();

customerRouter.post('/', validate(createCustomerSchema), (req, res, next) => customerController.create(req, res, next));
customerRouter.get('/', (req, res, next) => customerController.list(req, res, next));
customerRouter.get('/:id', (req, res, next) => customerController.getById(req, res, next));
customerRouter.patch('/:id', validate(updateCustomerSchema), (req, res, next) => customerController.update(req, res, next));
customerRouter.delete('/:id', (req, res, next) => customerController.delete(req, res, next));

export { customerRouter };

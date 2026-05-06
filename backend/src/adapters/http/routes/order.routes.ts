import { Router } from 'express';
import { validate } from '../middlewares/ValidationMiddleware';
import { authenticate, requireCustomer, requireAdmin } from '../middlewares/AuthMiddleware';
import { createOrderSchema, updateOrderStatusSchema, applyDiscountSchema } from '../validations/order.validation';
import { container } from '@core/container/Container';

const orderRouter = Router();
const orderController = container.getOrderController();

orderRouter.get('/', authenticate, requireCustomer, (req, res, next) => orderController.list(req, res, next));
orderRouter.post('/', validate(createOrderSchema), (req, res, next) => orderController.create(req, res, next));
orderRouter.get('/:id', authenticate, requireCustomer, (req, res, next) => orderController.getById(req, res, next));
orderRouter.patch('/:id/status', authenticate, requireCustomer, validate(updateOrderStatusSchema), (req, res, next) => orderController.updateStatus(req, res, next));
orderRouter.patch('/:id/cancel', authenticate, requireCustomer, (req, res, next) => orderController.cancel(req, res, next));
orderRouter.patch('/:id/discount', authenticate, requireCustomer, validate(applyDiscountSchema), (req, res, next) => orderController.applyDiscount(req, res, next));
orderRouter.post('/:id/refresh-session', authenticate, requireCustomer, (req, res, next) => orderController.refreshSession(req, res, next));
orderRouter.get('/:id/pix', (req, res, next) => orderController.getPix(req, res, next));
orderRouter.patch('/:id/confirm-payment', authenticate, requireAdmin, (req, res, next) => orderController.confirmPayment(req, res, next));

export { orderRouter };
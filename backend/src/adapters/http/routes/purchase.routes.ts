import { Router } from 'express';
import { PurchaseController } from '../controllers/PurchaseController';
import { validate } from '../middlewares/ValidationMiddleware';
import { createPurchaseSchema, updatePurchaseSchema, receiveInventorySchema } from '../validations/purchase.validation';

export { PurchaseController };

const purchaseRouter = Router();

const purchaseController = new PurchaseController();

purchaseRouter.post('/', validate(createPurchaseSchema), (req, res, next) => purchaseController.create(req, res, next));
purchaseRouter.get('/', (req, res, next) => purchaseController.list(req, res, next));
purchaseRouter.get('/:id', (req, res, next) => purchaseController.getById(req, res, next));
purchaseRouter.patch('/:id', validate(updatePurchaseSchema), (req, res, next) => purchaseController.update(req, res, next));
purchaseRouter.post('/:id/receive', validate(receiveInventorySchema), (req, res, next) => purchaseController.receiveInventory(req, res, next));
purchaseRouter.delete('/:id', (req, res, next) => purchaseController.delete(req, res, next));

export { purchaseRouter };
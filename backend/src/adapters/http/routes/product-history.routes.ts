import { Router } from 'express';
import { ProductHistoryController } from '../controllers/ProductHistoryController';

export { ProductHistoryController };

const productHistoryRouter = Router();

const productHistoryController = new ProductHistoryController();

productHistoryRouter.get('/', (req, res, next) => productHistoryController.getAll(req, res, next));
productHistoryRouter.get('/:sku', (req, res, next) => productHistoryController.getBySku(req, res, next));

export { productHistoryRouter };

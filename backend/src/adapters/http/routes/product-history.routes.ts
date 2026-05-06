import { Router } from 'express';
import { container } from '@core/container/Container';

const productHistoryRouter = Router();
const productHistoryController = container.getProductHistoryController();

productHistoryRouter.get('/', (req, res, next) => productHistoryController.getAll(req, res, next));
productHistoryRouter.get('/:sku', (req, res, next) => productHistoryController.getBySku(req, res, next));

export { productHistoryRouter };

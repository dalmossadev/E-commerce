import { Router } from 'express';
import { container } from '@core/container/Container';

const adminRouter = Router();
const adminController = container.getAdminController();

adminRouter.get('/dashboard', (req, res, next) => adminController.getDashboard(req, res, next));
adminRouter.get('/stats', (req, res, next) => adminController.getStats(req, res, next));

export { adminRouter };
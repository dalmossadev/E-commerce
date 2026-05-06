import { Router } from 'express';
import { container } from '@core/container/Container';
import { requireAuth, requireAdmin } from '@adapters/http/middlewares/AuthMiddleware';

const financialRouter = Router();
const financialController = container.getFinancialController();

// Protegido: Apenas ADMIN pode acessar dados financeiros
financialRouter.get(
  '/dashboard',
  requireAuth,
  requireAdmin,
  (req, res) => financialController.getDashboard(req, res)
);

export { financialRouter };

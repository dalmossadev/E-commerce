import { Router } from 'express';
import { FinancialController } from '@adapters/http/controllers/FinancialController';
import { container } from '@core/container/Container';
import { requireAuth, requireAdmin } from '@adapters/http/middlewares/AuthMiddleware';

const financialRouter = Router();

// Extraindo o caso de uso do container (vamos adicioná-lo lá)
const financialController = new FinancialController(
  container.getFinancialDashboardUseCase()
);

// Protegido: Apenas ADMIN pode acessar dados financeiros
financialRouter.get(
  '/dashboard',
  requireAuth,
  requireAdmin,
  (req, res) => financialController.getDashboard(req, res)
);

export { financialRouter };

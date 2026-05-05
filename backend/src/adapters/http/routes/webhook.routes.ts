import { Router, raw } from 'express';
import { WebhookController } from '@adapters/http/controllers/WebhookController';
import { TypeORMOrderRepository } from '@infrastructure/database/repositories/TypeORMOrderRepository';
import { TypeORMAuditRepository } from '@infrastructure/database/repositories/TypeORMAuditRepository';
import { InfinitePayService } from '@infrastructure/services/InfinitePayService';
import { AppDataSource } from '@infrastructure/database/data-source';
import { AuditLogModel } from '@infrastructure/database/models/AuditLogModel';
import { TypeORMFinancialTransactionRepository } from '@infrastructure/database/repositories/TypeORMFinancialTransactionRepository';

const webhookRouter = Router();

const orderRepo = new TypeORMOrderRepository();
const auditRepo = new TypeORMAuditRepository(AppDataSource.getRepository(AuditLogModel));
const paymentProvider = new InfinitePayService();
const financialRepo = new TypeORMFinancialTransactionRepository();

const webhookController = new WebhookController(orderRepo, auditRepo, paymentProvider, financialRepo);

// IMPORTANT: express.raw is required to validate InfinitePay HMAC correctly
webhookRouter.post(
  '/infinitepay', 
  raw({ type: 'application/json' }), 
  (req, res) => webhookController.handleInfinitePayWebhook(req, res)
);

export { webhookRouter };

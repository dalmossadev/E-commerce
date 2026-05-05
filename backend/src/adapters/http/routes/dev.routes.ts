import { Router, Request, Response } from 'express';
import { TypeORMOrderRepository } from '@infrastructure/database/repositories/TypeORMOrderRepository';
import { TypeORMAuditRepository } from '@infrastructure/database/repositories/TypeORMAuditRepository';
import { TypeORMFinancialTransactionRepository } from '@infrastructure/database/repositories/TypeORMFinancialTransactionRepository';
import { ConfirmPaymentUseCase } from '@core/use-cases/orders/ConfirmPaymentUseCase';
import { AppDataSource } from '@infrastructure/database/data-source';
import { AuditLogModel } from '@infrastructure/database/models/AuditLogModel';
import { PaymentMethod, OrderStatus } from '@core/domain/Order';

const devRoutes = Router();

devRoutes.post('/simulate-payment', async (req: Request, res: Response): Promise<void> => {
  if (process.env.NODE_ENV === 'production') {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  try {
    const { orderId } = req.body;

    if (!orderId) {
      res.status(400).json({ error: 'Missing orderId' });
      return;
    }

    const orderRepo = new TypeORMOrderRepository();
    const auditRepo = new TypeORMAuditRepository(AppDataSource.getRepository(AuditLogModel));
    const financialRepo = new TypeORMFinancialTransactionRepository();

    const order = await orderRepo.findById(Number(orderId));

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (order.isPaid() || order.status === OrderStatus.PAID || order.paymentStatus === 'PAID') { // Ensure domain check
      res.status(200).json({ success: true, message: 'Já confirmado', orderId, status: 'PAID' });
      return;
    }

    const confirmPaymentUseCase = new ConfirmPaymentUseCase(orderRepo, auditRepo, financialRepo);
    await confirmPaymentUseCase.execute(Number(orderId), 0, req.ip, req.headers['user-agent']);

    res.status(200).json({ success: true, orderId: order.id, status: 'PAID' });
  } catch (error: any) {
    console.error('Simulate payment error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export { devRoutes };

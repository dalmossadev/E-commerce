import { Request, Response } from 'express';
import crypto from 'crypto';
import { IOrderRepository } from '@core/interfaces/IOrderRepository';
import { IAuditRepository } from '@core/interfaces/IAuditRepository';
import { PaymentMethod } from '@core/domain/Order';

import { IPaymentProvider } from '@core/interfaces/IPaymentProvider';
import { IFinancialTransactionRepository } from '@core/interfaces/IFinancialTransactionRepository';
import { FinancialTransaction, TransactionType, ReferenceType, TransactionStatus } from '@core/domain/FinancialTransaction';

export class WebhookController {
  constructor(
    private orderRepository: IOrderRepository,
    private auditRepository: IAuditRepository,
    private paymentProvider: IPaymentProvider,
    private financialRepository?: IFinancialTransactionRepository
  ) {}

  async handleInfinitePayWebhook(req: Request, res: Response): Promise<void> {
    try {
      const signature = req.headers['x-infinitepay-signature'] as string;
      const secret = process.env.INFINITEPAY_WEBHOOK_SECRET || '';

      if (!signature) {
        res.status(401).json({ error: 'Missing signature' });
        return;
      }

      // Compute HMAC. In production, we should use req.rawBody or express.raw()
      const payload = req.body instanceof Buffer ? req.body.toString('utf8') : JSON.stringify(req.body);
      
      const isValid = this.paymentProvider.validateWebhookSignature(payload, signature, secret);

      if (!isValid && process.env.NODE_ENV === 'production') {
        await this.auditRepository.saveLog({
          action: 'WEBHOOK_FAILED',
          entity: 'System',
          newValue: 'Invalid InfinitePay webhook signature attempt',
          userId: 0
        });
        res.status(401).json({ error: 'Invalid signature' });
        return;
      }

      let parsedBody = req.body;
      if (req.body instanceof Buffer) {
        parsedBody = JSON.parse(req.body.toString('utf8'));
      }
      
      const { id, status, metadata } = parsedBody;
      const orderId = metadata?.orderId;

      if (!orderId) {
        res.status(400).json({ error: 'Missing orderId in metadata' });
        return;
      }

      const order = await this.orderRepository.findByExternalId(id);
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      await this.auditRepository.saveLog({
        action: 'WEBHOOK_RECEIVED',
        entity: 'Order',
        entityId: order.id.toString(),
        newValue: `Webhook received with status ${status} for external id ${id}`,
        userId: 0
      });

      if (status === 'approved') {
        if (!order.isPaid()) {
          order.markAsPaid(PaymentMethod.PIX);
          order.paymentStatus = 'PAID';
          order.paymentConfirmedAt = new Date();
          await this.orderRepository.update(order);
          
          if (this.financialRepository) {
            const isPix = order.paymentMethod === PaymentMethod.PIX;
            const feeAmount = isPix ? 99 : 0; 
            
            await this.financialRepository.create(new FinancialTransaction({
              referenceId: order.id,
              referenceType: ReferenceType.ORDER,
              type: TransactionType.INCOME,
              amount: order.total,
              status: TransactionStatus.SETTLED,
              paymentMethod: order.paymentMethod,
              provider: 'INFINITEPAY',
              expectedSettlementDate: new Date(),
              settledAt: new Date(),
              description: `Recebimento Pedido #${order.id} via Webhook`,
              createdAt: new Date(),
              updatedAt: new Date()
            }));

            if (feeAmount > 0) {
              await this.financialRepository.create(new FinancialTransaction({
                referenceId: order.id,
                referenceType: ReferenceType.ORDER,
                type: TransactionType.FEE,
                amount: feeAmount,
                status: TransactionStatus.SETTLED,
                paymentMethod: order.paymentMethod,
                provider: 'INFINITEPAY',
                expectedSettlementDate: new Date(),
                settledAt: new Date(),
                description: `Taxa InfinitePay Pedido #${order.id} via Webhook`,
                createdAt: new Date(),
                updatedAt: new Date()
              }));
            }
          }

          await this.auditRepository.saveLog({
            action: 'payment_confirmed',
            entity: 'Order',
            entityId: order.id.toString(),
            newValue: `Order marked as PAID via InfinitePay Webhook (externalId: ${id})`,
            userId: 0
          });
        }
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

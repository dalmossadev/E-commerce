import { IOrderRepository } from '@core/interfaces/IOrderRepository';
import { IAuditRepository } from '@core/interfaces/IAuditRepository';
import { BadRequestError, NotFoundError } from '@core/errors/CustomErrors';
import { Order, OrderStatus, PaymentMethod } from '@core/domain/Order';
import { IFinancialTransactionRepository } from '@core/interfaces/IFinancialTransactionRepository';
import { FinancialTransaction, TransactionType, ReferenceType, TransactionStatus } from '@core/domain/FinancialTransaction';

export class ConfirmPaymentUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private auditRepository: IAuditRepository,
    private financialRepository?: IFinancialTransactionRepository
  ) {}

  async execute(id: number, userId?: number, ip?: string, userAgent?: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Order', id);
    }
    
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestError('Order is not PENDING');
    }
    
    order.status = OrderStatus.PAID;
    order.paymentConfirmedAt = new Date();
    order.paymentMethod = PaymentMethod.PIX;
    
    await this.orderRepository.update(order);
    
    if (this.financialRepository) {
      const isPix = order.paymentMethod === PaymentMethod.PIX;
      // Taxa fixa de MVP: R$ 0,99 se for PIX InfinitPay, ou 0 por enquanto
      const feeAmount = isPix ? 99 : 0; 
      
      // Criar transação de Entrada (INCOME)
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
        description: `Recebimento Pedido #${order.id}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      // Criar transação de Taxa (FEE) se houver
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
          description: `Taxa InfinitePay Pedido #${order.id}`,
          createdAt: new Date(),
          updatedAt: new Date()
        }));
      }
    }
    
    await this.auditRepository.saveLog({
      userId,
      action: 'payment_confirmed',
      entity: 'Order',
      entityId: String(order.id),
      newValue: JSON.stringify({ status: OrderStatus.PAID, paymentConfirmedAt: order.paymentConfirmedAt }),
      ip,
      userAgent
    });
    
    return order;
  }
}

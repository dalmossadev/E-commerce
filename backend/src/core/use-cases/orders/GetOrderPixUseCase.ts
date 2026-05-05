import { IOrderRepository } from '@core/interfaces/IOrderRepository';
import { PixService } from '@infrastructure/pix/PixService';
import { BadRequestError, NotFoundError } from '@core/errors/CustomErrors';
import { OrderStatus } from '@core/domain/Order';

export class GetOrderPixUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(id: number): Promise<any> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new NotFoundError('Order', id);
    if (order.status !== OrderStatus.PENDING) throw new BadRequestError('Order is not PENDING');

    console.log("ORDER LOADED:", order); 
    const amountInReais = order.total / 100;
    
    let payload = order.paymentQrCode;
    
    if (!payload) {
      payload = PixService.generatePixPayload({
        key: process.env.PIX_KEY || '',
        name: process.env.PIX_NAME || 'Sisters Lab',
        city: process.env.PIX_CITY || 'SALVADOR',
        amount: order.total,
        orderId: order.id
      });
    }
    
    const qrCodeBase64 = await PixService.generatePixQRCode(payload);
    
    return {
      orderId: order.id,
      payload,
      qrCodeBase64,
      amount: amountInReais,
      expiresIn: 1800
    };
  }
}

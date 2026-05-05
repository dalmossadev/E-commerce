// src/core/use-cases/payment/GeneratePaymentQRCodeUseCase.ts
import { IQRCodeService } from "@core/interfaces/IQRCodeService";
import { IPaymentProps } from "@core/interfaces/IPaymentProps";
import { IPaymentRepository } from "@core/interfaces/IPaymentRepository";
import { Payment, PaymentMethod, PaymentStatus } from "../../domain/Payment";

export class GeneratePaymentQRCodeUseCase {
  constructor(
    private qrCodeService: IQRCodeService,
    private paymentRepository: IPaymentRepository
  ) {}

  async execute(data: IPaymentProps): Promise<Payment> {
    const payload = this.generatePixPayload(data);
    const qrCodeBase64 = await this.qrCodeService.generateBase64(payload);

    const payment = new Payment({
      orderId: data.orderId,
      amount: data.amount,
      method: PaymentMethod.PIX,
      status: PaymentStatus.PENDING,
      qrCode: qrCodeBase64,
      pixPayload: payload,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutos expiração
    });

    return await this.paymentRepository.save(payment);
  }

  private generatePixPayload(data: IPaymentProps): string {
    const amountStr = (data.amount / 100).toFixed(2);
    
    // Payload Format Indicator
    const pfi = "000201";
    
    // Merchant Account Information (GUI + Chave PIX)
    const gui = "0014br.gov.bcb.pix";
    const key = `01${data.pixKey.length.toString().padStart(2, '0')}${data.pixKey}`;
    const mai = `26${(gui.length + key.length).toString().padStart(2, '0')}${gui}${key}`;
    
    // Merchant Category Code
    const mcc = "52040000";
    
    // Transaction Currency (986 = BRL)
    const currency = "5303986";
    
    // Transaction Amount
    const amount = `54${amountStr.length.toString().padStart(2, '0')}${amountStr}`;
    
    // Country Code
    const country = "5802BR";
    
    // Merchant Name
    const merchantName = `59${data.merchantName.length.toString().padStart(2, '0')}${data.merchantName}`;
    
    // Merchant City
    const city = `60${data.city.length.toString().padStart(2, '0')}${data.city}`;
    
    // Additional Data Field Template (TXID)
    const txid = "0503***"; 
    const adft = `62${txid.length.toString().padStart(2, '0')}${txid}`;
    
    const rawPayload = `${pfi}${mai}${mcc}${currency}${amount}${country}${merchantName}${city}${adft}6304`;
    
    const crc = this.calculateCRC16(rawPayload);
    return `${rawPayload}${crc}`;
  }

  private calculateCRC16(payload: string): string {
    let result = 0xFFFF;
    for (let i = 0; i < payload.length; i++) {
      result ^= payload.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if (result & 0x8000) {
          result = (result << 1) ^ 0x1021;
        } else {
          result <<= 1;
        }
      }
    }
    return (result & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  }
}
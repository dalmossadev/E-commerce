import { Request, Response, NextFunction } from "express";
import { GeneratePaymentQRCodeUseCase } from "@core/use-cases/payment/GeneratePaymentQRCodeUseCase";
import { logger } from "@infrastructure/logger/logger";
import { z } from "zod";

const paymentSchema = z.object({
  orderId: z.number().int().positive(),
  amount: z.number().positive("O valor deve ser maior que zero"),
  pixKey: z.string().min(1, "A chave PIX é obrigatória"),
  merchantName: z.string().min(1, "O nome do recebedor é obrigatório"),
  city: z.string().min(1, "A cidade é obrigatória"),
  description: z.string().optional(),
});

export class PaymentController {
  constructor(private generatePaymentUseCase: GeneratePaymentQRCodeUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = paymentSchema.safeParse(req.body);

      if (!validation.success) {
        res.status(400).json({ 
          message: "Dados inválidos", 
          errors: validation.error.format() 
        });
        return;
      }

      const payment = await this.generatePaymentUseCase.execute(validation.data);

      res.json({ 
        payment,
        message: "QR Code gerado com sucesso e registrado no sistema." 
      });
    } catch (error: any) {
      logger.error(`Erro ao gerar pagamento: ${error.message}`);
      next(error);
    }
  }
}
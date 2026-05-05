import { Router } from "express";
import { PaymentController } from "@adapters/http/controllers/PaymentController";
import { GeneratePaymentQRCodeUseCase } from "@core/use-cases/payment/GeneratePaymentQRCodeUseCase";
import { QRCodeService } from "@infrastructure/services/QRCodeService";
import { TypeORMPaymentRepository } from "@infrastructure/database/repositories/TypeORMPaymentRepository";
import { WebhookController } from "@adapters/http/controllers/WebhookController";
import { TypeORMAuditRepository } from "@infrastructure/database/repositories/TypeORMAuditRepository";
import { TypeORMOrderRepository } from "@infrastructure/database/repositories/TypeORMOrderRepository";
import { AppDataSource } from "@infrastructure/database/data-source";
import { AuditLogModel } from "@infrastructure/database/models/AuditLogModel";

const paymentRouter = Router();

// Injeção de dependência manual (Factory Pattern)
const qrCodeService = new QRCodeService();
const paymentRepository = new TypeORMPaymentRepository();
const useCase = new GeneratePaymentQRCodeUseCase(qrCodeService, paymentRepository);
const controller = new PaymentController(useCase);

paymentRouter.post("/generate", (req, res, next) => controller.handle(req, res, next));

export { paymentRouter };
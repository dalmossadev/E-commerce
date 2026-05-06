import { Router } from "express";
import { container } from "@core/container/Container";

const paymentRouter = Router();
const controller = container.getPaymentController();

paymentRouter.post("/generate", (req, res, next) => controller.handle(req, res, next));

export { paymentRouter };
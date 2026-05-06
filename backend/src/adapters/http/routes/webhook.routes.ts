import { Router, raw } from 'express';
import { container } from '@core/container/Container';

const webhookRouter = Router();
const webhookController = container.getWebhookController();

// IMPORTANT: express.raw is required to validate InfinitePay HMAC correctly
webhookRouter.post(
  '/infinitepay', 
  raw({ type: 'application/json' }), 
  (req, res) => webhookController.handleInfinitePayWebhook(req, res)
);

export { webhookRouter };

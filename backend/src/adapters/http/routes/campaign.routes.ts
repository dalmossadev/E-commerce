import { Router } from 'express';
import { validate } from '../middlewares/ValidationMiddleware';
import { createCampaignSchema, updateCampaignSchema } from '../validations/campaign.validation';
import { container } from '@core/container/Container';

const campaignRouter = Router();
const campaignController = container.getCampaignController();

campaignRouter.get('/', (req, res, next) => campaignController.list(req, res, next));
campaignRouter.get('/:id', (req, res, next) => campaignController.getById(req, res, next));
campaignRouter.get('/slug/:slug', (req, res, next) => campaignController.getBySlug(req, res, next));
campaignRouter.post('/', validate(createCampaignSchema), (req, res, next) => campaignController.create(req, res, next));
campaignRouter.put('/:id', validate(updateCampaignSchema), (req, res, next) => campaignController.update(req, res, next));
campaignRouter.delete('/:id', (req, res, next) => campaignController.delete(req, res, next));

export { campaignRouter };

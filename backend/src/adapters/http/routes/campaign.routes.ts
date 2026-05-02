import { Router } from 'express';
import { CampaignController } from '../controllers/CampaignController';
import { validate } from '../middlewares/ValidationMiddleware';
import { createCampaignSchema, updateCampaignSchema } from '../validations/campaign.validation';

export { CampaignController };

const campaignRouter = Router();

const campaignController = new CampaignController();

campaignRouter.post('/', validate(createCampaignSchema), (req, res, next) => campaignController.create(req, res, next));
campaignRouter.get('/', (req, res, next) => campaignController.list(req, res, next));
campaignRouter.get('/:id', (req, res, next) => campaignController.getById(req, res, next));
campaignRouter.get('/slug/:slug', (req, res, next) => campaignController.getBySlug(req, res, next));
campaignRouter.patch('/:id', validate(updateCampaignSchema), (req, res, next) => campaignController.update(req, res, next));
campaignRouter.delete('/:id', (req, res, next) => campaignController.delete(req, res, next));

export { campaignRouter };

import { Router } from 'express';
import { container } from '@core/container/Container';
import { validate } from '@adapters/http/middlewares/ValidationMiddleware';
import { createSettingsSchema, updateSettingsSchema } from '@adapters/http/validations/settings.validation';

const settingsRouter = Router();
const settingsController = container.getSettingsController();

// Site Info consolidated endpoints (must be before /:key to avoid catch-all)
settingsRouter.get('/site-info', (req, res, next) => settingsController.getSiteInfo(req, res, next));
settingsRouter.put('/site-info', (req, res, next) => settingsController.updateSiteInfo(req, res, next));

settingsRouter.get('/', (req, res, next) => settingsController.getAll(req, res, next));
settingsRouter.get('/:key', (req, res, next) => settingsController.getByKey(req, res, next));
settingsRouter.post('/', validate(createSettingsSchema), (req, res, next) => settingsController.create(req, res, next));
settingsRouter.patch('/:key', validate(updateSettingsSchema), (req, res, next) => settingsController.update(req, res, next));
settingsRouter.delete('/:key', (req, res, next) => settingsController.delete(req, res, next));

export { settingsRouter };

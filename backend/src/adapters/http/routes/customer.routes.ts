import { Router } from 'express';
import { container } from '@core/container/Container';

const router = Router();
const customerController = container.getCustomerController();

router.get('/', (req, res) => customerController.list(req, res));
router.get('/:id', (req, res) => customerController.getById(req, res));
router.post('/', (req, res) => customerController.create(req, res));
router.put('/:id', (req, res) => customerController.update(req, res));
router.delete('/:id', (req, res) => customerController.delete(req, res));

export { router as customerRouter };

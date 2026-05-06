import { Router } from 'express';
import { container } from '@core/container/Container';

const router = Router();
const supplierController = container.getSupplierController();

router.get('/', (req, res) => supplierController.list(req, res));
router.get('/:id', (req, res) => supplierController.getById(req, res));
router.post('/', (req, res) => supplierController.create(req, res));
router.put('/:id', (req, res) => supplierController.update(req, res));
router.delete('/:id', (req, res) => supplierController.delete(req, res));

export { router as supplierRouter };
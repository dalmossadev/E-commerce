import { Router } from 'express';
import { container } from '@core/container/Container';

const router = Router();
const regionController = container.getRegionController();

// Get all products with region availability
router.get('/:region', (req, res, next) => 
  regionController.getProductsByRegion(req, res, next)
);

// Check if specific product is available for immediate delivery
router.get('/:region/pronta-entrega/:sku', (req, res, next) => 
  regionController.checkProntaEntrega(req, res, next)
);

export { router as regionRouter };

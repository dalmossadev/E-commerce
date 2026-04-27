import { Router, Request, Response, NextFunction } from 'express';
import { SupplierController } from '@adapters/http/controllers/SupplierController';
import { validate } from '@adapters/http/middlewares/ValidationMiddleware';
import { createSupplierSchema, updateSupplierSchema } from '@adapters/http/validations/supplier.validation';
import { container } from '@core/container/Container';

const supplierRouter = Router();

const supplierController = new SupplierController(
  container.createSupplierUseCase(),
  container.listSuppliersUseCase(),
  container.getSupplierByIdUseCase(),
  container.updateSupplierUseCase(),
  container.deleteSupplierUseCase()
);

supplierRouter.post('/', validate(createSupplierSchema), (req, res, next) => supplierController.create(req, res, next));
supplierRouter.get('/', (req, res, next) => supplierController.list(req, res, next));
supplierRouter.get('/:id', (req, res, next) => supplierController.getById(req, res, next));
supplierRouter.put('/:id', validate(updateSupplierSchema), (req, res, next) => supplierController.update(req, res, next));
supplierRouter.delete('/:id', (req, res, next) => supplierController.delete(req, res, next));

export { supplierRouter };
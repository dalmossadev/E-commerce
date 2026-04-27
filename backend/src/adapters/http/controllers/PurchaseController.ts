import { Request, Response, NextFunction } from 'express';
import { CreatePurchaseOrderUseCase, UpdatePurchaseStatusUseCase } from '@core/use-cases/procurement/CreatePurchaseOrderUseCase';
import { ListPurchasesUseCase, GetPurchaseByIdUseCase, DeletePurchaseUseCase } from '@core/use-cases/procurement/ListPurchasesUseCase';
import { ReceiveInventoryUseCase } from '@core/use-cases/procurement/ReceiveInventoryUseCase';
import { CreatePurchaseDTO, UpdatePurchaseDTO, ReceiveInventoryDTO } from '@core/dto/PurchaseDTO';
import { PurchaseStatus } from '@core/domain/Purchase';
import { container } from '@core/container/Container';
import { createPurchaseSchema, updatePurchaseSchema, receiveInventorySchema } from '../validations/purchase.validation';

const parseId = (param: string | string[]): number | null => {
  const id = parseInt(Array.isArray(param) ? param[0] : param, 10);
  return isNaN(id) ? null : id;
};

export class PurchaseController {
  private createPurchaseOrderUseCase: CreatePurchaseOrderUseCase;
  private listPurchasesUseCase: ListPurchasesUseCase;
  private getPurchaseByIdUseCase: GetPurchaseByIdUseCase;
  private updatePurchaseStatusUseCase: UpdatePurchaseStatusUseCase;
  private receiveInventoryUseCase: ReceiveInventoryUseCase;
  private deletePurchaseUseCase: DeletePurchaseUseCase;

  constructor() {
    this.createPurchaseOrderUseCase = container.createPurchaseUseCase();
    this.listPurchasesUseCase = container.listPurchasesUseCase();
    this.getPurchaseByIdUseCase = container.getPurchaseByIdUseCase();
    this.updatePurchaseStatusUseCase = container.updatePurchaseStatusUseCase();
    this.receiveInventoryUseCase = container.receiveInventoryUseCase();
    this.deletePurchaseUseCase = container.deletePurchaseUseCase();
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = createPurchaseSchema.parse(req.body) as CreatePurchaseDTO;
      const purchase = await this.createPurchaseOrderUseCase.execute(data);
      res.status(201).json(purchase);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const status = req.query.status as PurchaseStatus | undefined;
      const supplierId = req.query.supplierId ? parseInt(req.query.supplierId as string, 10) : undefined;
      const purchases = await this.listPurchasesUseCase.execute(status, supplierId);
      res.json(purchases);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        res.status(400).json({ message: 'Invalid purchase ID' });
        return;
      }
      const purchase = await this.getPurchaseByIdUseCase.execute(id);
      res.json(purchase);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        res.status(400).json({ message: 'Invalid purchase ID' });
        return;
      }
      const data = updatePurchaseSchema.parse(req.body) as UpdatePurchaseDTO;
      const purchase = await this.updatePurchaseStatusUseCase.execute(id, data);
      res.json(purchase);
    } catch (error) {
      next(error);
    }
  }

  async receiveInventory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        res.status(400).json({ message: 'Invalid purchase ID' });
        return;
      }
      const data = receiveInventorySchema.parse(req.body) as ReceiveInventoryDTO;
      const purchase = await this.receiveInventoryUseCase.execute(id, data);
      res.json(purchase);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        res.status(400).json({ message: 'Invalid purchase ID' });
        return;
      }
      await this.deletePurchaseUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
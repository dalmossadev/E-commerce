import { Request, Response } from 'express';
import { CreateSupplierUseCase } from '@core/use-cases/supplier/CreateSupplierUseCase';
import { ListSuppliersUseCase } from '@core/use-cases/supplier/ListSuppliersUseCase';
import { GetSupplierByIdUseCase } from '@core/use-cases/supplier/GetSupplierByIdUseCase';
import { UpdateSupplierUseCase } from '@core/use-cases/supplier/UpdateSupplierUseCase';
import { DeleteSupplierUseCase } from '@core/use-cases/supplier/DeleteSupplierUseCase';

export class SupplierController {
  constructor(
    private createSupplierUseCase: CreateSupplierUseCase,
    private listSuppliersUseCase: ListSuppliersUseCase,
    private getSupplierByIdUseCase: GetSupplierByIdUseCase,
    private updateSupplierUseCase: UpdateSupplierUseCase,
    private deleteSupplierUseCase: DeleteSupplierUseCase
  ) {}

  async create(req: Request, res: Response) {
    try {
      const supplier = await this.createSupplierUseCase.execute(req.body);
      res.status(201).json(supplier);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const suppliers = await this.listSuppliersUseCase.execute();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const supplier = await this.getSupplierByIdUseCase.execute(Number(req.params.id));
      if (!supplier) {
        return res.status(404).json({ error: 'Supplier not found' });
      }
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const supplier = await this.updateSupplierUseCase.execute(Number(req.params.id), req.body);
      res.json(supplier);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.deleteSupplierUseCase.execute(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}

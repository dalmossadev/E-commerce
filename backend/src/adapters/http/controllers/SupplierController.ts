import { Request, Response, NextFunction } from 'express';
import { 
  CreateSupplierUseCase, 
  ListSuppliersUseCase, 
  GetSupplierByIdUseCase,
  UpdateSupplierUseCase,
  DeleteSupplierUseCase
} from '@core/use-cases/SupplierUseCases';
import { CreateSupplierDTO, UpdateSupplierDTO } from '@core/dto/SupplierDTO';

export class SupplierController {
  constructor(
    private createSupplierUseCase: CreateSupplierUseCase,
    private listSuppliersUseCase: ListSuppliersUseCase,
    private getSupplierByIdUseCase: GetSupplierByIdUseCase,
    private updateSupplierUseCase: UpdateSupplierUseCase,
    private deleteSupplierUseCase: DeleteSupplierUseCase
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateSupplierDTO = req.body;
      const supplier = await this.createSupplierUseCase.execute(data);
      res.status(201).json(supplier);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const suppliers = await this.listSuppliersUseCase.execute();
      res.json(suppliers);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const supplier = await this.getSupplierByIdUseCase.execute(id);
      if (!supplier) {
        return res.status(404).json({ message: 'Supplier not found' });
      }
      res.json(supplier);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const data: UpdateSupplierDTO = req.body;
      const supplier = await this.updateSupplierUseCase.execute(id, data);
      res.json(supplier);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      await this.deleteSupplierUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}